import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpDown,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  Download,
  DollarSign,
  Eye,
  FileText,
  LogOut,
  Mail,
  MousePointerClick,
  PhoneCall,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Route,
  Send,
  Share2,
  ShieldCheck,
  Target,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { topicHubs } from "@/data/topicHubs";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { AdminCrmPanel } from "@/components/admin/AdminCrmPanel";
import { getSupportOffer } from "@/data/supportOffers";
import { commercialIntentPages } from "@/data/commercialIntentPages";
import {
  aeoAnswers,
  answerDetailPath,
  type AeoAnswer,
} from "@/data/aeoAnswers";
import {
  formatSponsorRate,
  sponsorPlacements,
  sponsorshipPackages,
  sponsorStandards,
} from "@/data/sponsorInventory";

interface ArticleStat {
  slug: string;
  title: string;
  views: number;
  category: string;
  date: string;
}

interface AdClickStat {
  ad_name: string;
  clicks: number;
}

interface FunnelEventRow {
  event_name: string;
  created_at: string;
  page_path: string | null;
  source: string | null;
  article_slug: string | null;
  assessment_result: string | null;
  offer_slug: string | null;
  target_href: string | null;
  metadata: Record<string, unknown> | null;
}

interface AssessmentLeadRow {
  id: string;
  email: string;
  first_name: string | null;
  source: string;
  assessment_result: string;
  recommended_offer: string | null;
  last_result_at: string;
}

interface ConsultationLeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  relationship: string | null;
  concern: string | null;
  treatment_history: string | null;
  urgency: string | null;
  message: string;
  source: string;
  page_path: string | null;
  lead_intent: string | null;
  lead_score: number;
  lead_tier: string;
  lead_reasons: string[];
  pipeline_status: string;
  followup_status: string;
  followups_paused_at: string | null;
  next_followup_at: string | null;
  last_followup_at: string | null;
  contacted_at: string | null;
  booked_at: string | null;
  closed_at: string | null;
  lost_at: string | null;
  last_admin_action_at: string | null;
  admin_notes: string | null;
  next_action: string;
  next_action_due_at: string | null;
  created_at: string;
}

interface ConsultationFollowupRow {
  id: string;
  consultation_lead_id: string | null;
  email: string;
  name: string | null;
  subject: string;
  sequence_step: number;
  scheduled_for: string;
  sent_at: string | null;
  skipped_at: string | null;
  error_message: string | null;
}

interface AdvertiserInquiryRow {
  id: string;
  name: string;
  email: string;
  company: string | null;
  sponsor_type: string | null;
  monthly_budget: string | null;
  pipeline_status: string;
  next_action: string;
  proposal_sent_at: string | null;
  sold_at: string | null;
  lost_at: string | null;
  last_admin_action_at: string | null;
  admin_notes: string | null;
  created_at: string;
}

interface FunnelBreakdownStat {
  key: string;
  label: string;
  count: number;
}

interface ClusterFunnelStat {
  key: string;
  label: string;
  articleCount: number;
  events: number;
  ctaClicks: number;
  hubClicks: number;
  offerClicks: number;
}

interface AnswerMoneyStat {
  answer: AeoAnswer;
  path: string;
  views: number;
  clicks: number;
  revenueClicks: number;
  familySquaresClicks: number;
  consultationClicks: number;
  interventionClicks: number;
  assessmentClicks: number;
  officialResourceClicks: number;
  consultationLeads: number;
}

type SortField = "views" | "title" | "date";
type SortDir = "asc" | "desc";
type TimeRange = "7d" | "30d" | "90d" | "all";
type LeadPipelineStatus = "new" | "contacted" | "booked" | "active" | "closed" | "lost";
type AdvertiserPipelineStatus = "new" | "contacted" | "proposal_sent" | "negotiating" | "sold" | "lost";

const resultLabels: Record<string, string> = {
  safety: "Safety",
  intervention: "Intervention",
  boundaries: "Boundaries",
  "after-treatment": "After Treatment",
  support: "Support",
};

const pipelineLabels: Record<LeadPipelineStatus, string> = {
  new: "New",
  contacted: "Contacted",
  booked: "Booked",
  active: "Active",
  closed: "Closed",
  lost: "Lost",
};

const nextActionLabels: Record<string, string> = {
  call: "Call",
  email: "Email",
  book_consultation: "Book consultation",
  send_resources: "Send resources",
  wait: "Wait",
  close: "Close",
  send_media_kit: "Send media kit",
  send_proposal: "Send proposal",
  follow_up: "Follow up",
};

const advertiserPipelineLabels: Record<AdvertiserPipelineStatus, string> = {
  new: "New",
  contacted: "Contacted",
  proposal_sent: "Proposal sent",
  negotiating: "Negotiating",
  sold: "Sold",
  lost: "Lost",
};

const pipelineBadgeClass: Record<LeadPipelineStatus, string> = {
  new: "bg-secondary text-muted-foreground",
  contacted: "bg-primary/10 text-primary",
  booked: "bg-emerald-100 text-emerald-800",
  active: "bg-blue-100 text-blue-800",
  closed: "bg-slate-900 text-white",
  lost: "bg-destructive/10 text-destructive",
};

const advertiserPipelineBadgeClass: Record<AdvertiserPipelineStatus, string> = {
  new: "bg-secondary text-muted-foreground",
  contacted: "bg-primary/10 text-primary",
  proposal_sent: "bg-blue-100 text-blue-800",
  negotiating: "bg-amber-100 text-amber-800",
  sold: "bg-emerald-100 text-emerald-800",
  lost: "bg-destructive/10 text-destructive",
};

const leadPipelineStatuses: LeadPipelineStatus[] = ["new", "contacted", "booked", "active", "closed", "lost"];
const advertiserPipelineStatuses: AdvertiserPipelineStatus[] = ["new", "contacted", "proposal_sent", "negotiating", "sold", "lost"];
const consultationNextActions = ["call", "email", "book_consultation", "send_resources", "wait", "close"];
const advertiserNextActions = ["email", "send_media_kit", "send_proposal", "follow_up", "wait", "close"];

const getPipelineStatus = (status: string | null | undefined): LeadPipelineStatus =>
  leadPipelineStatuses.includes(status as LeadPipelineStatus) ? (status as LeadPipelineStatus) : "new";

const getAdvertiserPipelineStatus = (status: string | null | undefined): AdvertiserPipelineStatus =>
  advertiserPipelineStatuses.includes(status as AdvertiserPipelineStatus) ? (status as AdvertiserPipelineStatus) : "new";

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const formatPercent = (numerator: number, denominator: number) =>
  denominator > 0 ? `${((numerator / denominator) * 100).toFixed(1)}%` : "0.0%";

const getEventMetadata = (event: FunnelEventRow): Record<string, unknown> =>
  event.metadata && typeof event.metadata === "object" && !Array.isArray(event.metadata)
    ? event.metadata
    : {};

const getMetadataString = (event: FunnelEventRow, key: string) => {
  const value = getEventMetadata(event)[key];
  return typeof value === "string" ? value : "";
};

const csvEscape = (value: string | number | null | undefined) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

const downloadCsv = (filename: string, rows: Array<Record<string, string | number | null | undefined>>) => {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(csvEscape).join(","),
    ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const AdminAnalytics = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "crm">("analytics");
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [stats, setStats] = useState<ArticleStat[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [sortField, setSortField] = useState<SortField>("views");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [enrollmentCount, setEnrollmentCount] = useState<number | null>(null);
  const [adClicks, setAdClicks] = useState<AdClickStat[]>([]);
  const [totalAdClicks, setTotalAdClicks] = useState(0);
  const [funnelEvents, setFunnelEvents] = useState<FunnelEventRow[]>([]);
  const [assessmentLeads, setAssessmentLeads] = useState<AssessmentLeadRow[]>([]);
  const [consultationLeads, setConsultationLeads] = useState<ConsultationLeadRow[]>([]);
  const [consultationFollowups, setConsultationFollowups] = useState<ConsultationFollowupRow[]>([]);
  const [advertiserInquiries, setAdvertiserInquiries] = useState<AdvertiserInquiryRow[]>([]);
  const [assessmentLeadCount, setAssessmentLeadCount] = useState<number | null>(null);
  const [consultationLeadCount, setConsultationLeadCount] = useState<number | null>(null);
  const [advertiserInquiryCount, setAdvertiserInquiryCount] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [processingFollowups, setProcessingFollowups] = useState(false);
  const [sendingWeeklySummary, setSendingWeeklySummary] = useState(false);
  const [lastSyncCount, setLastSyncCount] = useState<number | null>(null);
  const [lastFollowupRun, setLastFollowupRun] = useState<{ sent: number; errors: number } | null>(null);
  const [lastWeeklySummarySentTo, setLastWeeklySummarySentTo] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [leadActionLoading, setLeadActionLoading] = useState<string | null>(null);
  const [leadNoteDraft, setLeadNoteDraft] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data, error } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    });
    
    if (data === true) {
      setIsAdmin(true);
      fetchAnalytics();
      fetchCounts();
      fetchAdClicks();
      fetchFunnelAnalytics();
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    const [subResult, enrollResult, assessmentResult, consultationResult, advertiserResult] = await Promise.all([
      supabase.from('subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('course_enrollments').select('id', { count: 'exact', head: true }),
      supabase.from('assessment_leads').select('id', { count: 'exact', head: true }),
      supabase.from('consultation_leads').select('id', { count: 'exact', head: true }),
      supabase.from('advertiser_inquiries').select('id', { count: 'exact', head: true }),
    ]);
    setSubscriberCount(subResult.count ?? 0);
    setEnrollmentCount(enrollResult.count ?? 0);
    setAssessmentLeadCount(assessmentResult.count ?? 0);
    setConsultationLeadCount(consultationResult.count ?? 0);
    setAdvertiserInquiryCount(advertiserResult.count ?? 0);
  };

  const fetchAdClicks = async () => {
    let query = supabase.from('ad_clicks').select('ad_name, clicked_at');

    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);
      query = query.gte('clicked_at', since.toISOString());
    }

    const { data, error } = await query;

    if (error || !data) {
      setAdClicks([]);
      setTotalAdClicks(0);
      return;
    }

    const clickCounts: Record<string, number> = {};
    data.forEach((click) => {
      clickCounts[click.ad_name] = (clickCounts[click.ad_name] || 0) + 1;
    });

    const clickStats = Object.entries(clickCounts)
      .map(([ad_name, clicks]) => ({ ad_name, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    setAdClicks(clickStats);
    setTotalAdClicks(data.length);
  };

  const fetchFunnelAnalytics = async () => {
    let eventQuery = supabase
      .from('funnel_events')
      .select('event_name, created_at, page_path, source, article_slug, assessment_result, offer_slug, target_href, metadata');

    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);
      eventQuery = eventQuery.gte('created_at', since.toISOString());
    }

    const { data: eventData, error: eventError } = await eventQuery.order('created_at', { ascending: false }).limit(1000);

    if (eventError || !eventData) {
      setFunnelEvents([]);
    } else {
      setFunnelEvents(eventData);
    }

    const { data: leadData, error: leadError } = await supabase
      .from('assessment_leads')
      .select('id, email, first_name, source, assessment_result, recommended_offer, last_result_at')
      .order('last_result_at', { ascending: false })
      .limit(10);

    if (leadError || !leadData) {
      setAssessmentLeads([]);
    } else {
      setAssessmentLeads(leadData);
    }

    const { data: consultationData, error: consultationError } = await supabase
      .from('consultation_leads')
      .select('id, name, email, phone, relationship, concern, treatment_history, urgency, message, source, page_path, lead_intent, lead_score, lead_tier, lead_reasons, pipeline_status, followup_status, followups_paused_at, next_followup_at, last_followup_at, contacted_at, booked_at, closed_at, lost_at, last_admin_action_at, admin_notes, next_action, next_action_due_at, created_at')
      .order('lead_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(50);

    if (consultationError || !consultationData) {
      setConsultationLeads([]);
    } else {
      setConsultationLeads(consultationData);
    }

    const { data: followupData, error: followupError } = await supabase
      .from('consultation_followup_queue')
      .select('id, consultation_lead_id, email, name, subject, sequence_step, scheduled_for, sent_at, skipped_at, error_message')
      .is('sent_at', null)
      .is('skipped_at', null)
      .order('scheduled_for', { ascending: true })
      .limit(12);

    if (followupError || !followupData) {
      setConsultationFollowups([]);
    } else {
      setConsultationFollowups(followupData);
    }

    const { data: advertiserData, error: advertiserError } = await supabase
      .from('advertiser_inquiries')
      .select('id, name, email, company, sponsor_type, monthly_budget, pipeline_status, next_action, proposal_sent_at, sold_at, lost_at, last_admin_action_at, admin_notes, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (advertiserError || !advertiserData) {
      setAdvertiserInquiries([]);
    } else {
      setAdvertiserInquiries(advertiserData);
    }
  };

  const fetchAnalytics = async () => {
    setLoading(true);

    let query = supabase.from('article_views').select('article_slug, viewed_at');

    if (timeRange !== 'all') {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const since = new Date();
      since.setDate(since.getDate() - days);
      query = query.gte('viewed_at', since.toISOString());
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching analytics:', error);
      setLoading(false);
      return;
    }

    // Count views per article
    const viewCounts: Record<string, number> = {};
    (data || []).forEach((view) => {
      viewCounts[view.article_slug] = (viewCounts[view.article_slug] || 0) + 1;
    });

    // Map to article info
    const articleStats: ArticleStat[] = blogPostsMeta.map((post) => ({
      slug: post.slug,
      title: post.title,
      views: viewCounts[post.slug] || 0,
      category: post.category,
      date: post.date,
    }));

    setStats(articleStats);
    setTotalViews((data || []).length);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAnalytics();
      fetchAdClicks();
      fetchFunnelAnalytics();
    }
  }, [timeRange, isAdmin]);

  useEffect(() => {
    const selectedLead = consultationLeads.find((lead) => lead.id === selectedLeadId);
    if (selectedLead) {
      setLeadNoteDraft(selectedLead.admin_notes || "");
    } else if (!selectedLeadId && consultationLeads.length > 0) {
      setSelectedLeadId(consultationLeads[0].id);
    }
  }, [consultationLeads, selectedLeadId]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  };

  const processConsultationFollowups = async () => {
    setProcessingFollowups(true);
    try {
      const { data, error } = await supabase.functions.invoke('process-consultation-followups', {
        body: {},
      });

      if (error) throw error;

      const result = {
        sent: typeof data?.sent === 'number' ? data.sent : 0,
        errors: typeof data?.errors === 'number' ? data.errors : 0,
      };
      setLastFollowupRun(result);
      toast({
        title: "Follow-up run complete",
        description: `${result.sent} sent, ${result.errors} errors.`,
      });
      fetchFunnelAnalytics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast({
        title: "Follow-up run failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setProcessingFollowups(false);
    }
  };

  const sendWeeklyOwnerSummary = async () => {
    setSendingWeeklySummary(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-weekly-owner-summary', {
        body: {},
      });

      if (error) throw error;

      const sentTo = typeof data?.sentTo === "string" ? data.sentTo : "Matt";
      setLastWeeklySummarySentTo(sentTo);
      toast({
        title: "Weekly summary sent",
        description: `Owner summary sent to ${sentTo}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast({
        title: "Weekly summary failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSendingWeeklySummary(false);
    }
  };

  const updateConsultationLead = async (
    lead: ConsultationLeadRow,
    patch: Partial<ConsultationLeadRow>,
    successMessage: string,
  ) => {
    setLeadActionLoading(lead.id);
    try {
      const { error } = await supabase
        .from('consultation_leads')
        .update(patch)
        .eq('id', lead.id);

      if (error) throw error;

      toast({
        title: "Lead updated",
        description: successMessage,
      });
      await fetchFunnelAnalytics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast({
        title: "Lead update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLeadActionLoading(null);
    }
  };

  const setLeadPipelineStatus = (lead: ConsultationLeadRow, status: LeadPipelineStatus) => {
    const now = new Date().toISOString();
    const patch: Partial<ConsultationLeadRow> = {
      pipeline_status: status,
      last_admin_action_at: now,
    };

    if (status === "contacted") {
      patch.contacted_at = lead.contacted_at || now;
      patch.next_action = "book_consultation";
    }

    if (status === "booked") {
      patch.contacted_at = lead.contacted_at || now;
      patch.booked_at = lead.booked_at || now;
      patch.followup_status = "paused";
      patch.followups_paused_at = lead.followups_paused_at || now;
      patch.next_action = "wait";
    }

    if (status === "active") {
      patch.followup_status = "active";
      patch.followups_paused_at = null;
      patch.next_action = "call";
    }

    if (status === "closed") {
      patch.closed_at = lead.closed_at || now;
      patch.followup_status = "complete";
      patch.followups_paused_at = lead.followups_paused_at || now;
      patch.next_action = "close";
    }

    if (status === "lost") {
      patch.lost_at = lead.lost_at || now;
      patch.followup_status = "complete";
      patch.followups_paused_at = lead.followups_paused_at || now;
      patch.next_action = "close";
    }

    updateConsultationLead(lead, patch, `Moved ${lead.name} to ${pipelineLabels[status]}.`);
  };

  const setLeadNextAction = (lead: ConsultationLeadRow, nextAction: string) => {
    updateConsultationLead(
      lead,
      {
        next_action: nextAction,
        last_admin_action_at: new Date().toISOString(),
      },
      `Next action set to ${nextActionLabels[nextAction] || nextAction}.`,
    );
  };

  const toggleLeadFollowups = (lead: ConsultationLeadRow) => {
    const now = new Date().toISOString();
    const isPaused = Boolean(lead.followups_paused_at);
    updateConsultationLead(
      lead,
      {
        followup_status: isPaused ? "active" : "paused",
        followups_paused_at: isPaused ? null : now,
        last_admin_action_at: now,
      },
      isPaused ? "Automated follow-ups resumed." : "Automated follow-ups paused.",
    );
  };

  const saveLeadNotes = (lead: ConsultationLeadRow) => {
    updateConsultationLead(
      lead,
      {
        admin_notes: leadNoteDraft.trim() || null,
        last_admin_action_at: new Date().toISOString(),
      },
      "Lead notes saved.",
    );
  };

  const updateAdvertiserStatus = async (inquiry: AdvertiserInquiryRow, status: AdvertiserPipelineStatus) => {
    setLeadActionLoading(inquiry.id);
    const now = new Date().toISOString();
    const patch: Partial<AdvertiserInquiryRow> = {
      pipeline_status: status,
      last_admin_action_at: now,
    };

    if (status === "contacted") patch.next_action = "send_media_kit";
    if (status === "proposal_sent") {
      patch.proposal_sent_at = inquiry.proposal_sent_at || now;
      patch.next_action = "follow_up";
    }
    if (status === "negotiating") patch.next_action = "follow_up";
    if (status === "sold") {
      patch.sold_at = inquiry.sold_at || now;
      patch.next_action = "wait";
    }
    if (status === "lost") {
      patch.lost_at = inquiry.lost_at || now;
      patch.next_action = "close";
    }

    try {
      const { error } = await supabase
        .from('advertiser_inquiries')
        .update(patch)
        .eq('id', inquiry.id);

      if (error) throw error;

      toast({
        title: "Advertiser updated",
        description: `Moved ${inquiry.company || inquiry.name} to ${advertiserPipelineLabels[status]}.`,
      });
      await fetchFunnelAnalytics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast({
        title: "Advertiser update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLeadActionLoading(null);
    }
  };

  const updateAdvertiserNextAction = async (inquiry: AdvertiserInquiryRow, nextAction: string) => {
    setLeadActionLoading(inquiry.id);
    try {
      const { error } = await supabase
        .from('advertiser_inquiries')
        .update({
          next_action: nextAction,
          last_admin_action_at: new Date().toISOString(),
        })
        .eq('id', inquiry.id);

      if (error) throw error;

      toast({
        title: "Advertiser updated",
        description: `Next action set to ${nextActionLabels[nextAction] || nextAction}.`,
      });
      await fetchFunnelAnalytics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Please try again later.";
      toast({
        title: "Advertiser update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLeadActionLoading(null);
    }
  };

  const exportConsultationLeads = () => {
    downloadCsv(
      `consultation-leads-${new Date().toISOString().slice(0, 10)}.csv`,
      consultationLeads.map((lead) => ({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: pipelineLabels[getPipelineStatus(lead.pipeline_status)],
        next_action: nextActionLabels[lead.next_action] || lead.next_action,
        score: lead.lead_score,
        tier: lead.lead_tier,
        intent: lead.lead_intent,
        source: lead.source,
        page_path: lead.page_path,
        relationship: lead.relationship,
        urgency: lead.urgency,
        concern: lead.concern,
        next_followup_at: lead.next_followup_at,
        created_at: lead.created_at,
      })),
    );
  };

  const exportAdvertiserInquiries = () => {
    downloadCsv(
      `advertiser-inquiries-${new Date().toISOString().slice(0, 10)}.csv`,
      advertiserInquiries.map((inquiry) => ({
        company: inquiry.company,
        name: inquiry.name,
        email: inquiry.email,
        status: advertiserPipelineLabels[getAdvertiserPipelineStatus(inquiry.pipeline_status)],
        next_action: nextActionLabels[inquiry.next_action] || inquiry.next_action,
        sponsor_type: inquiry.sponsor_type,
        monthly_budget: inquiry.monthly_budget,
        created_at: inquiry.created_at,
      })),
    );
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "desc" ? "asc" : "desc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const syncArticleMetadata = async () => {
    setSyncing(true);
    try {
      const siteOrigin = "https://nomoreenabling.com";
      const records = blogPostsMeta.map((post) => {
        // Build absolute image URL from the resolved import
        const resolved = post.image.startsWith("http")
          ? post.image
          : `${siteOrigin}${post.image}`;
        // In dev, images resolve to /src/assets/ which won't work in prod
        const imageUrl = resolved.includes("/src/assets/")
          ? `${siteOrigin}/favicon.jpg`
          : resolved;
        return {
          slug: post.slug,
          title: post.metaTitle || post.title,
          description: post.metaDescription || post.excerpt,
          image_url: imageUrl,
          updated_at: new Date().toISOString(),
        };
      });

      const { error } = await supabase
        .from("articles_metadata")
        .upsert(records, { onConflict: "slug" });

      if (error) throw error;

      setLastSyncCount(records.length);
      toast({
        title: "Metadata synced!",
        description: `${records.length} articles synced for social sharing.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Please try again later.";
      toast({
        title: "Sync failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const sortedStats = [...stats].sort((a, b) => {
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortField === "views") return (a.views - b.views) * dir;
    if (sortField === "title") return a.title.localeCompare(b.title) * dir;
    if (sortField === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    return 0;
  });

  const topArticle = stats.reduce((top, s) => (s.views > (top?.views || 0) ? s : top), stats[0]);
  const viewedArticleCount = stats.filter((s) => s.views > 0).length;
  const avgViews = viewedArticleCount > 0 ? Math.round(totalViews / viewedArticleCount) : 0;
  const monthlySponsorInventory = sponsorPlacements.reduce((total, placement) => total + placement.monthlyRate, 0);
  const availableSponsorPlacements = sponsorPlacements.filter((placement) => placement.status === "available").length;
  const houseSponsorPlacements = sponsorPlacements.filter((placement) => placement.status === "house").length;
  const eventCount = (eventName: string) => funnelEvents.filter((event) => event.event_name === eventName).length;
  const assessmentStarts = eventCount("assessment_started");
  const assessmentCompletions = eventCount("assessment_completed");
  const emailCaptures = eventCount("email_capture_success");
  const stickyCtaClicks = eventCount("sticky_cta_click");
  const articleIntentCtaClicks = eventCount("article_intent_cta_click");
  const topicHubCtaClicks = eventCount("topic_hub_cta_click");
  const leadMagnetSignups = eventCount("lead_magnet_signup");
  const consultationRequests = eventCount("consultation_request");
  const advertiserInquiryEvents = eventCount("advertiser_inquiry");
  const sponsorImpressions = eventCount("sponsor_impression");
  const bridgeClicks = eventCount("bridge_page_click");
  const outboundOfferClicks = eventCount("outbound_offer_click");
  const answerPageViews = eventCount("answer_page_view");
  const answerPageClicks = eventCount("answer_page_click");
  const officialResourceClicks = eventCount("official_resource_click");
  const sponsorCtr = sponsorImpressions > 0 ? ((totalAdClicks / sponsorImpressions) * 100).toFixed(1) : "0.0";
  const completionRate = assessmentStarts > 0 ? Math.round((assessmentCompletions / assessmentStarts) * 100) : 0;
  const captureRate = assessmentCompletions > 0 ? Math.round((emailCaptures / assessmentCompletions) * 100) : 0;
  const soberHelplineBridgeEvents = funnelEvents.filter((event) => {
    const targetHref = event.target_href || "";
    return (
      targetHref.includes("soberhelpline.com/from-no-more-enabling") ||
      (event.offer_slug === "sober-helpline" && ["bridge_page_click", "outbound_offer_click"].includes(event.event_name))
    );
  });
  const soberHelplineHandoffs = soberHelplineBridgeEvents.length;
  const consultationLeadRows = consultationLeads.length;
  const advertiserInquiryRows = advertiserInquiries.length;
  const visibleBookedLeadCount = consultationLeads.filter((lead) => getPipelineStatus(lead.pipeline_status) === "booked").length;
  const visibleClosedLeadCount = consultationLeads.filter((lead) => getPipelineStatus(lead.pipeline_status) === "closed").length;
  const consultationCloseRate = formatPercent(visibleBookedLeadCount + visibleClosedLeadCount, consultationLeadRows);
  const articleToBridgeRate = formatPercent(soberHelplineHandoffs, totalViews);
  const articleToConsultationRate = formatPercent(consultationLeadRows, totalViews);
  const advertiserConversionRate = formatPercent(advertiserInquiryRows, totalViews);
  const funnelScorecard = [
    {
      label: "Article Views",
      value: totalViews.toLocaleString(),
      note: `${viewedArticleCount} articles with traffic`,
      icon: Eye,
    },
    {
      label: "Sober Helpline Handoffs",
      value: soberHelplineHandoffs.toLocaleString(),
      note: `${articleToBridgeRate} of article views`,
      icon: Route,
    },
    {
      label: "Consultation Leads",
      value: consultationLeadRows.toLocaleString(),
      note: `${articleToConsultationRate} of article views`,
      icon: PhoneCall,
    },
    {
      label: "Booked or Closed",
      value: (visibleBookedLeadCount + visibleClosedLeadCount).toLocaleString(),
      note: `${consultationCloseRate} of visible leads`,
      icon: CalendarCheck,
    },
    {
      label: "Advertiser Inquiries",
      value: advertiserInquiryRows.toLocaleString(),
      note: `${advertiserConversionRate} of article views`,
      icon: DollarSign,
    },
  ];

  const resultBreakdown: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => event.event_name === "assessment_completed" && event.assessment_result)
      .reduce<Record<string, number>>((acc, event) => {
        const key = event.assessment_result || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({ key, label: resultLabels[key] || key, count }))
    .sort((a, b) => b.count - a.count);

  const offerClickBreakdown: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => ["bridge_page_click", "outbound_offer_click"].includes(event.event_name) && event.offer_slug)
      .reduce<Record<string, number>>((acc, event) => {
        const key = event.offer_slug || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({ key, label: getSupportOffer(key)?.name || key, count }))
    .sort((a, b) => b.count - a.count);

  const answerPathForId = (answerId: string) => `/answers/${answerId}`;
  const answerEventsForPath = (path: string) =>
    funnelEvents.filter((event) => event.page_path === path || event.target_href === path);
  const answerPageStats: AnswerMoneyStat[] = aeoAnswers
    .map((answer) => {
      const path = answerDetailPath(answer);
      const eventsForPage = answerEventsForPath(path);
      const clickEvents = eventsForPage.filter((event) => event.event_name === "answer_page_click");
      const revenueClicks = clickEvents.filter((event) => getMetadataString(event, "click_type") === "primary_revenue_path");
      const officialClicks = eventsForPage.filter((event) => event.event_name === "official_resource_click");
      const targetMatches = (needle: string) => clickEvents.filter((event) => (event.target_href || "").includes(needle)).length;

      return {
        answer,
        path,
        views: eventsForPage.filter((event) => event.event_name === "answer_page_view").length,
        clicks: clickEvents.length,
        revenueClicks: revenueClicks.length,
        familySquaresClicks: targetMatches("soberhelpline.com/family-squares"),
        consultationClicks: targetMatches("/family-addiction-consultation"),
        interventionClicks: targetMatches("/intervention-help"),
        assessmentClicks: targetMatches("/family-situation-assessment"),
        officialResourceClicks: officialClicks.length,
        consultationLeads: consultationLeads.filter((lead) => lead.page_path === path).length,
      };
    })
    .sort((a, b) =>
      b.consultationLeads - a.consultationLeads ||
      b.revenueClicks - a.revenueClicks ||
      b.clicks - a.clicks ||
      b.views - a.views
    );

  const topAnswerPages = answerPageStats.filter((stat) => stat.views + stat.clicks + stat.consultationLeads > 0).slice(0, 10);
  const answerRevenuePathCounts: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => event.event_name === "answer_page_click" && getMetadataString(event, "click_type") === "primary_revenue_path")
      .reduce<Record<string, number>>((acc, event) => {
        const key = getMetadataString(event, "revenue_path") || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({ key, label: key.replace(/-/g, " "), count }))
    .sort((a, b) => b.count - a.count);

  const officialResourceBreakdown: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => event.event_name === "official_resource_click")
      .reduce<Record<string, number>>((acc, event) => {
        const key = getMetadataString(event, "resource_organization") || getMetadataString(event, "resource_id") || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count);

  const articleFunnelSources: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => event.article_slug)
      .reduce<Record<string, number>>((acc, event) => {
        const key = event.article_slug || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({
      key,
      label: blogPostsMeta.find((post) => post.slug === key)?.title || key,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const bridgeArticleSources = Object.entries(
    soberHelplineBridgeEvents
      .filter((event) => event.article_slug)
      .reduce<Record<string, number>>((acc, event) => {
        const key = event.article_slug || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, handoffs]) => {
      const articleStat = stats.find((stat) => stat.slug === key);
      return {
        key,
        title: articleStat?.title || blogPostsMeta.find((post) => post.slug === key)?.title || key,
        views: articleStat?.views || 0,
        handoffs,
        rate: articleStat?.views ? handoffs / articleStat.views : 0,
      };
    })
    .sort((a, b) => b.handoffs - a.handoffs || b.rate - a.rate)
    .slice(0, 6);

  const sponsorPageStats: FunnelBreakdownStat[] = Object.entries(
    funnelEvents
      .filter((event) => event.event_name === "sponsor_impression")
      .reduce<Record<string, number>>((acc, event) => {
        const key = event.page_path || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {})
  )
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const sponsorSummary = [
    `${sponsorImpressions.toLocaleString()} sponsor impressions`,
    `${totalAdClicks.toLocaleString()} sponsor clicks`,
    `${sponsorCtr}% sponsor CTR`,
    `${formatSponsorRate(monthlySponsorInventory)} listed monthly inventory`,
    `${availableSponsorPlacements} available paid placements`,
  ];
  const followUpTodayLeads = consultationLeads
    .filter((lead) => lead.lead_tier === "priority" || lead.lead_tier === "warm")
    .slice(0, 6);
  const nowTime = Date.now();
  const dueFollowups = consultationFollowups.filter((followup) => new Date(followup.scheduled_for).getTime() <= nowTime);
  const nextQueuedFollowup = consultationFollowups.find((followup) => new Date(followup.scheduled_for).getTime() > nowTime);
  const selectedLead = consultationLeads.find((lead) => lead.id === selectedLeadId) || consultationLeads[0] || null;
  const selectedLeadFollowups = selectedLead
    ? consultationFollowups.filter((followup) => followup.consultation_lead_id === selectedLead.id)
    : [];
  const pipelineCounts = leadPipelineStatuses.map((status) => ({
    status,
    count: consultationLeads.filter((lead) => getPipelineStatus(lead.pipeline_status) === status).length,
  }));
  const hotLeadCount = consultationLeads.filter((lead) => lead.lead_tier === "priority" || lead.lead_score >= 65).length;
  const bookedLeadCount = consultationLeads.filter((lead) => getPipelineStatus(lead.pipeline_status) === "booked").length;
  const closedLeadCount = consultationLeads.filter((lead) => getPipelineStatus(lead.pipeline_status) === "closed").length;
  const nextActionCounts = consultationNextActions.map((action) => ({
    action,
    count: consultationLeads.filter((lead) => lead.next_action === action).length,
  }));
  const leadSourceStats: FunnelBreakdownStat[] = Object.entries(
    consultationLeads.reduce<Record<string, number>>((acc, lead) => {
      const key = lead.page_path || lead.source || "unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  )
    .map(([key, count]) => ({ key, label: key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
  const advertiserPipelineCounts = advertiserPipelineStatuses.map((status) => ({
    status,
    count: advertiserInquiries.filter((inquiry) => getAdvertiserPipelineStatus(inquiry.pipeline_status) === status).length,
  }));
  const advertiserSoldCount = advertiserInquiries.filter((inquiry) => getAdvertiserPipelineStatus(inquiry.pipeline_status) === "sold").length;
  const advertiserOpenCount = advertiserInquiries.filter((inquiry) =>
    ["new", "contacted", "proposal_sent", "negotiating"].includes(getAdvertiserPipelineStatus(inquiry.pipeline_status))
  ).length;
  const conversionAudit = commercialIntentPages.map((page) => {
    const pagePath = `/${page.slug}`;
    const leadCount = consultationLeads.filter((lead) => lead.page_path === pagePath || lead.lead_intent === page.leadIntent).length;
    const ctaClicks = funnelEvents.filter((event) =>
      event.event_name === "article_intent_cta_click" &&
      (event.page_path === pagePath || event.target_href?.includes(page.slug))
    ).length;
    const recommendation =
      page.primaryOffer === "freedom-interventions"
        ? "Intervention CTA"
        : page.primaryOffer === "sober-helpline"
          ? "Sober Helpline CTA"
          : "Coaching CTA";

    return {
      slug: page.slug,
      title: page.eyebrow,
      recommendation,
      leadCount,
      ctaClicks,
      status: leadCount > 0 ? "Producing leads" : ctaClicks > 0 ? "Clicks, no leads yet" : "Needs traffic",
    };
  });

  const seoAeoMoneyPages = [
    ...answerPageStats
      .filter((stat) => stat.views + stat.clicks + stat.consultationLeads > 0)
      .slice(0, 8)
      .map((stat) => ({
        key: stat.path,
        label: stat.answer.question,
        type: "Answer",
        views: stat.views,
        clicks: stat.revenueClicks,
        leads: stat.consultationLeads,
        note: stat.answer.revenuePath ?? "assessment",
      })),
    ...conversionAudit
      .filter((page) => page.ctaClicks + page.leadCount > 0)
      .slice(0, 6)
      .map((page) => ({
        key: `/${page.slug}`,
        label: page.title,
        type: "Money page",
        views: 0,
        clicks: page.ctaClicks,
        leads: page.leadCount,
        note: page.recommendation,
      })),
  ].sort((a, b) => b.leads - a.leads || b.clicks - a.clicks || b.views - a.views);

  const getPrimaryHubForArticle = (slug: string | null) => {
    if (!slug) return null;

    const post = blogPostsMeta.find((article) => article.slug === slug);
    if (!post) return null;

    return (
      topicHubs.find((hub) => post.categories.some((category) => hub.categories.includes(category))) ??
      topicHubs.find((hub) => hub.featuredSlugs.includes(post.slug)) ??
      null
    );
  };

  const clusterArticleCounts = topicHubs.reduce<Record<string, number>>((acc, hub) => {
    acc[hub.slug] = blogPostsMeta.filter((post) => {
      const categoryMatch = post.categories.some((category) => hub.categories.includes(category));
      return categoryMatch || hub.featuredSlugs.includes(post.slug);
    }).length;
    return acc;
  }, {});

  const clusterFunnelStats: ClusterFunnelStat[] = Object.values(
    funnelEvents
      .filter((event) => event.article_slug)
      .reduce<Record<string, ClusterFunnelStat>>((acc, event) => {
        const hub = getPrimaryHubForArticle(event.article_slug);
        const key = hub?.slug ?? "unclustered";
        const label = hub?.shortTitle ?? "Unclustered Articles";

        if (!acc[key]) {
          acc[key] = {
            key,
            label,
            articleCount: key === "unclustered" ? 0 : clusterArticleCounts[key] ?? 0,
            events: 0,
            ctaClicks: 0,
            hubClicks: 0,
            offerClicks: 0,
          };
        }

        acc[key].events += 1;

        if (["sticky_cta_click", "article_intent_cta_click"].includes(event.event_name)) {
          acc[key].ctaClicks += 1;
        }

        if (event.event_name === "topic_hub_cta_click") {
          acc[key].hubClicks += 1;
        }

        if (["bridge_page_click", "outbound_offer_click"].includes(event.event_name)) {
          acc[key].offerClicks += 1;
        }

        return acc;
      }, {})
  )
    .sort((a, b) => b.ctaClicks + b.offerClicks + b.hubClicks - (a.ctaClicks + a.offerClicks + a.hubClicks))
    .slice(0, 8);

  // Login screen
  if (!session || !isAdmin) {
    return (
      <>
        <SEOHead title="Admin Analytics" description="Admin analytics dashboard" noindex />
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="font-serif text-2xl">Admin Analytics</CardTitle>
              <p className="text-muted-foreground text-sm mt-1">
                {session && !isAdmin
                  ? "Your account does not have admin access."
                  : "Sign in with your admin account"}
              </p>
            </CardHeader>
            {(!session || !isAdmin) && !loading && (
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button type="submit" className="w-full" disabled={authLoading}>
                    {authLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                {session && !isAdmin && (
                  <Button variant="ghost" className="w-full mt-2" onClick={handleLogout}>
                    Sign out and try another account
                  </Button>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading analytics...</p>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Admin Analytics" description="Admin analytics dashboard" noindex />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" />
              <h1 className="font-serif text-xl font-bold text-foreground">Admin Dashboard</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "analytics" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >Analytics & Leads</button>
            <button
              onClick={() => setActiveTab("crm")}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === "crm" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >CRM & Email</button>
          </div>

          {activeTab === "crm" ? <AdminCrmPanel /> : <>
          {/* Time Range Filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {([
              { value: "7d", label: "Last 7 Days" },
              { value: "30d", label: "Last 30 Days" },
              { value: "90d", label: "Last 90 Days" },
              { value: "all", label: "All Time" },
            ] as const).map((range) => (
              <Button
                key={range.value}
                variant={timeRange === range.value ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </div>

          <section className="mb-8">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Funnel Scorecard</h2>
                <p className="text-muted-foreground text-sm">
                  The short version: articles should create trust, hand off families to Sober Helpline or consultation, and prove sponsor value.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {funnelScorecard.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label} className="overflow-hidden">
                    <CardContent className="pt-6">
                      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-3xl font-bold text-foreground">{item.value}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Sober Helpline Bridge Sources</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Which article pages are handing readers to the NME bridge on SoberHelpline.com.
                  </p>
                </CardHeader>
                <CardContent>
                  {bridgeArticleSources.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No article bridge clicks recorded yet for this period.</p>
                  ) : (
                    <div className="space-y-3">
                      {bridgeArticleSources.map((item) => (
                        <div key={item.key} className="rounded-xl border border-border p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <a
                                href={`/articles/${item.key}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {item.title}
                              </a>
                              <p className="text-xs text-muted-foreground">{item.views.toLocaleString()} article views</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-foreground">{item.handoffs}</p>
                              <p className="text-xs text-muted-foreground">{formatPercent(item.handoffs, item.views)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Next Funnel Question</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Use this to decide the next build sprint without guessing.
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="rounded-xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">If article views are growing but handoffs are low</p>
                    <p className="mt-1">Improve article CTAs, bridge placement, and the Sober Helpline bridge page promise.</p>
                  </div>
                  <div className="rounded-xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">If handoffs are growing but leads are flat</p>
                    <p className="mt-1">Tighten the bridge page and Family Squares registration path before adding more traffic.</p>
                  </div>
                  <div className="rounded-xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">If sponsor interest is flat</p>
                    <p className="mt-1">Package traffic proof, audience fit, and lead quality into the advertise page and media kit.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">SEO/AEO Money Pages</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Answer pages and commercial pages ranked by revenue clicks, consultation leads, and search-intent movement.
                  </p>
                </CardHeader>
                <CardContent>
                  {seoAeoMoneyPages.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No answer-page or money-page revenue activity recorded yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Page</th>
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Type</th>
                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Views</th>
                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Clicks</th>
                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Leads</th>
                          </tr>
                        </thead>
                        <tbody>
                          {seoAeoMoneyPages.map((page) => (
                            <tr key={page.key} className="border-b border-border/50">
                              <td className="py-3 px-2">
                                <a href={page.key} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary">
                                  {page.label}
                                </a>
                                <p className="text-xs text-muted-foreground">{page.note}</p>
                              </td>
                              <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{page.type}</td>
                              <td className="py-3 px-2 text-right text-muted-foreground">{page.views.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right font-medium text-foreground">{page.clicks.toLocaleString()}</td>
                              <td className="py-3 px-2 text-right font-medium text-foreground">{page.leads.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Answer Page Activity</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Separates revenue clicks from trust-source clicks so we know what is helping conversion versus credibility.
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">Views</p>
                      <p className="text-2xl font-bold text-foreground">{answerPageViews.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">Clicks</p>
                      <p className="text-2xl font-bold text-foreground">{answerPageClicks.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">Source</p>
                      <p className="text-2xl font-bold text-foreground">{officialResourceClicks.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Revenue path clicks</p>
                    {answerRevenuePathCounts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No primary answer-page revenue clicks yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {answerRevenuePathCounts.map((item) => (
                          <div key={item.key} className="flex justify-between gap-3 rounded-lg border border-border p-2 text-sm">
                            <span className="capitalize text-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-foreground">Official-source clicks</p>
                    {officialResourceBreakdown.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No official-source clicks yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {officialResourceBreakdown.slice(0, 4).map((item) => (
                          <div key={item.key} className="flex justify-between gap-3 rounded-lg border border-border p-2 text-sm">
                            <span className="text-foreground">{item.label}</span>
                            <span className="font-medium text-foreground">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm mb-1">Hot Leads</div>
                  <p className="text-3xl font-bold text-foreground">{hotLeadCount}</p>
                  <p className="text-xs text-muted-foreground">Priority score or 65+</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm mb-1">Booked</div>
                  <p className="text-3xl font-bold text-foreground">{bookedLeadCount}</p>
                  <p className="text-xs text-muted-foreground">Consultation pipeline</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm mb-1">Closed</div>
                  <p className="text-3xl font-bold text-foreground">{closedLeadCount}</p>
                  <p className="text-xs text-muted-foreground">Won opportunities</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-muted-foreground text-sm mb-1">Due Follow-Ups</div>
                  <p className="text-3xl font-bold text-foreground">{dueFollowups.length}</p>
                  <p className="text-xs text-muted-foreground">{consultationFollowups.length} queued total</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-3 md:grid-cols-6">
                  {pipelineCounts.map((item) => (
                    <div key={item.status} className="rounded-xl border border-border p-3">
                      <p className="text-xs text-muted-foreground">{pipelineLabels[item.status]}</p>
                      <p className="text-2xl font-bold text-foreground">{item.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-[1fr_1fr] mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Weekly Operating Summary</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Sends Matt a weekly owner email with hot leads, due follow-ups, lead source pages, advertiser pipeline, and sponsor stats.
                  </p>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" size="sm" onClick={sendWeeklyOwnerSummary} disabled={sendingWeeklySummary}>
                    <Send className={`h-4 w-4 ${sendingWeeklySummary ? "animate-pulse" : ""}`} />
                    {sendingWeeklySummary ? "Sending summary..." : "Send weekly summary now"}
                  </Button>
                  {lastWeeklySummarySentTo && (
                    <p className="mt-3 text-xs text-muted-foreground">Last sent this session to {lastWeeklySummarySentTo}.</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Next Actions</CardTitle>
                  <p className="text-muted-foreground text-sm">A simple operating queue for what each lead needs next.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {nextActionCounts.map((item) => (
                      <div key={item.action} className="rounded-xl bg-secondary/40 p-3">
                        <p className="text-xs text-muted-foreground">{nextActionLabels[item.action]}</p>
                        <p className="text-2xl font-bold text-foreground">{item.count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Follow Up Today</h2>
                <p className="text-muted-foreground text-sm">
                  The warmest consultation leads, sorted by urgency and intent. Start here before reviewing the rest of the dashboard.
                </p>
              </div>
            </div>
            <Card>
              <CardContent className="pt-6">
                {followUpTodayLeads.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No priority or warm consultation leads yet.</p>
                ) : (
                  <div className="grid gap-4 lg:grid-cols-2">
                    {followUpTodayLeads.map((lead) => {
                      const phoneHref = lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, "")}` : null;
                      const emailHref = `mailto:${lead.email}?subject=${encodeURIComponent("Following up on your No More Enabling request")}`;
                      return (
                        <div key={lead.id} className="rounded-2xl border border-border bg-background p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-semibold text-foreground">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.relationship || "Relationship unknown"} · {lead.lead_intent || lead.source}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                lead.lead_tier === "priority"
                                  ? "bg-destructive/10 text-destructive"
                                  : "bg-primary/10 text-primary"
                              }`}>
                                {lead.lead_score}
                              </span>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pipelineBadgeClass[getPipelineStatus(lead.pipeline_status)]}`}>
                                {pipelineLabels[getPipelineStatus(lead.pipeline_status)]}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                            {lead.concern || lead.urgency || "No concern listed"}
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {lead.lead_reasons.slice(0, 3).map((reason) => (
                              <span key={reason} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                                {reason}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button size="sm" asChild>
                              <a href={emailHref}>
                                <Mail className="h-4 w-4" />
                                Email
                              </a>
                            </Button>
                            {phoneHref && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={phoneHref}>
                                  <PhoneCall className="h-4 w-4" />
                                  Call
                                </a>
                              </Button>
                            )}
                            <Button size="sm" variant="secondary" onClick={() => setSelectedLeadId(lead.id)}>
                              <ClipboardList className="h-4 w-4" />
                              Details
                            </Button>
                            <span className="ml-auto text-xs text-muted-foreground self-center">
                              {formatDateTime(lead.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {selectedLead && (
              <Card className="mt-4">
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-serif text-lg">Lead Detail</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {selectedLead.name} · {selectedLead.email} · {selectedLead.page_path || selectedLead.source}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${pipelineBadgeClass[getPipelineStatus(selectedLead.pipeline_status)]}`}>
                      {pipelineLabels[getPipelineStatus(selectedLead.pipeline_status)]}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-4">
                      <div className="grid gap-3 md:grid-cols-4">
                        <div className="rounded-xl bg-secondary/40 p-3">
                          <p className="text-xs text-muted-foreground">Score</p>
                          <p className="font-semibold text-foreground">{selectedLead.lead_score} · {selectedLead.lead_tier}</p>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3">
                          <p className="text-xs text-muted-foreground">Intent</p>
                          <p className="font-semibold text-foreground">{selectedLead.lead_intent || "Unknown"}</p>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3">
                          <p className="text-xs text-muted-foreground">Next Follow-Up</p>
                          <p className="font-semibold text-foreground">
                            {selectedLead.next_followup_at ? formatDateTime(selectedLead.next_followup_at) : "None queued"}
                          </p>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3">
                          <p className="text-xs text-muted-foreground">Next Action</p>
                          <p className="font-semibold text-foreground">{nextActionLabels[selectedLead.next_action] || selectedLead.next_action}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Concern</p>
                          <p className="mt-1 text-sm text-foreground">{selectedLead.concern || selectedLead.message || "No concern listed."}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Urgency</p>
                          <p className="mt-1 text-sm text-foreground">{selectedLead.urgency || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Treatment History</p>
                          <p className="mt-1 text-sm text-foreground">{selectedLead.treatment_history || "Not specified"}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Attribution</p>
                          <p className="mt-1 text-sm text-foreground">{selectedLead.page_path || selectedLead.source}</p>
                        </div>
                      </div>

                      {selectedLead.lead_reasons.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {selectedLead.lead_reasons.map((reason) => (
                            <span key={reason} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-muted-foreground">
                              {reason}
                            </span>
                          ))}
                        </div>
                      )}

                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-2">Admin Notes</p>
                        <Textarea
                          value={leadNoteDraft}
                          onChange={(event) => setLeadNoteDraft(event.target.value)}
                          placeholder="Add notes from calls, next steps, family context, or booking details."
                          className="min-h-28"
                        />
                        <Button
                          className="mt-2"
                          size="sm"
                          onClick={() => saveLeadNotes(selectedLead)}
                          disabled={leadActionLoading === selectedLead.id}
                        >
                          Save notes
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm font-medium text-foreground mb-3">Pipeline Actions</p>
                        <div className="grid grid-cols-2 gap-2">
                          <Button size="sm" variant="outline" onClick={() => setLeadPipelineStatus(selectedLead, "contacted")} disabled={leadActionLoading === selectedLead.id}>
                            <CheckCircle2 className="h-4 w-4" />
                            Contacted
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setLeadPipelineStatus(selectedLead, "booked")} disabled={leadActionLoading === selectedLead.id}>
                            <CalendarCheck className="h-4 w-4" />
                            Booked
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setLeadPipelineStatus(selectedLead, "closed")} disabled={leadActionLoading === selectedLead.id}>
                            <DollarSign className="h-4 w-4" />
                            Closed
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setLeadPipelineStatus(selectedLead, "lost")} disabled={leadActionLoading === selectedLead.id}>
                            <XCircle className="h-4 w-4" />
                            Lost
                          </Button>
                        </div>
                        <Button
                          className="mt-3 w-full"
                          size="sm"
                          variant={selectedLead.followups_paused_at ? "default" : "secondary"}
                          onClick={() => toggleLeadFollowups(selectedLead)}
                          disabled={leadActionLoading === selectedLead.id}
                        >
                          {selectedLead.followups_paused_at ? <PlayCircle className="h-4 w-4" /> : <PauseCircle className="h-4 w-4" />}
                          {selectedLead.followups_paused_at ? "Resume follow-ups" : "Pause follow-ups"}
                        </Button>
                      </div>

                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm font-medium text-foreground mb-3">Next Action</p>
                        <div className="grid grid-cols-2 gap-2">
                          {consultationNextActions.map((action) => (
                            <Button
                              key={action}
                              size="sm"
                              variant={selectedLead.next_action === action ? "default" : "outline"}
                              onClick={() => setLeadNextAction(selectedLead, action)}
                              disabled={leadActionLoading === selectedLead.id}
                            >
                              {nextActionLabels[action]}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-border p-4">
                        <p className="text-sm font-medium text-foreground mb-3">Queued Follow-Ups</p>
                        {selectedLeadFollowups.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No unsent follow-ups are queued for this lead.</p>
                        ) : (
                          <div className="space-y-3">
                            {selectedLeadFollowups.map((followup) => (
                              <div key={followup.id} className="text-sm">
                                <div className="flex justify-between gap-3">
                                  <p className="font-medium text-foreground">Step {followup.sequence_step}</p>
                                  <p className="text-xs text-muted-foreground">{formatDateTime(followup.scheduled_for)}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">{followup.subject}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Automated Follow-Ups</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    Queued emails are created when someone submits a consultation request.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary/40 p-4">
                      <p className="text-xs text-muted-foreground">Due now</p>
                      <p className="text-2xl font-bold text-foreground">{dueFollowups.length}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-4">
                      <p className="text-xs text-muted-foreground">Queued</p>
                      <p className="text-2xl font-bold text-foreground">{consultationFollowups.length}</p>
                    </div>
                  </div>
                  {nextQueuedFollowup && (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Next queued: {formatDateTime(nextQueuedFollowup.scheduled_for)}
                    </p>
                  )}
                  {lastFollowupRun && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last run: {lastFollowupRun.sent} sent, {lastFollowupRun.errors} errors.
                    </p>
                  )}
                  <Button
                    className="mt-4 w-full"
                    size="sm"
                    onClick={processConsultationFollowups}
                    disabled={processingFollowups}
                  >
                    <RefreshCw className={`h-4 w-4 ${processingFollowups ? "animate-spin" : ""}`} />
                    {processingFollowups ? "Processing..." : "Run due follow-ups"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Next Queued Follow-Ups</CardTitle>
                </CardHeader>
                <CardContent>
                  {consultationFollowups.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No consultation follow-up emails are queued.</p>
                  ) : (
                    <div className="space-y-3">
                      {consultationFollowups.slice(0, 5).map((followup) => (
                        <div key={followup.id} className="flex justify-between gap-4 rounded-xl border border-border p-3 text-sm">
                          <div>
                            <p className="font-medium text-foreground">{followup.name || followup.email}</p>
                            <p className="text-xs text-muted-foreground">{followup.subject}</p>
                            {followup.error_message && (
                              <p className="text-xs text-destructive mt-1">{followup.error_message}</p>
                            )}
                          </div>
                          <div className="text-right text-xs text-muted-foreground flex-shrink-0">
                            <p>Step {followup.sequence_step}</p>
                            <p>{formatDateTime(followup.scheduled_for)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Sponsor Inventory */}
          <section className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Sponsor Inventory</h2>
                <p className="text-muted-foreground text-sm">
                  Paid sponsor infrastructure is staged. Live placements are still house ads until you approve a sponsor.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Monthly Inventory
                  </div>
                  <p className="text-3xl font-bold text-foreground">{formatSponsorRate(monthlySponsorInventory)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <MousePointerClick className="w-4 h-4" />
                    Ad Clicks
                  </div>
                  <p className="text-3xl font-bold text-foreground">{totalAdClicks.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    Available
                  </div>
                  <p className="text-3xl font-bold text-foreground">{availableSponsorPlacements}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <BarChart3 className="w-4 h-4" />
                    Impressions
                  </div>
                  <p className="text-3xl font-bold text-foreground">{sponsorImpressions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{houseSponsorPlacements} house slots live</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Placement Menu</CardTitle>
                  <p className="text-muted-foreground text-sm">The rate card currently shown on the advertising page.</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Placement</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Surface</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Monthly</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sponsorPlacements.map((placement) => (
                          <tr key={placement.key} className="border-b border-border/50">
                            <td className="py-3 px-2">
                              <p className="font-medium text-foreground">{placement.name}</p>
                              <p className="text-xs text-muted-foreground">{placement.size}</p>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{placement.surface}</td>
                            <td className="py-3 px-2 text-right font-medium text-foreground">
                              {formatSponsorRate(placement.monthlyRate)}
                            </td>
                            <td className="py-3 px-2 text-right">
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                                {placement.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Package Ladder</CardTitle>
                  <p className="text-muted-foreground text-sm">Simple starting points for sales conversations.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sponsorshipPackages.map((packageOption) => (
                    <div key={packageOption.name} className="rounded-xl border border-border p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-foreground">{packageOption.name}</p>
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{packageOption.price}</span>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">{packageOption.fit}</p>
                    </div>
                  ))}
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm font-medium text-foreground">Hard filter</p>
                    <p className="mt-1 text-sm text-muted-foreground">{sponsorStandards.notAccepted[0]}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_1fr] mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Advertiser Reporting Snapshot</CardTitle>
                  <p className="text-muted-foreground text-sm">Use this as the starting point for monthly sponsor recaps.</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-secondary/40 p-4">
                      <p className="text-xs text-muted-foreground">Sponsor CTR</p>
                      <p className="text-2xl font-bold text-foreground">{sponsorCtr}%</p>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-4">
                      <p className="text-xs text-muted-foreground">Lead Magnet Signups</p>
                      <p className="text-2xl font-bold text-foreground">{leadMagnetSignups.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl border border-border bg-background p-4">
                    <p className="text-sm font-medium text-foreground">Copy-ready summary</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {sponsorSummary.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Top Sponsor Impression Pages</CardTitle>
                  <p className="text-muted-foreground text-sm">Pages creating the most sponsor visibility in this period.</p>
                </CardHeader>
                <CardContent>
                  {sponsorPageStats.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No sponsor impressions recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {sponsorPageStats.map((item) => {
                        const percentage = sponsorImpressions > 0 ? (item.count / sponsorImpressions) * 100 : 0;
                        return (
                          <div key={item.key}>
                            <div className="flex justify-between gap-3 text-sm mb-1">
                              <span className="font-medium text-foreground truncate">{item.label}</span>
                              <span className="text-muted-foreground">{item.count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Funnel Summary */}
          <section className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Funnel Performance</h2>
                <p className="text-muted-foreground text-sm">Assessment, capture, bridge, and offer-click activity for the selected period.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <ClipboardList className="w-4 h-4" />
                    Starts
                  </div>
                  <p className="text-3xl font-bold text-foreground">{assessmentStarts.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Target className="w-4 h-4" />
                    Completed
                  </div>
                  <p className="text-3xl font-bold text-foreground">{assessmentCompletions.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{completionRate}% completion</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Mail className="w-4 h-4" />
                    Captures
                  </div>
                  <p className="text-3xl font-bold text-foreground">{emailCaptures.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{captureRate}% of completions</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Route className="w-4 h-4" />
                    Bridge Clicks
                  </div>
                  <p className="text-3xl font-bold text-foreground">{bridgeClicks.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <MousePointerClick className="w-4 h-4" />
                    Offer Clicks
                  </div>
                  <p className="text-3xl font-bold text-foreground">{outboundOfferClicks.toLocaleString()}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Users className="w-4 h-4" />
                    Leads
                  </div>
                  <p className="text-3xl font-bold text-foreground">{assessmentLeadCount?.toLocaleString() ?? "—"}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Assessment Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {resultBreakdown.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No assessment completions recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {resultBreakdown.map((item) => {
                        const percentage = assessmentCompletions > 0 ? (item.count / assessmentCompletions) * 100 : 0;
                        return (
                          <div key={item.key}>
                            <div className="flex justify-between gap-3 text-sm mb-1">
                              <span className="font-medium text-foreground">{item.label}</span>
                              <span className="text-muted-foreground">{item.count} ({percentage.toFixed(0)}%)</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Offer Routing</CardTitle>
                </CardHeader>
                <CardContent>
                  {offerClickBreakdown.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No bridge or offer clicks recorded yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {offerClickBreakdown.map((item) => {
                        const totalOfferClicks = bridgeClicks + outboundOfferClicks;
                        const percentage = totalOfferClicks > 0 ? (item.count / totalOfferClicks) * 100 : 0;
                        return (
                          <div key={item.key}>
                            <div className="flex justify-between gap-3 text-sm mb-1">
                              <span className="font-medium text-foreground truncate">{item.label}</span>
                              <span className="text-muted-foreground">{item.count}</span>
                            </div>
                            <div className="h-2 rounded-full bg-muted overflow-hidden">
                              <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Top Article Funnel Sources</CardTitle>
                  <p className="text-muted-foreground text-sm">
                    {(stickyCtaClicks + articleIntentCtaClicks).toLocaleString()} CTA clicks and {topicHubCtaClicks.toLocaleString()} hub clicks
                  </p>
                </CardHeader>
                <CardContent>
                  {articleFunnelSources.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No article funnel source events yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {articleFunnelSources.map((item) => (
                        <div key={item.key} className="flex justify-between gap-3 text-sm">
                          <span className="font-medium text-foreground line-clamp-2">{item.label}</span>
                          <span className="text-muted-foreground flex-shrink-0">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Lead Revenue Attribution</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Shows which pages are producing consultation opportunities, not just traffic.
                </p>
              </CardHeader>
              <CardContent>
                {leadSourceStats.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No consultation lead source data yet.</p>
                ) : (
                  <div className="grid gap-3 md:grid-cols-2">
                    {leadSourceStats.map((item) => {
                      const percentage = consultationLeads.length > 0 ? (item.count / consultationLeads.length) * 100 : 0;
                      return (
                        <div key={item.key} className="rounded-xl border border-border p-4">
                          <div className="flex justify-between gap-3 text-sm mb-2">
                            <span className="font-medium text-foreground truncate">{item.label}</span>
                            <span className="text-muted-foreground">{item.count}</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${percentage}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Conversion Audit</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Checks the money pages against the CTA each page should be pushing.
                </p>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground">Page</th>
                        <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Primary CTA</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Clicks</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Leads</th>
                        <th className="text-right py-3 px-2 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conversionAudit.map((item) => (
                        <tr key={item.slug} className="border-b border-border/50">
                          <td className="py-3 px-2">
                            <a href={`/${item.slug}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground hover:text-primary">
                              {item.title}
                            </a>
                            <p className="text-xs text-muted-foreground">/{item.slug}</p>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">{item.recommendation}</td>
                          <td className="py-3 px-2 text-right text-muted-foreground">{item.ctaClicks}</td>
                          <td className="py-3 px-2 text-right font-medium text-foreground">{item.leadCount}</td>
                          <td className="py-3 px-2 text-right">
                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              item.status === "Producing leads"
                                ? "bg-emerald-100 text-emerald-800"
                                : item.status === "Clicks, no leads yet"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-secondary text-muted-foreground"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif text-lg">SEO Cluster Funnel Performance</CardTitle>
                <p className="text-muted-foreground text-sm">
                  Shows which topic clusters are turning article readers into next-step clicks.
                </p>
              </CardHeader>
              <CardContent>
                {clusterFunnelStats.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No article cluster funnel events recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Cluster</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Articles</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Events</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">CTA Clicks</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Hub Clicks</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Offer Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clusterFunnelStats.map((cluster) => (
                          <tr key={cluster.key} className="border-b border-border/50">
                            <td className="py-3 px-2">
                              <p className="font-medium text-foreground">{cluster.label}</p>
                            </td>
                            <td className="py-3 px-2 text-right text-muted-foreground">{cluster.articleCount}</td>
                            <td className="py-3 px-2 text-right text-muted-foreground">{cluster.events.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right font-medium text-foreground">{cluster.ctaClicks.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right text-muted-foreground">{cluster.hubClicks.toLocaleString()}</td>
                            <td className="py-3 px-2 text-right text-muted-foreground">{cluster.offerClicks.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.9fr] mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-serif text-lg">Priority Consultation Leads</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {consultationRequests.toLocaleString()} consultation request events. Leads are sorted by urgency and buying intent.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={exportConsultationLeads} disabled={consultationLeads.length === 0}>
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {consultationLeads.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No consultation leads captured yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Lead</th>
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Concern</th>
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden lg:table-cell">Status</th>
                            <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden xl:table-cell">Next</th>
                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Score</th>
                            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {consultationLeads.map((lead) => (
                            <tr key={lead.id} className="border-b border-border/50 hover:bg-muted/40">
                              <td className="py-3 px-2">
                                <p className="font-medium text-foreground">{lead.name}</p>
                                <p className="text-xs text-muted-foreground">{lead.email}</p>
                                <p className="text-xs text-muted-foreground">{lead.relationship || "Relationship unknown"} · {lead.page_path || lead.source}</p>
                              </td>
                              <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                                <p className="line-clamp-2">{lead.concern || lead.urgency || "—"}</p>
                                {lead.lead_reasons.length > 0 && (
                                  <p className="text-xs mt-1">{lead.lead_reasons.slice(0, 2).join(" · ")}</p>
                                )}
                              </td>
                              <td className="py-3 px-2 hidden lg:table-cell">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pipelineBadgeClass[getPipelineStatus(lead.pipeline_status)]}`}>
                                  {pipelineLabels[getPipelineStatus(lead.pipeline_status)]}
                                </span>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {lead.followups_paused_at ? "Follow-ups paused" : lead.followup_status}
                                </p>
                              </td>
                              <td className="py-3 px-2 hidden xl:table-cell">
                                <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                                  {nextActionLabels[lead.next_action] || lead.next_action}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  lead.lead_tier === "priority"
                                    ? "bg-destructive/10 text-destructive"
                                    : lead.lead_tier === "warm"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-secondary text-muted-foreground"
                                }`}>
                                  {lead.lead_score}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <Button size="sm" variant="ghost" onClick={() => setSelectedLeadId(lead.id)}>
                                  Details
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="font-serif text-lg">Advertiser Inquiries</CardTitle>
                      <p className="text-muted-foreground text-sm">
                        {advertiserInquiryEvents.toLocaleString()} inquiry events and {advertiserInquiryCount?.toLocaleString() ?? "—"} stored inquiries.
                      </p>
                    </div>
                    <Button size="sm" variant="outline" onClick={exportAdvertiserInquiries} disabled={advertiserInquiries.length === 0}>
                      <Download className="h-4 w-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="rounded-xl bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">Open pipeline</p>
                      <p className="text-2xl font-bold text-foreground">{advertiserOpenCount}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/40 p-3">
                      <p className="text-xs text-muted-foreground">Sold</p>
                      <p className="text-2xl font-bold text-foreground">{advertiserSoldCount}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {advertiserPipelineCounts.map((item) => (
                      <div key={item.status} className="rounded-lg border border-border p-2">
                        <p className="text-[11px] text-muted-foreground">{advertiserPipelineLabels[item.status]}</p>
                        <p className="text-lg font-bold text-foreground">{item.count}</p>
                      </div>
                    ))}
                  </div>
                  {advertiserInquiries.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No advertiser inquiries captured yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {advertiserInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="rounded-xl border border-border p-4">
                          <div className="flex justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{inquiry.company || inquiry.name}</p>
                              <p className="text-xs text-muted-foreground">{inquiry.email}</p>
                            </div>
                            <div className="text-right">
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${advertiserPipelineBadgeClass[getAdvertiserPipelineStatus(inquiry.pipeline_status)]}`}>
                                {advertiserPipelineLabels[getAdvertiserPipelineStatus(inquiry.pipeline_status)]}
                              </span>
                              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(inquiry.created_at)}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{inquiry.sponsor_type || "Sponsor type not provided"}</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Next: {nextActionLabels[inquiry.next_action] || inquiry.next_action}
                          </p>
                          {inquiry.monthly_budget && (
                            <p className="mt-2 text-xs text-primary font-medium">{inquiry.monthly_budget}</p>
                          )}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button size="sm" variant="outline" onClick={() => updateAdvertiserStatus(inquiry, "contacted")} disabled={leadActionLoading === inquiry.id}>
                              Contacted
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateAdvertiserStatus(inquiry, "proposal_sent")} disabled={leadActionLoading === inquiry.id}>
                              Proposal
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateAdvertiserStatus(inquiry, "negotiating")} disabled={leadActionLoading === inquiry.id}>
                              Negotiating
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateAdvertiserStatus(inquiry, "sold")} disabled={leadActionLoading === inquiry.id}>
                              Sold
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateAdvertiserStatus(inquiry, "lost")} disabled={leadActionLoading === inquiry.id}>
                              Lost
                            </Button>
                          </div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {advertiserNextActions.map((action) => (
                              <Button
                                key={action}
                                size="sm"
                                variant={inquiry.next_action === action ? "default" : "ghost"}
                                onClick={() => updateAdvertiserNextAction(inquiry, action)}
                                disabled={leadActionLoading === inquiry.id}
                              >
                                {nextActionLabels[action]}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="font-serif text-lg">Recent Assessment Leads</CardTitle>
                <p className="text-muted-foreground text-sm">Latest segmented leads captured by the family situation assessment.</p>
              </CardHeader>
              <CardContent>
                {assessmentLeads.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No assessment leads captured yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Lead</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground">Result</th>
                          <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Recommended Offer</th>
                          <th className="text-right py-3 px-2 font-medium text-muted-foreground">Latest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {assessmentLeads.map((lead) => (
                          <tr key={lead.id} className="border-b border-border/50">
                            <td className="py-3 px-2">
                              <p className="font-medium text-foreground">{lead.first_name || "Unknown"}</p>
                              <p className="text-xs text-muted-foreground">{lead.email}</p>
                            </td>
                            <td className="py-3 px-2">
                              <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                {resultLabels[lead.assessment_result] || lead.assessment_result}
                              </span>
                            </td>
                            <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                              {lead.recommended_offer ? getSupportOffer(lead.recommended_offer)?.name || lead.recommended_offer : "—"}
                            </td>
                            <td className="py-3 px-2 text-right text-muted-foreground text-xs">
                              {formatDateTime(lead.last_result_at)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <Eye className="w-4 h-4" />
                  Total Views
                </div>
                <p className="text-3xl font-bold text-foreground">{totalViews.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <FileText className="w-4 h-4" />
                  Articles
                </div>
                <p className="text-3xl font-bold text-foreground">{stats.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Avg Views/Article
                </div>
                <p className="text-3xl font-bold text-foreground">{avgViews}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                  <BarChart3 className="w-4 h-4" />
                  Top Article
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-2">{topArticle?.title || "N/A"}</p>
                <p className="text-xs text-muted-foreground">{topArticle?.views || 0} views</p>
              </CardContent>
            </Card>
          </div>

          {/* Subscriber & Enrollment Counts */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Newsletter Subscribers</div>
                <p className="text-3xl font-bold text-foreground">{subscriberCount?.toLocaleString() ?? "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Course Enrollments</div>
                <p className="text-3xl font-bold text-foreground">{enrollmentCount?.toLocaleString() ?? "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Consultation Leads</div>
                <p className="text-3xl font-bold text-foreground">{consultationLeadCount?.toLocaleString() ?? "—"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-muted-foreground text-sm mb-1">Advertiser Inquiries</div>
                <p className="text-3xl font-bold text-foreground">{advertiserInquiryCount?.toLocaleString() ?? "—"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Ad Click Analytics */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-primary" />
                Ad Click Performance
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {totalAdClicks.toLocaleString()} total clicks
              </p>
            </CardHeader>
            <CardContent>
              {adClicks.length === 0 ? (
                <p className="text-muted-foreground text-sm">No ad clicks recorded yet for this time period.</p>
              ) : (
                <div className="space-y-3">
                  {adClicks.map((ad) => {
                    const percentage = totalAdClicks > 0 ? (ad.clicks / totalAdClicks) * 100 : 0;
                    return (
                      <div key={ad.ad_name} className="flex items-center gap-4">
                        <div className="w-40 md:w-56 font-medium text-foreground text-sm truncate">
                          {ad.ad_name}
                        </div>
                        <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                          <div
                            className="bg-primary h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="w-20 text-right">
                          <span className="font-semibold text-foreground text-sm">{ad.clicks.toLocaleString()}</span>
                          <span className="text-muted-foreground text-xs ml-1">({percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
          {/* Social Share Metadata Sync */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="font-serif text-lg flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                Social Media Link Previews
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                Sync article metadata so shared links display proper titles, descriptions, and images on social media.
                {lastSyncCount !== null && ` Last sync: ${lastSyncCount} articles.`}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={syncArticleMetadata} disabled={syncing} size="sm">
                <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync Article Metadata"}
              </Button>
              <p className="text-xs text-muted-foreground">
                After syncing, share articles using this URL format for proper previews:<br />
                <code className="bg-muted px-2 py-1 rounded text-xs mt-1 inline-block">
                  {`https://${import.meta.env.VITE_SUPABASE_PROJECT_ID || "ctqbadyfhcoxhywrkorf"}.supabase.co/functions/v1/sharepreview/ARTICLE-SLUG`}
                </code>
              </p>
            </CardContent>
          </Card>
          {/* Articles Table */}
          <Card>
            <CardHeader>
              <CardTitle className="font-serif text-lg">Article Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground">
                        <button onClick={() => toggleSort("title")} className="inline-flex items-center gap-1 hover:text-foreground">
                          Article <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden md:table-cell">Category</th>
                      <th className="text-left py-3 px-2 font-medium text-muted-foreground hidden sm:table-cell">
                        <button onClick={() => toggleSort("date")} className="inline-flex items-center gap-1 hover:text-foreground">
                          Published <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                      <th className="text-right py-3 px-2 font-medium text-muted-foreground">
                        <button onClick={() => toggleSort("views")} className="inline-flex items-center gap-1 hover:text-foreground ml-auto">
                          Views <ArrowUpDown className="w-3 h-3" />
                        </button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedStats.map((stat) => (
                      <tr key={stat.slug} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-2">
                          <a
                            href={`/articles/${stat.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-foreground hover:text-primary transition-colors font-medium line-clamp-1"
                          >
                            {stat.title}
                          </a>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground hidden md:table-cell">
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                            {stat.category}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground text-xs hidden sm:table-cell">{stat.date}</td>
                        <td className="py-3 px-2 text-right">
                          <span className={`font-semibold ${stat.views > 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {stat.views.toLocaleString()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          </>}
        </main>
      </div>
    </>
  );
};

export default AdminAnalytics;
