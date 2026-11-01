import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendBulkEmails } from "../_shared/bulkEmail.ts";
import { fetchSuppressedEmails, unsubscribeLinks, withUnsubscribeFooter } from "../_shared/unsubscribe.ts";


const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const wrapBranded = (bodyHtml: string, subject: string) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#fdf6ee;font-family:Georgia,serif;color:#2b1d18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ee;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(110,30,20,0.08);">
        <tr><td style="background:linear-gradient(135deg,#7c1d12 0%,#a52a1a 100%);padding:32px;text-align:center;">
          <h1 style="margin:0;font-size:28px;color:#fdf6ee;font-family:Georgia,serif;">No More Enabling</h1>
          <p style="margin:6px 0 0;color:#f7e3cf;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Family Addiction Guidance</p>
        </td></tr>
        <tr><td style="padding:36px;font-size:16px;line-height:1.7;color:#2b1d18;">${bodyHtml}</td></tr>
        <tr><td style="background:#2b1d18;padding:20px 32px;text-align:center;color:#f7e3cf;font-size:13px;">
          <a href="https://nomoreenabling.com" style="color:#f7e3cf;">nomoreenabling.com</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

const markdownish = (text: string) =>
  text.split("\n\n").map((p) => `<p style="margin:0 0 16px;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("");

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: userData } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!userData.user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", userData.user.id).eq("role", "admin").maybeSingle();
    if (!roleData) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { subject, body, recipients, isHtml, mode } = await req.json();
    if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
      return new Response(JSON.stringify({ error: "Missing subject, body, or recipients" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const inner = isHtml ? body : markdownish(body);
    const html = wrapBranded(inner, subject);

    // Paced batch sends (one request per recipient tripped Resend's rate limit
    // and could outlive the function on larger campaigns).
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured");
    // Multi-recipient campaigns are marketing mail: skip anyone who has opted
    // out and give everyone else an unsubscribe link + one-click header.
    // A single direct email to one person is sent as-is.
    const isCampaign = mode === "campaign" || recipients.length > 1;
    const suppressed = isCampaign ? await fetchSuppressedEmails(supabase) : new Set<string>();
    const deliverable = (recipients as string[]).filter((to) => !suppressed.has(String(to).trim().toLowerCase()));
    const skipped = recipients.length - deliverable.length;
    const messages = await Promise.all(deliverable.map(async (to) => {
      if (!isCampaign) {
        return { from: "No More Enabling <contact@nomoreenabling.com>", to, subject, html };
      }
      const unsub = await unsubscribeLinks(to);
      return {
        from: "No More Enabling <contact@nomoreenabling.com>",
        to,
        subject,
        html: withUnsubscribeFooter(html, unsub.footerHtml),
        headers: unsub.headers,
      };
    }));
    const { successful: sent, failed, errors } = await sendBulkEmails(resendApiKey, messages);

    await supabase.from("email_campaigns").insert({
      subject, body_html: html, recipients: deliverable, sent_count: sent, failed_count: failed,
      campaign_type: isCampaign ? "campaign" : "single",
      created_by: userData.user.id, sent_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ success: true, sent, failed, skipped_unsubscribed: skipped, errors }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
