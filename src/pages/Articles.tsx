import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import { Input } from "@/components/ui/input";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { Search, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";

const categories = [
  "All",
  "Addiction",
  "Adult Child Addiction",
  "Financial Enabling",
  "Treatment Resistance",
  "After Treatment",
  "Spouse or Partner Addiction",
  "Intervention",
  "Alcoholic Family Member",
  "Crisis and Safety",
  "Enabling",
  "Boundaries",
  "Codependency",
  "Family Dynamics",
  "Recovery",
  "Mental Health",
  "Relationships",
  "Self-Worth",
  "Personal Growth",
];

const sortByDate = (posts: typeof blogPostsMeta) => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

const Articles = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const sortedPosts = useMemo(() => sortByDate(blogPostsMeta), []);
  const newestPost = sortedPosts[0];

  const filteredPosts = useMemo(() => {
    return sortedPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categories.some((category) => category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === "All" || post.categories.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, sortedPosts]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Family Addiction Articles and Guides"
        description="Browse practical articles on enabling, addiction, family boundaries, codependency, and recovery. Built for families who need clarity, traction, and steadier next steps."
        canonicalUrl="https://nomoreenabling.com/articles"
        keywords="family addiction articles, enabling articles, codependency resources, family boundaries addiction, recovery guidance for families"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Articles", url: "https://nomoreenabling.com/articles" },
        ]}
      />
      <ItemListJsonLd
        name="No More Enabling Family Addiction Article Library"
        description="Practical articles on enabling, boundaries, codependency, addiction, treatment, and family recovery."
        items={sortedPosts.slice(0, 25).map((post) => ({
          name: post.title,
          description: post.excerpt,
          url: `https://nomoreenabling.com/articles/${post.slug}`,
        }))}
      />
      <Header />

      <main className="flex-grow" role="main">
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${newestPost.image})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                Latest article
              </span>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                Family addiction articles that stay practical
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                These pieces are written for families trying to think clearly under pressure. Start with the latest article,
                browse by topic, or search for the pattern you keep running into at home.
              </p>
              <div className="mt-6 rounded-xl bg-background/80 backdrop-blur p-5 max-w-2xl">
                <p className="text-sm uppercase tracking-wide text-primary font-medium mb-2">Recommended first read</p>
                <h2 className="text-2xl font-semibold text-foreground">{newestPost.title}</h2>
                <p className="mt-3 text-muted-foreground line-clamp-3">{newestPost.excerpt}</p>
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
                  Read article
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">Find the right starting point</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Search by issue, then narrow by topic. The goal is not to read everything. It is to find the next useful thing.
                </p>
              </div>
              <div className="relative w-full lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  type="text"
                  placeholder="Search articles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-start mt-6">
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
        </section>

        <div className="container mx-auto px-4 py-6">
          <FamilyBridgeBanner size="leaderboard" />
        </div>

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
                <p className="text-xl text-muted-foreground">No articles found matching your criteria.</p>
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
      </main>

      <Footer />
    </div>
  );
};

export default Articles;
