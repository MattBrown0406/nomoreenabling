import { supabase } from "@/integrations/supabase/client";

export type FunnelEventName =
  | "assessment_started"
  | "assessment_completed"
  | "assessment_route_click"
  | "email_capture_attempt"
  | "email_capture_success"
  | "email_capture_failure"
  | "sticky_cta_click"
  | "article_intent_cta_click"
  | "topic_hub_cta_click"
  | "sponsor_impression"
  | "bridge_page_click"
  | "outbound_offer_click";

interface FunnelEventProperties {
  source?: string;
  articleSlug?: string;
  assessmentResult?: string;
  offerSlug?: string;
  targetHref?: string;
  metadata?: Record<string, unknown>;
}

export const trackFunnelEvent = async (eventName: FunnelEventName, properties: FunnelEventProperties = {}) => {
  if (typeof window === "undefined") return;

  try {
    await supabase.functions.invoke("track-funnel-event", {
      body: {
        event_name: eventName,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || null,
        source: properties.source,
        article_slug: properties.articleSlug,
        assessment_result: properties.assessmentResult,
        offer_slug: properties.offerSlug,
        target_href: properties.targetHref,
        metadata: properties.metadata ?? {},
      },
    });
  } catch {
    // Analytics should never interrupt a reader who is trying to get help.
  }
};
