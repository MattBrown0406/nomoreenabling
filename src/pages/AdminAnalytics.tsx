import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, LogOut, TrendingUp, Eye, FileText, Calendar, ArrowUpDown } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import { toast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";

interface ArticleStat {
  slug: string;
  title: string;
  views: number;
  category: string;
  date: string;
}

type SortField = "views" | "title" | "date";
type SortDir = "asc" | "desc";
type TimeRange = "7d" | "30d" | "90d" | "all";

const AdminAnalytics = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
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
    } else {
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchCounts = async () => {
    const [subResult, enrollResult] = await Promise.all([
      supabase.from('subscribers').select('id', { count: 'exact', head: true }),
      supabase.from('course_enrollments').select('id', { count: 'exact', head: true }),
    ]);
    setSubscriberCount(subResult.count ?? 0);
    setEnrollmentCount(enrollResult.count ?? 0);
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
    const articleStats: ArticleStat[] = blogPosts.map((post) => ({
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

  const sortedStats = [...stats].sort((a, b) => {
    const dir = sortDir === "desc" ? -1 : 1;
    if (sortField === "views") return (a.views - b.views) * dir;
    if (sortField === "title") return a.title.localeCompare(b.title) * dir;
    if (sortField === "date") return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    return 0;
  });

  const topArticle = stats.reduce((top, s) => (s.views > (top?.views || 0) ? s : top), stats[0]);
  const avgViews = stats.length > 0 ? Math.round(totalViews / stats.filter(s => s.views > 0).length) : 0;

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
              <h1 className="font-serif text-xl font-bold text-foreground">Article Analytics</h1>
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
