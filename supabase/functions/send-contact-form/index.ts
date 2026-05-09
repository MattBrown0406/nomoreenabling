import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const sanitizeText = (value: unknown, maxLength = 255): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().replace(/[<>]/g, "");
  return trimmed ? trimmed.slice(0, maxLength) : null;
};

const sanitizeNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.min(100, Math.round(value)));
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(0, Math.min(100, Math.round(parsed)));
  }
  return null;
};

const sanitizeJsonArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().slice(0, 180))
    .filter(Boolean)
    .slice(0, 6);
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const sendEmail = async ({
  apiKey,
  to,
  subject,
  html,
  replyTo,
}: {
  apiKey: string;
  to: string[];
  subject: string;
  html: string;
  replyTo?: string;
}) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "No More Enabling <contact@nomoreenabling.com>",
      to,
      subject,
      reply_to: replyTo,
      html,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("Resend API error:", response.status, errorData);
    throw new Error(`Email send failed [${response.status}]: ${errorData}`);
  }
};

const buildConsultationFollowups = ({
  leadId,
  email,
  name,
  leadTier,
  leadIntent,
}: {
  leadId: string;
  email: string;
  name: string;
  leadTier: string;
  leadIntent: string | null;
}) => {
  const firstName = name.split(/\s+/)[0] || null;
  const dayOne = new Date();
  dayOne.setDate(dayOne.getDate() + 1);
  const dayThree = new Date();
  dayThree.setDate(dayThree.getDate() + 3);

  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  const urgencyLine = leadTier === "priority"
    ? "Because your request sounded time-sensitive, I do not want this to get buried behind another crisis."
    : "I do not want this to get lost while your family is still trying to sort out the next right step.";

  return [
    {
      consultation_lead_id: leadId,
      email,
      name,
      lead_tier: leadTier,
      lead_intent: leadIntent,
      sequence_step: 1,
      subject: "A steadier next step for your family",
      preview_text: "A short follow-up after your No More Enabling request.",
      body_markdown: `${greeting}\n\nThank you for reaching out through No More Enabling. ${urgencyLine}\n\nIf you have not already heard back, the most useful next reply is simple: what changed most recently, what your family has already tried, and what decision feels hardest right now.\n\nYou do not have to explain the whole history perfectly. Start with the part that feels most urgent or most stuck.`,
      primary_cta_label: "Review the family assessment",
      primary_cta_href: "https://nomoreenabling.com/family-situation-assessment",
      scheduled_for: dayOne.toISOString(),
      metadata: { source: "consultation_automation" },
    },
    {
      consultation_lead_id: leadId,
      email,
      name,
      lead_tier: leadTier,
      lead_intent: leadIntent,
      sequence_step: 2,
      subject: "If the same conversation keeps failing",
      preview_text: "Use this if your family is still circling treatment, boundaries, or next steps.",
      body_markdown: `${greeting}\n\nIf the situation is still circling the same conversation, try not to make one more emotional talk the whole plan.\n\nFamilies usually need to sort three things before the next confrontation: what the actual risk is, what support will stop, and what level of outside help fits.\n\nIf treatment is being refused or consequences are escalating, the intervention help page is the better next read. If the issue is boundaries that keep collapsing, family coaching may fit better.`,
      primary_cta_label: leadIntent?.includes("intervention") ? "Open intervention help" : "Open family coaching",
      primary_cta_href: leadIntent?.includes("intervention")
        ? "https://nomoreenabling.com/intervention-help"
        : "https://nomoreenabling.com/family-addiction-coaching",
      scheduled_for: dayThree.toISOString(),
      metadata: { source: "consultation_automation" },
    },
  ];
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const payload = await req.json();
    const { name, email, message } = payload;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
      return new Response(JSON.stringify({ error: "Invalid name" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!message || typeof message !== "string" || message.trim().length === 0 || message.length > 4000) {
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize
    const safeName = name.trim().replace(/[<>]/g, "");
    const safeEmail = email.trim().toLowerCase();
    const safeMessage = message.trim().replace(/[<>]/g, "");
    const source = sanitizeText(payload.source, 120) || "contact-form";
    const leadScore = sanitizeNumber(payload.lead_score) ?? 20;
    const leadTier = sanitizeText(payload.lead_tier, 40) || "nurture";
    const leadReasons = sanitizeJsonArray(payload.lead_reasons);
    const leadIntent = sanitizeText(payload.lead_intent, 120);
    const phone = sanitizeText(payload.phone, 80);
    const relationship = sanitizeText(payload.relationship, 120);
    const concern = sanitizeText(payload.concern, 240);
    const treatmentHistory = sanitizeText(payload.treatment_history, 240);
    const urgency = sanitizeText(payload.urgency, 240);
    const pagePath = sanitizeText(payload.page_path, 500);
    const isQuestionIntake = source.includes("question-intake");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

    if (supabase && source === "advertiser-inquiry") {
      const { error } = await supabase.from("advertiser_inquiries").insert({
        name: safeName,
        email: safeEmail,
        company: sanitizeText(payload.company, 180),
        website: sanitizeText(payload.website, 255),
        sponsor_type: sanitizeText(payload.sponsor_type, 180),
        monthly_budget: sanitizeText(payload.monthly_budget, 80),
        message: safeMessage,
        page_path: sanitizeText(payload.page_path, 500),
        metadata: {
          source,
        },
      });

      if (error) {
        console.error("advertiser_inquiries insert error:", error.message);
      }
    } else if (supabase) {
      const firstName = safeName.split(/\s+/)[0] || null;
      const followups = isQuestionIntake
        ? []
        : buildConsultationFollowups({
            leadId: "pending",
            email: safeEmail,
            name: safeName,
            leadTier,
            leadIntent,
          });
      const { data: insertedLead, error } = await supabase
        .from("consultation_leads")
        .insert({
          name: safeName,
          first_name: firstName,
          email: safeEmail,
          phone,
          relationship,
          concern,
          treatment_history: treatmentHistory,
          urgency,
          message: safeMessage,
          source,
          lead_intent: leadIntent,
          lead_score: leadScore,
          lead_tier: leadTier,
          lead_reasons: leadReasons,
          page_path: pagePath,
          next_followup_at: followups[0]?.scheduled_for ?? null,
          metadata: {
            source,
          },
        })
        .select("id")
        .single();

      if (error) {
        console.error("consultation_leads insert error:", error.message);
      } else if (insertedLead?.id && !isQuestionIntake) {
        const queuedFollowups = buildConsultationFollowups({
          leadId: insertedLead.id,
          email: safeEmail,
          name: safeName,
          leadTier,
          leadIntent,
        });

        const { error: queueError } = await supabase
          .from("consultation_followup_queue")
          .upsert(queuedFollowups, { onConflict: "consultation_lead_id,sequence_step" });

        if (queueError) {
          console.error("consultation_followup_queue insert error:", queueError.message);
        }
      }
    }

    await sendEmail({
      apiKey: RESEND_API_KEY,
      to: ["matt@nomoreenabling.com"],
      subject: source === "advertiser-inquiry"
        ? `Advertiser Inquiry: ${safeName}`
        : isQuestionIntake
          ? `Family Question: ${safeName}`
        : `${leadTier === "priority" ? "Priority " : ""}Consultation Request: ${safeName}`,
      replyTo: safeEmail,
      html: `
        <h2>${source === "advertiser-inquiry" ? "New Advertiser Inquiry" : isQuestionIntake ? "New Family Recovery Question" : "New Consultation Request"}</h2>
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Source:</strong> ${escapeHtml(source)}</p>
        ${source !== "advertiser-inquiry" ? `
          <p><strong>Lead score:</strong> ${leadScore} (${escapeHtml(leadTier)})</p>
          ${leadIntent ? `<p><strong>Intent:</strong> ${escapeHtml(leadIntent)}</p>` : ""}
          ${relationship ? `<p><strong>Relationship:</strong> ${escapeHtml(relationship)}</p>` : ""}
          ${concern ? `<p><strong>Concern:</strong> ${escapeHtml(concern)}</p>` : ""}
          ${urgency ? `<p><strong>Urgency:</strong> ${escapeHtml(urgency)}</p>` : ""}
          ${leadReasons.length ? `<p><strong>Why this was scored:</strong> ${leadReasons.map(escapeHtml).join(", ")}</p>` : ""}
          ${pagePath ? `<p><strong>Page:</strong> ${escapeHtml(pagePath)}</p>` : ""}
        ` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(safeMessage).replace(/\n/g, "<br>")}</p>
      `,
    });

    try {
      if (source === "advertiser-inquiry") {
        await sendEmail({
          apiKey: RESEND_API_KEY,
          to: [safeEmail],
          subject: "We received your No More Enabling sponsor inquiry",
          html: `
            <p>Hi ${escapeHtml(safeName.split(/\s+/)[0] || safeName)},</p>
            <p>Thank you for reaching out about advertising on No More Enabling. Matt will review the fit and follow up if the sponsor category aligns with the family-support mission of the site.</p>
            <p>In the meantime, you can review the public media kit here: <a href="https://nomoreenabling.com/advertise/media-kit">https://nomoreenabling.com/advertise/media-kit</a></p>
          `,
        });
      } else if (isQuestionIntake) {
        await sendEmail({
          apiKey: RESEND_API_KEY,
          to: [safeEmail],
          subject: "We received your No More Enabling question",
          html: `
            <p>Hi ${escapeHtml(safeName.split(/\s+/)[0] || safeName)},</p>
            <p>Thank you for sending a family recovery question through No More Enabling. Your question was received and may help shape a future answer or guide.</p>
            <p>If your family needs direct help now, use the family situation assessment here: <a href="https://nomoreenabling.com/family-situation-assessment">https://nomoreenabling.com/family-situation-assessment</a></p>
          `,
        });
      } else {
        await sendEmail({
          apiKey: RESEND_API_KEY,
          to: [safeEmail],
          subject: "We received your request for family guidance",
          html: `
            <p>Hi ${escapeHtml(safeName.split(/\s+/)[0] || safeName)},</p>
            <p>Thank you for reaching out through No More Enabling. Your note was received and will be reviewed.</p>
            <p>If the situation changes or becomes immediately unsafe, use emergency or crisis support first. If this is not an emergency, the family situation assessment can help organize the next step while you wait:</p>
            <p><a href="https://nomoreenabling.com/family-situation-assessment">https://nomoreenabling.com/family-situation-assessment</a></p>
          `,
        });
      }
    } catch (confirmationError) {
      console.error("Confirmation email failed:", confirmationError);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("send-contact-form error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
