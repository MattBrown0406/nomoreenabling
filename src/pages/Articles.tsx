import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import AdSpace from "@/components/ads/AdSpace";
import { Input } from "@/components/ui/input";
import { blogPosts } from "@/data/blogPosts";
import { Search, ArrowRight } from "lucide-react";

const categories = ["All", "Boundaries", "Self-Worth", "Relationships", "Recovery", "Personal Growth", "Addiction"];

// Sort posts by date (newest first)
const sortByDate = (posts: typeof blogPosts) => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

const Articles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    document.title = "Articles - No More Enabling";
  }, []);

  const sortedPosts = useMemo(() => sortByDate(blogPosts), []);
  const newestPost = sortedPosts[0];

  const filteredPosts = useMemo(() => {
    return sortedPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, sortedPosts]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* Featured Article Hero */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${newestPost.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                Latest Article
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {newestPost.title}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground line-clamp-3">
                {newestPost.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                <span>{newestPost.category}</span>
                <span>•</span>
                <span>{newestPost.date}</span>
                <span>•</span>
                <span>{newestPost.readTime}</span>
              </div>
              <Link 
                to={`/articles/${newestPost.slug}`}
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Read Article
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Banner Ad */}
        <div className="container mx-auto px-4 py-6">
          <AdSpace size="leaderboard" />
        </div>

        {/* Articles Grid */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            {filteredPosts.length > 0 ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Showing {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                  {selectedCategory !== "All" && ` in ${selectedCategory}`}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <BlogCard key={post.id} {...post} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  No articles found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Bottom Ad */}
        <div className="container mx-auto px-4 py-6">
          <AdSpace size="leaderboard" />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Articles;
