import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const markdownToHtml = (markdown: string) =>
  markdown
    .split("\n\n")
    .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
    .join("");

const renderEmail = (followup: {
  body_markdown: string;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
}) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Georgia, serif; max-width: 640px; margin: 0 auto; padding: 24px; color: #1f2933; line-height: 1.7;">
      <div style="margin-bottom: 28px; border-bottom: 1px solid #e5e7eb; padding-bottom: 18px;">
        <h1 style="font-size: 24px; margin: 0; color: #7c2d12;">No More Enabling</h1>
        <p style="font-size: 14px; color: #6b7280; margin: 4px 0 0;">Family addiction guidance</p>
      </div>

      ${markdownToHtml(followup.body_markdown)}

      ${followup.primary_cta_label && followup.primary_cta_href ? `
        <p style="margin-top: 28px;">
          <a href="${escapeHtml(followup.primary_cta_href)}" style="display: inline-block; background: #7c2d12; color: #ffffff; padding: 12px 18px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            ${escapeHtml(followup.primary_cta_label)}
          </a>
        </p>
      ` : ""}

      <hr style="margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;">
      <p style="font-size: 12px; color: #6b7280;">
        You are receiving this because you requested family guidance from No More Enabling.
        If this is no longer useful, reply to this email and let us know.
      </p>
    </body>
  </html>
`;

const verifyAdmin = async (req: Request, supabase: ReturnType<typeof createClient>) => {
  const authHeader = req.headers.get("Authorization");
  const automationSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
  const requestedSecret = req.headers.get("x-automation-secret");

  if (automationSecret && requestedSecret === automationSecret) return true;
  if (!authHeader) return false;

  const token = authHeader.replace("Bearer ", "");
  const { data: userData, error: userError } = await supabase.auth.getUser(token);

  if (userError || !userData.user) return false;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .single();

  return Boolean(roleData);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const isAuthorized = await verifyAdmin(req, supabase);
    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const now = new Date().toISOString();
    const { data: followups, error: fetchError } = await supabase
      .from("consultation_followup_queue")
      .select("id, consultation_lead_id, email, name, subject, preview_text, body_markdown, primary_cta_label, primary_cta_href, sequence_step")
      .is("sent_at", null)
      .is("skipped_at", null)
      .lte("scheduled_for", now)
      .order("scheduled_for", { ascending: true })
      .limit(25);

    if (fetchError) throw fetchError;

    let sent = 0;
    let errors = 0;

    for (const followup of followups || []) {
      try {
        await resend.emails.send({
          from: "No More Enabling <contact@nomoreenabling.com>",
          to: [followup.email],
          subject: followup.subject,
          html: renderEmail(followup),
        });

        await supabase
          .from("consultation_followup_queue")
          .update({ sent_at: now, error_message: null })
          .eq("id", followup.id);

        if (followup.consultation_lead_id) {
          const { data: nextFollowup } = await supabase
            .from("consultation_followup_queue")
            .select("scheduled_for")
            .eq("consultation_lead_id", followup.consultation_lead_id)
            .is("sent_at", null)
            .is("skipped_at", null)
            .order("scheduled_for", { ascending: true })
            .limit(1)
            .maybeSingle();

          await supabase
            .from("consultation_leads")
            .update({
              followup_status: nextFollowup?.scheduled_for ? "active" : "complete",
              last_followup_at: now,
              next_followup_at: nextFollowup?.scheduled_for ?? null,
            })
            .eq("id", followup.consultation_lead_id);
        }

        sent++;
      } catch (error) {
        errors++;
        const message = error instanceof Error ? error.message : "Unknown email error";
        await supabase
          .from("consultation_followup_queue")
          .update({ error_message: message })
          .eq("id", followup.id);
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, errors, total: followups?.length || 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("process-consultation-followups error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
