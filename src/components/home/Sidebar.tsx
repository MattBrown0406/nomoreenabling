import { Link } from "react-router-dom";
import { useMemo } from "react";
import AdSpace from "@/components/ads/AdSpace";
import { blogPosts } from "@/data/blogPosts";

const Sidebar = () => {
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

  const popularPosts = useMemo(() => {
    return blogPosts
      .slice()
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(post => ({ title: post.title, slug: post.slug }));
  }, []);

  return (
    <aside className="space-y-8">
      {/* Ad Space */}
      <div>
        <AdSpace size="sidebar" />
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
          Recent Posts
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

      {/* Second Ad Space */}
      <div>
        <AdSpace size="sidebar" />
      </div>
    </aside>
  );
};

export default Sidebar;
