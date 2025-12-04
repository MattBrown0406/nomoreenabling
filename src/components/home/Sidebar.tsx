import { Link } from "react-router-dom";
import AdSpace from "@/components/ads/AdSpace";

const categories = [
  { name: "Boundaries", count: 12 },
  { name: "Self-Worth", count: 8 },
  { name: "Relationships", count: 15 },
  { name: "Recovery", count: 10 },
  { name: "Personal Growth", count: 7 },
];

const popularPosts = [
  { title: "5 Signs You're Enabling Someone", slug: "signs-enabling" },
  { title: "How to Say No Without Guilt", slug: "say-no-without-guilt" },
  { title: "Setting Boundaries with Family", slug: "boundaries-with-family" },
];

const Sidebar = () => {
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
                to={`/category/${category.name.toLowerCase().replace(" ", "-")}`}
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
                to={`/article/${post.slug}`}
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
