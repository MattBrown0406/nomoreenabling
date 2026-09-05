import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { fetchAllRows } from "../_shared/paginate.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-report-secret",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const REVENUE_INTENT_KEYWORDS = [
  "consultation", "assessment", "advertiser", "sponsor",
  "sober", "soberhelpline", "family_bridge", "familybridge",
  "freedom", "party_wreckers", "partywreckers", "phone", "tel_",
  "outbound_offer", "bridge_page", "sticky_cta", "intent",
];

const READINESS_KEYWORDS = ["readiness", "intervention", "refuse_treatment", "what-to-do-when"];

const matchesAny = (haystack: string, needles: string[]) =>
  needles.some((n) => haystack.includes(n));

const extractDestination = (e: Record<string, unknown>): string | null => {
  const md = (e.metadata as Record<string, unknown> | null) ?? {};
  const candidates = [
    e.target_href, e.offer_slug,
    md.destination, md.cta, md.offer, md.recommended_offer,
    md.next_step, md.revenue_path, md.href,
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim().slice(0, 200);
  }
  return null;
};

const tally = (items: Array<string | null | undefined>) => {
  const map = new Map<string, number>();
  for (const x of items) {
    if (!x) continue;
    map.set(x, (map.get(x) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([name, count]) => ({ name, count }));
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const provided = req.headers.get("x-report-secret");
  const expected = Deno.env.get("NME_REPORT_SECRET");
  if (!expected || !provided || provided !== expected) {
    return json({ error: "Unauthorized" }, 401);
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const windowDays = 30;
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();

    // `.limit(10000)` is silently capped at PostgREST max-rows (1000), so
    // page through instead or every tally is wrong past 1000 events.
    const [events, consultRes, advRes] = await Promise.all([
      fetchAllRows<{
        event_name: string | null;
        page_path: string | null;
        target_href: string | null;
        offer_slug: string | null;
        metadata: Record<string, unknown> | null;
        created_at: string;
      }>(() =>
        supabase
          .from("funnel_events")
          .select("event_name, page_path, target_href, offer_slug, metadata, created_at")
          .gte("created_at", since)
          .order("created_at", { ascending: false })
      ),
      supabase
        .from("consultation_leads")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since),
      supabase
        .from("advertiser_inquiries")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since),
    ]);


    let pageViews = 0;
    let revenueIntent = 0;
    let readiness = 0;
    const eventNames: string[] = [];
    const pages: string[] = [];
    const dests: (string | null)[] = [];

    for (const e of events) {
      const name = (e.event_name ?? "").toLowerCase();
      eventNames.push(e.event_name ?? "unknown");
      pages.push(e.page_path ?? null);
      dests.push(extractDestination(e as Record<string, unknown>));

      const blob = `${name} ${(e.target_href ?? "")} ${(e.offer_slug ?? "")} ${JSON.stringify(e.metadata ?? {})}`.toLowerCase();
      if (name === "page_view") pageViews++;
      if (matchesAny(blob, REVENUE_INTENT_KEYWORDS)) revenueIntent++;
      if (matchesAny(blob, READINESS_KEYWORDS)) readiness++;
    }

    const latest = events.slice(0, 25).map((e) => ({
      event_name: e.event_name,
      page_path: e.page_path ?? null,
      destination: extractDestination(e as Record<string, unknown>),
      created_at: e.created_at,
    }));

    return json({
      window_days: windowDays,
      totals: {
        events: events.length,
        page_views: pageViews,
        revenue_intent_clicks: revenueIntent,
        consultation_requests: consultRes.count ?? 0,
        intervention_readiness_clicks: readiness,
        advertiser_inquiries: advRes.count ?? 0,
        registrations: 0,
      },
      by_event: tally(eventNames),
      top_pages: tally(pages),
      top_destinations: tally(dests),
      latest_events: latest,
    });
  } catch (err) {
    console.error("nme-revenue-report error:", err);
    return json({ error: "Internal error" }, 500);
  }
});
