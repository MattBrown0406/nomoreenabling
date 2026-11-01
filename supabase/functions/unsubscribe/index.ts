import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { base64UrlDecode, deactivateSubscriber, matchEmail, verifyUnsubscribeToken } from "../_shared/unsubscribe.ts";

// Opt-out endpoint for Resend-sent mail (newsletter, weekly digest, course
// drips). Called by the /unsubscribe page (JSON body) and by mail clients via
// RFC 8058 one-click (POST to the List-Unsubscribe URL with e/t in the query).

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method === "GET" || req.method === "HEAD") {
    // Clients without RFC 8058 support open the List-Unsubscribe URL in a
    // browser. Send them to the confirmation page; never unsubscribe on GET
    // (link scanners prefetch URLs).
    const query = new URL(req.url).search;
    return new Response(null, {
      status: 302,
      headers: { ...corsHeaders, Location: `https://nomoreenabling.com/unsubscribe${query}`, "Referrer-Policy": "no-referrer" },
    });
  }
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const url = new URL(req.url);
    let encodedEmail = url.searchParams.get("e") || "";
    let token = url.searchParams.get("t") || "";
    if (!encodedEmail || !token) {
      const body = await req.json().catch(() => ({})) as { e?: unknown; t?: unknown };
      encodedEmail = typeof body.e === "string" ? body.e : "";
      token = typeof body.t === "string" ? body.t : "";
    }

    const email = base64UrlDecode(encodedEmail.slice(0, 600))?.trim().toLowerCase() || "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[0-9a-f]{64}$/.test(token)) {
      return json({ error: "Invalid unsubscribe link" }, 400);
    }
    if (!(await verifyUnsubscribeToken(email, token))) {
      return json({ error: "Invalid unsubscribe link" }, 400);
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    await deactivateSubscriber(supabase, email);

    const { error: courseError } = await matchEmail(
      supabase.from("course_enrollments").update({ is_active: false, next_email_at: null }),
      email,
    ).eq("is_active", true);
    if (courseError) throw courseError;

    // Mirror the opt-out in Mailchimp so its campaigns stop too. The local
    // opt-out above is authoritative (newsletter-signup refuses to silently
    // re-activate a locally unsubscribed address), so log failures rather than
    // failing the reader's request.
    const apiKey = Deno.env.get("MAILCHIMP_API_KEY");
    const audienceId = Deno.env.get("MAILCHIMP_AUDIENCE_ID");
    const dataCenter = apiKey?.split("-").pop();
    if (apiKey && audienceId && dataCenter && dataCenter !== apiKey) {
      try {
        const mailchimpResponse = await fetch(
          `https://${dataCenter}.api.mailchimp.com/3.0/lists/${encodeURIComponent(audienceId)}/members/${encodeURIComponent(email)}`,
          {
            method: "PATCH",
            headers: {
              "Authorization": `Basic ${btoa(`apikey:${apiKey}`)}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ status: "unsubscribed" }),
          },
        );
        // 404: not a Mailchimp member (e.g. course-only or CRM contact).
        if (!mailchimpResponse.ok && mailchimpResponse.status !== 404) {
          console.error("unsubscribe: Mailchimp sync failed with", mailchimpResponse.status);
        }
      } catch (mailchimpError) {
        console.error("unsubscribe: Mailchimp sync error:", mailchimpError instanceof Error ? mailchimpError.message : String(mailchimpError));
      }
    } else {
      console.warn("unsubscribe: Mailchimp not configured; opt-out recorded locally only");
    }

    return json({ success: true });
  } catch (error) {
    console.error("unsubscribe failed:", error instanceof Error ? error.message : String(error));
    return json({ error: "Unable to process unsubscribe right now" }, 500);
  }
});
