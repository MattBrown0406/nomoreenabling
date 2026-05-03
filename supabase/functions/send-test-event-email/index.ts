import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-automation-secret, x-client-info, apikey, content-type",
};

const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdf6ee;font-family:Georgia,serif;color:#2b1d18;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6ee;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 24px rgba(110,30,20,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#7c1d12 0%,#a52a1a 100%);padding:36px 32px;text-align:center;">
            <h1 style="margin:0;font-size:30px;color:#fdf6ee;letter-spacing:0.5px;font-family:Georgia,serif;">No More Enabling</h1>
            <p style="margin:8px 0 0;color:#f7e3cf;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Family Addiction Guidance</p>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 36px 16px;">
            <p style="margin:0 0 8px;color:#a52a1a;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:bold;">Live Event Announcement</p>
            <h2 style="margin:0 0 16px;font-size:26px;color:#2b1d18;line-height:1.3;">Boundaries Without Guilt: A Free Family Workshop</h2>
            <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#3d2a23;">
              Join Matt Brown for a 90-minute live workshop designed for parents, partners, and siblings of someone struggling with addiction. We'll walk through the exact framework families use to set loving boundaries — without fear and without guilt.
            </p>
            <div style="background:#fdf6ee;border-left:4px solid #7c1d12;padding:18px 22px;margin:24px 0;border-radius:6px;">
              <p style="margin:0 0 6px;font-size:14px;color:#7c1d12;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">When</p>
              <p style="margin:0 0 14px;font-size:16px;color:#2b1d18;">Thursday, May 21, 2026 · 7:00 PM ET</p>
              <p style="margin:0 0 6px;font-size:14px;color:#7c1d12;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Where</p>
              <p style="margin:0;font-size:16px;color:#2b1d18;">Live on Zoom (replay available to registrants)</p>
            </div>
            <p style="margin:0 0 26px;font-size:16px;line-height:1.7;color:#3d2a23;">
              You'll leave with three boundary scripts you can use this week, a clear plan for what to do when they refuse treatment, and language to stop enabling without losing the relationship.
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 12px;">
              <tr><td style="background:#7c1d12;border-radius:8px;">
                <a href="https://nomoreenabling.com/family-addiction-consultation" style="display:inline-block;padding:14px 28px;color:#fdf6ee;text-decoration:none;font-weight:bold;font-size:16px;font-family:Georgia,serif;">Reserve My Free Seat</a>
              </td></tr>
            </table>
            <p style="margin:18px 0 0;font-size:13px;color:#7a6a62;font-style:italic;">Seats are limited to keep the Q&A meaningful.</p>
          </td>
        </tr>
        <tr>
          <td style="background:#2b1d18;padding:22px 32px;text-align:center;">
            <p style="margin:0;color:#f7e3cf;font-size:13px;line-height:1.6;">No More Enabling · Guidance for families of addicts<br>
              <a href="https://nomoreenabling.com" style="color:#f7e3cf;text-decoration:underline;">nomoreenabling.com</a>
            </p>
            <p style="margin:10px 0 0;color:#a08778;font-size:11px;">This is a test email sent from the No More Enabling admin dashboard.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const to = "Matt@freedominterventions.com";
    const result = await resend.emails.send({
      from: "No More Enabling <contact@nomoreenabling.com>",
      to: [to],
      subject: "You're invited: Boundaries Without Guilt — Free Family Workshop",
      html,
    });
    return new Response(JSON.stringify({ success: true, to, result }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
