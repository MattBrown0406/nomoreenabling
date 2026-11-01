import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchAllRows } from "../_shared/paginate.ts";
import { sendBulkEmails } from "../_shared/bulkEmail.ts";


const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsletterRequest {
  subject: string;
  html_content: string;
  from_name?: string;
  from_email?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log("Missing authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      console.log("Invalid token or user not found:", authError?.message);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has admin role
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (rolesError || !roles) {
      console.log("User is not an admin:", user.id);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Admin verified:", user.id);

    const { subject, html_content, from_name, from_email }: NewsletterRequest = await req.json();

    // Validate required fields
    if (!subject || !html_content) {
      console.log("Validation failed: Missing required fields");
      return new Response(
        JSON.stringify({ error: "Subject and HTML content are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof subject !== "string" || subject.length > 300) {
      return new Response(
        JSON.stringify({ error: "Invalid subject" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (typeof html_content !== "string" || html_content.length > 200_000) {
      return new Response(
        JSON.stringify({ error: "Invalid html_content" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Defense-in-depth HTML sanitization: strip <script>, <iframe>, <object>,
    // <embed>, <link>, <meta>, <style>, and inline event handlers / javascript: URLs.
    const sanitizeHtml = (input: string): string => {
      let html = input;
      html = html.replace(/<\s*(script|iframe|object|embed|link|meta|style)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
      html = html.replace(/<\s*(script|iframe|object|embed|link|meta|style)\b[^>]*\/?>/gi, "");
      html = html.replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
      html = html.replace(/(href|src|xlink:href)\s*=\s*(['"]?)\s*javascript:[^'">\s]*\2/gi, '$1="#"');
      return html;
    };

    const safeHtmlContent = sanitizeHtml(html_content);


    // Fetch all active subscribers (reusing the existing supabase client)
    // Page through: a plain select is capped at 1000 rows by PostgREST.
    const subscribers = await fetchAllRows<{ email: string; first_name: string | null }>(() =>
      supabase
        .from("subscribers")
        .select("email, first_name")
        .eq("is_active", true)
        .order("email", { ascending: true })
    );

    if (!subscribers || subscribers.length === 0) {
      console.log("No active subscribers found");
      return new Response(
        JSON.stringify({ error: "No active subscribers found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Sending newsletter to ${subscribers.length} subscribers`);

    // Prepare from address
    // onboarding@resend.dev only delivers to the Resend account owner, so a
    // blast without from_email would fail for every subscriber. Only allow
    // senders on the verified domain.
    const safeFromEmail = typeof from_email === "string" && /^[a-z0-9._-]+@nomoreenabling\.com$/i.test(from_email.trim())
      ? from_email.trim()
      : "contact@nomoreenabling.com";
    const safeFromName = typeof from_name === "string" && from_name.trim()
      ? from_name.trim().replace(/[<>"\r\n]/g, "").slice(0, 80)
      : "No More Enabling";
    const fromAddress = `${safeFromName} <${safeFromEmail}>`;

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) throw new Error("RESEND_API_KEY is not configured");

    // Personalize content; {{first_name}} falls back to "Friend".
    const results = await sendBulkEmails(
      resendApiKey,
      subscribers.map((subscriber) => ({
        from: fromAddress,
        to: subscriber.email,
        subject,
        html: safeHtmlContent.replace(
          /{{first_name}}/g,
          subscriber.first_name ? escapeHtml(subscriber.first_name) : "Friend",
        ),
      })),
    );

    console.log(`Newsletter send complete. Success: ${results.successful}, Failed: ${results.failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        total_subscribers: subscribers.length,
        successful: results.successful,
        failed: results.failed,
        errors: results.errors.length > 0 ? results.errors : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in send-newsletter function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
