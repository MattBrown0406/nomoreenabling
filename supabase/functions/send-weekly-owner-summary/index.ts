import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-automation-secret, x-client-info, apikey, content-type",
};

const escapeHtml = (value: string | number | null | undefined) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

const countRows = async (
  supabase: ReturnType<typeof createClient>,
  table: string,
  dateColumn: string,
  periodStart: string,
  periodEnd: string,
) => {
  const { count, error } = await supabase
    .from(table)
    .select("id", { count: "exact", head: true })
    .gte(dateColumn, periodStart)
    .lt(dateColumn, periodEnd);

  if (error) throw error;
  return count ?? 0;
};

const countEvents = async (
  supabase: ReturnType<typeof createClient>,
  eventName: string,
  periodStart: string,
  periodEnd: string,
) => {
  const { count, error } = await supabase
    .from("funnel_events")
    .select("id", { count: "exact", head: true })
    .eq("event_name", eventName)
    .gte("created_at", periodStart)
    .lt("created_at", periodEnd);

  if (error) throw error;
  return count ?? 0;
};

const buildList = (items: string[]) =>
  items.length > 0
    ? `<ul style="margin: 10px 0 0; padding-left: 20px;">${items.map((item) => `<li>${item}</li>`).join("")}</ul>`
    : `<p style="margin: 10px 0 0; color: #64748b;">No items this week.</p>`;

const renderEmail = (summary: {
  periodLabel: string;
  consultationLeadCount: number;
  hotLeadCount: number;
  bookedLeadCount: number;
  closedLeadCount: number;
  advertiserInquiryCount: number;
  sponsorImpressions: number;
  sponsorClicks: number;
  answerPageViews: number;
  answerPageClicks: number;
  officialResourceClicks: number;
  dueFollowupCount: number;
  topLeadSources: Array<{ label: string; count: number }>;
  topAnswerPages: Array<{ label: string; views: number; clicks: number; leads: number }>;
  answerRevenuePathClicks: Array<{ label: string; count: number }>;
  hotLeads: Array<Record<string, string | number | null>>;
  advertiserInquiries: Array<Record<string, string | number | null>>;
}) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Georgia, serif; max-width: 720px; margin: 0 auto; padding: 24px; color: #1f2933; line-height: 1.6;">
      <h1 style="font-size: 28px; margin-bottom: 4px; color: #7c2d12;">No More Enabling Weekly Owner Summary</h1>
      <p style="margin-top: 0; color: #64748b;">${escapeHtml(summary.periodLabel)}</p>

      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin: 24px 0;">
        ${[
          ["Consultation leads", summary.consultationLeadCount],
          ["Hot leads", summary.hotLeadCount],
          ["Booked leads", summary.bookedLeadCount],
          ["Closed leads", summary.closedLeadCount],
          ["Advertiser inquiries", summary.advertiserInquiryCount],
          ["Due follow-ups", summary.dueFollowupCount],
          ["Answer page views", summary.answerPageViews],
          ["Answer page clicks", summary.answerPageClicks],
          ["Sponsor impressions", summary.sponsorImpressions],
          ["Sponsor clicks", summary.sponsorClicks],
        ].map(([label, value]) => `
          <div style="border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px;">
            <p style="margin: 0; color: #64748b; font-size: 13px;">${escapeHtml(label)}</p>
            <p style="margin: 4px 0 0; font-size: 26px; font-weight: bold;">${escapeHtml(value)}</p>
          </div>
        `).join("")}
      </div>

      <h2 style="font-size: 20px; color: #111827;">Start here Monday</h2>
      ${buildList(summary.hotLeads.map((lead) =>
        `<strong>${escapeHtml(lead.name)}</strong> (${escapeHtml(lead.lead_score)}): ${escapeHtml(lead.next_action)} · ${escapeHtml(lead.page_path || lead.source)} · ${escapeHtml(lead.email)}`
      ))}

      <h2 style="font-size: 20px; color: #111827; margin-top: 26px;">Top lead source pages</h2>
      ${buildList(summary.topLeadSources.map((source) => `${escapeHtml(source.label)}: <strong>${escapeHtml(source.count)}</strong>`))}

      <h2 style="font-size: 20px; color: #111827; margin-top: 26px;">Top NME answer pages</h2>
      ${buildList(summary.topAnswerPages.map((page) =>
        `${escapeHtml(page.label)}: <strong>${escapeHtml(page.views)}</strong> views · <strong>${escapeHtml(page.clicks)}</strong> clicks · <strong>${escapeHtml(page.leads)}</strong> leads`
      ))}

      <h2 style="font-size: 20px; color: #111827; margin-top: 26px;">Answer page revenue path clicks</h2>
      ${buildList(summary.answerRevenuePathClicks.map((path) =>
        `${escapeHtml(path.label)}: <strong>${escapeHtml(path.count)}</strong>`
      ))}

      <p style="margin-top: 10px; color: #64748b; font-size: 13px;">
        Official source clicks this week: <strong>${escapeHtml(summary.officialResourceClicks)}</strong>
      </p>

      <h2 style="font-size: 20px; color: #111827; margin-top: 26px;">Advertiser pipeline</h2>
      ${buildList(summary.advertiserInquiries.map((inquiry) =>
        `<strong>${escapeHtml(inquiry.company || inquiry.name)}</strong>: ${escapeHtml(inquiry.pipeline_status)} · ${escapeHtml(inquiry.next_action)} · ${escapeHtml(inquiry.email)}`
      ))}

      <p style="margin-top: 30px; color: #64748b; font-size: 13px;">
        Open the admin dashboard to update statuses, notes, next actions, and exports.
      </p>
    </body>
  </html>
`;

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

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const periodEndDate = body.periodEnd ? new Date(body.periodEnd) : new Date();
    const periodStartDate = body.periodStart ? new Date(body.periodStart) : new Date(periodEndDate);
    if (!body.periodStart) periodStartDate.setDate(periodStartDate.getDate() - 7);

    const periodStart = periodStartDate.toISOString();
    const periodEnd = periodEndDate.toISOString();
    const periodLabel = `${periodStartDate.toLocaleDateString("en-US")} to ${periodEndDate.toLocaleDateString("en-US")}`;
    const sentTo = Deno.env.get("OWNER_SUMMARY_EMAIL") || "matt@nomoreenabling.com";
    const subject = `No More Enabling weekly summary: ${periodLabel}`;
    const now = new Date().toISOString();

    const [
      consultationLeadCount,
      advertiserInquiryCount,
      sponsorImpressions,
      sponsorClicks,
      dueFollowupsResult,
      hotLeadsResult,
      bookedResult,
      closedResult,
      leadSourceResult,
      funnelEventsResult,
      advertiserResult,
    ] = await Promise.all([
      countRows(supabase, "consultation_leads", "created_at", periodStart, periodEnd),
      countRows(supabase, "advertiser_inquiries", "created_at", periodStart, periodEnd),
      countEvents(supabase, "sponsor_impression", periodStart, periodEnd),
      countRows(supabase, "ad_clicks", "clicked_at", periodStart, periodEnd),
      supabase
        .from("consultation_followup_queue")
        .select("id", { count: "exact", head: true })
        .is("sent_at", null)
        .is("skipped_at", null)
        .lte("scheduled_for", now),
      supabase
        .from("consultation_leads")
        .select("name, email, phone, page_path, source, lead_score, lead_tier, pipeline_status, next_action, created_at")
        .in("pipeline_status", ["new", "contacted", "active"])
        .order("lead_score", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(8),
      supabase
        .from("consultation_leads")
        .select("id", { count: "exact", head: true })
        .eq("pipeline_status", "booked")
        .gte("booked_at", periodStart)
        .lt("booked_at", periodEnd),
      supabase
        .from("consultation_leads")
        .select("id", { count: "exact", head: true })
        .eq("pipeline_status", "closed")
        .gte("closed_at", periodStart)
        .lt("closed_at", periodEnd),
      supabase
        .from("consultation_leads")
        .select("page_path, source")
        .gte("created_at", periodStart)
        .lt("created_at", periodEnd),
      supabase
        .from("funnel_events")
        .select("event_name, page_path, metadata")
        .gte("created_at", periodStart)
        .lt("created_at", periodEnd)
        .in("event_name", ["answer_page_view", "answer_page_click", "official_resource_click"]),
      supabase
        .from("advertiser_inquiries")
        .select("name, email, company, sponsor_type, monthly_budget, pipeline_status, next_action, created_at")
        .in("pipeline_status", ["new", "contacted", "proposal_sent", "negotiating"])
        .order("created_at", { ascending: false })
        .limit(8),
    ]);

    if (dueFollowupsResult.error) throw dueFollowupsResult.error;
    if (hotLeadsResult.error) throw hotLeadsResult.error;
    if (bookedResult.error) throw bookedResult.error;
    if (closedResult.error) throw closedResult.error;
    if (leadSourceResult.error) throw leadSourceResult.error;
    if (funnelEventsResult.error) throw funnelEventsResult.error;
    if (advertiserResult.error) throw advertiserResult.error;

    const sourceCounts = (leadSourceResult.data || []).reduce<Record<string, number>>((acc, lead) => {
      const key = lead.page_path || lead.source || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const answerLeadCounts = (leadSourceResult.data || []).reduce<Record<string, number>>((acc, lead) => {
      const key = lead.page_path || "";
      if (key.startsWith("/answers/")) acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const answerPageCounts = (funnelEventsResult.data || []).reduce<Record<string, { views: number; clicks: number }>>((acc, event) => {
      const key = event.page_path || "unknown";
      if (!key.startsWith("/answers/")) return acc;

      if (!acc[key]) acc[key] = { views: 0, clicks: 0 };
      if (event.event_name === "answer_page_view") acc[key].views += 1;
      if (event.event_name === "answer_page_click") acc[key].clicks += 1;
      return acc;
    }, {});

    const answerRevenuePathCounts = (funnelEventsResult.data || []).reduce<Record<string, number>>((acc, event) => {
      if (event.event_name !== "answer_page_click") return acc;
      const metadata = event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
        ? event.metadata as Record<string, unknown>
        : {};
      if (metadata.click_type !== "primary_revenue_path") return acc;
      const key = typeof metadata.revenue_path === "string" ? metadata.revenue_path : "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const answerPageViews = (funnelEventsResult.data || []).filter((event) => event.event_name === "answer_page_view").length;
    const answerPageClicks = (funnelEventsResult.data || []).filter((event) => event.event_name === "answer_page_click").length;
    const officialResourceClicks = (funnelEventsResult.data || []).filter((event) => event.event_name === "official_resource_click").length;

    const summary = {
      periodStart,
      periodEnd,
      periodLabel,
      consultationLeadCount,
      hotLeadCount: hotLeadsResult.data?.length || 0,
      bookedLeadCount: bookedResult.count ?? 0,
      closedLeadCount: closedResult.count ?? 0,
      advertiserInquiryCount,
      sponsorImpressions,
      sponsorClicks,
      answerPageViews,
      answerPageClicks,
      officialResourceClicks,
      dueFollowupCount: dueFollowupsResult.count ?? 0,
      topLeadSources: Object.entries(sourceCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 6),
      topAnswerPages: Object.entries(answerPageCounts)
        .map(([label, counts]) => ({
          label,
          views: counts.views,
          clicks: counts.clicks,
          leads: answerLeadCounts[label] || 0,
        }))
        .sort((a, b) => b.leads - a.leads || b.clicks - a.clicks || b.views - a.views)
        .slice(0, 6),
      answerRevenuePathClicks: Object.entries(answerRevenuePathCounts)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count),
      hotLeads: hotLeadsResult.data || [],
      advertiserInquiries: advertiserResult.data || [],
    };

    const { error: sendError } = await resend.emails.send({
      from: "No More Enabling <contact@nomoreenabling.com>",
      to: [sentTo],
      subject,
      html: renderEmail(summary),
    });

    const { error: logError } = await supabase.from("weekly_owner_summaries").insert({
      period_start: periodStart,
      period_end: periodEnd,
      sent_to: sentTo,
      subject,
      summary,
      sent_at: sendError ? null : now,
      error_message: sendError ? sendError.message : null,
    });

    if (logError) console.error("weekly_owner_summaries insert error:", logError);
    if (sendError) throw sendError;

    return new Response(
      JSON.stringify({ success: true, sentTo, summary }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("send-weekly-owner-summary error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unexpected error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
