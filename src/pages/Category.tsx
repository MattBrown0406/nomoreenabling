import { useParams, Link } from "react-router-dom";
import { useMemo, useEffect } from "react";
import { blogPostsMeta } from "@/data/blogPostMeta";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BlogCard from "@/components/blog/BlogCard";
import Sidebar from "@/components/home/Sidebar";
import { ArrowLeft } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const categoryName = useMemo(() => {
    if (!slug) return "";
    return slug
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [slug]);

  const filteredPosts = useMemo(() => {
    if (!slug) return [];
    return blogPostsMeta.filter(post => 
      post.categories.some(cat => 
        cat.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
      )
    );
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={filteredPosts.length > 0 ? `${categoryName} Articles` : "Category Not Found"}
        description={filteredPosts.length > 0 
          ? `Browse all articles about ${categoryName.toLowerCase()}. Find insights, strategies, and support for families dealing with addiction and codependency.`
          : "This category doesn't exist or has no articles yet."
        }
        canonicalUrl={`https://nomoreenabling.com/category/${slug}`}
        keywords={filteredPosts.length > 0 ? `${categoryName.toLowerCase()}, addiction articles, family support, codependency resources` : undefined}
        noindex={filteredPosts.length === 0}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Articles", url: "https://nomoreenabling.com/articles" },
          { name: categoryName || "Category", url: `https://nomoreenabling.com/category/${slug}` },
        ]}
      />
      {filteredPosts.length > 0 && (
        <ItemListJsonLd
          name={`${categoryName} Articles on No More Enabling`}
          description={`A curated collection of No More Enabling articles about ${categoryName.toLowerCase()} for families affected by addiction.`}
          items={filteredPosts.slice(0, 25).map((post) => ({
            name: post.title,
            description: post.excerpt,
            url: `https://nomoreenabling.com/articles/${post.slug}`,
          }))}
        />
      )}
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <Link 
          to="/articles" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to All Articles
        </Link>

        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {categoryName}
          </h1>
          <p className="text-muted-foreground text-lg">
            {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"} in this category
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {filteredPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    readTime={post.readTime}
                    date={post.date}
                    image={post.image}
                    slug={post.slug}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-card rounded-xl">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                  Category Not Found
                </h2>
                <p className="text-muted-foreground mb-6">
                  This category doesn't exist or has no articles yet.
                </p>
                <Link 
                  to="/articles" 
                  className="text-primary hover:underline"
                >
                  Browse all articles
                </Link>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Category;
