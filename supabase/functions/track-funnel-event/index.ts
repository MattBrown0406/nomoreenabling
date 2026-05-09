import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const allowedEvents = new Set([
  "answer_page_view",
  "answer_page_click",
  "official_resource_click",
  "assessment_started",
  "assessment_completed",
  "assessment_route_click",
  "email_capture_attempt",
  "email_capture_success",
  "email_capture_failure",
  "sticky_cta_click",
  "article_intent_cta_click",
  "topic_hub_cta_click",
  "lead_magnet_signup",
  "consultation_request",
  "advertiser_inquiry",
  "sponsor_impression",
  "bridge_page_click",
  "outbound_offer_click",
]);

const sanitizeText = (value: unknown, maxLength = 255): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  try {
    const payload = await req.json();
    const eventName = sanitizeText(payload.event_name, 80);

    if (!eventName || !allowedEvents.has(eventName)) {
      return new Response(
        JSON.stringify({ error: "Invalid event name" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const metadata = typeof payload.metadata === "object" && payload.metadata !== null
      ? payload.metadata
      : {};

    const { error } = await supabase.from("funnel_events").insert({
      event_name: eventName,
      page_path: sanitizeText(payload.page_path, 500),
      page_title: sanitizeText(payload.page_title, 500),
      referrer: sanitizeText(payload.referrer, 500),
      source: sanitizeText(payload.source, 120),
      article_slug: sanitizeText(payload.article_slug, 180),
      assessment_result: sanitizeText(payload.assessment_result, 80),
      offer_slug: sanitizeText(payload.offer_slug, 120),
      target_href: sanitizeText(payload.target_href, 500),
      metadata,
    });

    if (error) {
      console.error("Funnel event insert error:", error.message);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in track-funnel-event function:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
