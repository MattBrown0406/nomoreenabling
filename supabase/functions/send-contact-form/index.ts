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
    const safeMessage = message.trim().replace(/[<>]/g, "");
    const source = sanitizeText(payload.source, 120) || "contact-form";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

    if (supabase && source === "advertiser-inquiry") {
      const { error } = await supabase.from("advertiser_inquiries").insert({
        name: safeName,
        email: email.trim(),
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
      const { error } = await supabase.from("consultation_leads").insert({
        name: safeName,
        email: email.trim(),
        phone: sanitizeText(payload.phone, 80),
        relationship: sanitizeText(payload.relationship, 120),
        concern: sanitizeText(payload.concern, 240),
        treatment_history: sanitizeText(payload.treatment_history, 240),
        urgency: sanitizeText(payload.urgency, 240),
        message: safeMessage,
        source,
        lead_intent: sanitizeText(payload.lead_intent, 120),
        lead_score: sanitizeNumber(payload.lead_score) ?? 20,
        lead_tier: sanitizeText(payload.lead_tier, 40) || "nurture",
        lead_reasons: sanitizeJsonArray(payload.lead_reasons),
        page_path: sanitizeText(payload.page_path, 500),
        metadata: {
          source,
        },
      });

      if (error) {
        console.error("consultation_leads insert error:", error.message);
      }
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "No More Enabling <contact@nomoreenabling.com>",
        to: ["matt@nomoreenabling.com"],
        subject: source === "advertiser-inquiry" ? `Advertiser Inquiry: ${safeName}` : `Consultation Request: ${safeName}`,
        reply_to: email.trim(),
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${email.trim()}</p>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Resend API error:", res.status, errorData);
      throw new Error(`Email send failed [${res.status}]: ${errorData}`);
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
