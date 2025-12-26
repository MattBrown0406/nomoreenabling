import { Link } from "react-router-dom";
import { useMemo, useEffect, useState } from "react";
import AdSpace from "@/components/ads/AdSpace";
import FreedomInterventionsBanner from "@/components/ads/FreedomInterventionsBanner";
import SoberHelplineBanner from "@/components/ads/SoberHelplineBanner";
import InterventionOnCallBanner from "@/components/ads/InterventionOnCallBanner";
import BrianOSheaBanner from "@/components/ads/BrianOSheaBanner";
import { blogPosts } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

interface PopularPost {
  title: string;
  slug: string;
}

const Sidebar = () => {
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);

  const categories = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    
    blogPosts.forEach(post => {
      post.categories.forEach(category => {
        categoryCount[category] = (categoryCount[category] || 0) + 1;
      });
    });

    return Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const newestPosts = useMemo(() => {
    return blogPosts
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(post => ({ title: post.title, slug: post.slug }));
  }, []);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      const { data, error } = await supabase
        .from("article_views")
        .select("article_slug")
        .order("viewed_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setPopularPosts(newestPosts);
        return;
      }

      // Count views per article
      const viewCounts: Record<string, number> = {};
      data.forEach(view => {
        viewCounts[view.article_slug] = (viewCounts[view.article_slug] || 0) + 1;
      });

      // Sort by view count and get top 3
      const sortedSlugs = Object.entries(viewCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([slug]) => slug);

      // Map to posts
      const topPosts = sortedSlugs
        .map(slug => blogPosts.find(post => post.slug === slug))
        .filter(Boolean)
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
      {/* Freedom Interventions Sponsor Banner */}
      <div>
        <FreedomInterventionsBanner size="sidebar" />
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

      {/* Sober Helpline Banner */}
      <div>
        <SoberHelplineBanner />
      </div>

      {/* Intervention On Call Banner */}
      <div>
        <InterventionOnCallBanner />
      </div>

      {/* Brian O'Shea Banner */}
      <div>
        <BrianOSheaBanner />
      </div>

      {/* Google Ad Space 1 */}
      <div>
        <AdSpace size="sidebar" />
      </div>

      {/* Google Ad Space 2 */}
      <div>
        <AdSpace size="sidebar" />
      </div>

      {/* Google Ad Space 3 */}
      <div>
        <AdSpace size="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
