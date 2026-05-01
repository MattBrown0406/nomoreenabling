import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpDown,
  BarChart3,
  ClipboardList,
  Eye,
  FileText,
  LogOut,
  Mail,
  MousePointerClick,
  RefreshCw,
  Route,
  Share2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import { getSupportOffer } from "@/data/supportOffers";

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
  article_slug: string | null;
  assessment_result: string | null;
  offer_slug: string | null;
  target_href: string | null;
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

interface FunnelBreakdownStat {
  key: string;
  label: string;
  count: number;
}

type SortField = "views" | "title" | "date";
type SortDir = "asc" | "desc";
type TimeRange = "7d" | "30d" | "90d" | "all";

const resultLabels: Record<string, string> = {
  safety: "Safety",
  intervention: "Intervention",
  boundaries: "Boundaries",
  "after-treatment": "After Treatment",
  support: "Support",
};

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

const AdminAnalytics = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
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
  const [assessmentLeadCount, setAssessmentLeadCount] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncCount, setLastSyncCount] = useState<number | null>(null);

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
    const [subResult, enrollResult, assessmentResult] = await Promise.all([
      supabase.from('subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('course_enrollments').select('id', { count: 'exact', head: true }),
      supabase.from('assessment_leads').select('id', { count: 'exact', head: true }),
    ]);
    setSubscriberCount(subResult.count ?? 0);
    setEnrollmentCount(enrollResult.count ?? 0);
    setAssessmentLeadCount(assessmentResult.count ?? 0);
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
      .select('event_name, created_at, page_path, article_slug, assessment_result, offer_slug, target_href');

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
  const eventCount = (eventName: string) => funnelEvents.filter((event) => event.event_name === eventName).length;
  const assessmentStarts = eventCount("assessment_started");
  const assessmentCompletions = eventCount("assessment_completed");
  const emailCaptures = eventCount("email_capture_success");
  const stickyCtaClicks = eventCount("sticky_cta_click");
  const bridgeClicks = eventCount("bridge_page_click");
  const outboundOfferClicks = eventCount("outbound_offer_click");
  const completionRate = assessmentStarts > 0 ? Math.round((assessmentCompletions / assessmentStarts) * 100) : 0;
  const captureRate = assessmentCompletions > 0 ? Math.round((emailCaptures / assessmentCompletions) * 100) : 0;

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
                  <p className="text-muted-foreground text-sm">{stickyCtaClicks.toLocaleString()} sticky CTA clicks</p>
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
          <div className="grid grid-cols-2 gap-4 mb-8">
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
        </main>
      </div>
    </>
  );
};

export default AdminAnalytics;
