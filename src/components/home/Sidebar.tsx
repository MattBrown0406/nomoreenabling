import { Link } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import FreedomInterventionsBanner from "@/components/ads/FreedomInterventionsBanner";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import PartyWreckersBanner from "@/components/ads/PartyWreckersBanner";
import PersonalizedSuggestions from "@/components/suggestions/PersonalizedSuggestions";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { supabase } from "@/integrations/supabase/client";

interface PopularPost {
  title: string;
  slug: string;
}

interface ArticleViewCountRow {
  article_slug: string;
}

const fetchArticleViewCounts = supabase.rpc as unknown as (
  fn: "get_article_view_counts",
  args: { limit_count: number }
) => Promise<{ data: ArticleViewCountRow[] | null; error: unknown }>;

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);

  const categories = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    
    blogPostsMeta.forEach(post => {
      post.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const newestPosts = useMemo(() => {
    return blogPostsMeta
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(post => ({ title: post.title, slug: post.slug }));
  }, []);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      const { data, error } = await fetchArticleViewCounts("get_article_view_counts", { limit_count: 6 });

      if (error || !data || data.length === 0) {
        setPopularPosts(newestPosts);
        return;
      }

      const topPosts = data
        .map(({ article_slug }) => blogPostsMeta.find(post => post.slug === article_slug))
        .filter(Boolean)
        .slice(0, 3)
        .map(post => ({ title: post!.title, slug: post!.slug }));

      if (topPosts.length < 3) {
        // Fill with newest posts if not enough popular posts
        const remaining = newestPosts.filter(
          np => !topPosts.some(tp => tp.slug === np.slug)
        );
        setPopularPosts([...topPosts, ...remaining].slice(0, 3));
      } else {
        setPopularPosts(topPosts);
      }
    };

    fetchPopularPosts();
  }, [newestPosts]);

  return (
    <aside className="space-y-8">
      {/* Personalized Suggestions */}
      <PersonalizedSuggestions />

      {/* Freedom Interventions Sponsor Banner */}
      <div>
        <FreedomInterventionsBanner size="sidebar" />
      </div>

      <div className="bg-card rounded-xl p-6 shadow-card border border-border/60">
        <h3 className="font-serif text-xl font-bold text-foreground mb-2">
          Start Here
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          If you’re not sure what to read next, use the guided starting page or the topic hubs.
        </p>
        <div className="space-y-3">
          <Link to="/start-here" className="block rounded-lg border border-border px-4 py-3 hover:border-primary/40 transition-colors">
            <p className="font-medium text-foreground">Start Here</p>
            <p className="text-sm text-muted-foreground mt-1">A calm first path for families in chaos.</p>
          </Link>
          <Link to="/topic-hubs" className="block rounded-lg border border-border px-4 py-3 hover:border-primary/40 transition-colors">
            <p className="font-medium text-foreground">Guided Topic Hubs</p>
            <p className="text-sm text-muted-foreground mt-1">Browse enabling, boundaries, codependency, family dynamics, and recovery.</p>
          </Link>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-serif text-xl font-bold text-foreground mb-4">
          Categories
        </h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                to={`/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{category.name}</span>
                <span className="text-sm bg-secondary px-2 py-0.5 rounded-full">
                  {category.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Posts */}
      <div className="bg-card rounded-xl p-6 shadow-card">
        <h3 className="font-serif text-xl font-bold text-foreground mb-4">
          Popular Posts
        </h3>
        <ul className="space-y-4">
          {popularPosts.map((post, index) => (
            <li key={post.slug}>
              <Link
                to={`/articles/${post.slug}`}
                className="flex gap-3 group"
              >
                <span className="text-2xl font-serif font-bold text-primary/30 group-hover:text-primary transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
                  {post.title}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* FamilyBridge Sponsor Banner */}
      <div>
        <FamilyBridgeBanner size="sidebar" />
      </div>

      {/* Party Wreckers Sponsor Banner */}
      <div>
        <PartyWreckersBanner size="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
