import { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import Sidebar from "@/components/home/Sidebar";
import AdSpace from "@/components/ads/AdSpace";
import { blogPosts } from "@/data/blogPosts";

const Index = () => {
  const featuredPost = blogPosts[0];
  const recentPosts = blogPosts.slice(1);

  useEffect(() => {
    document.title = "No More Enabling - Break Free from Unhealthy Patterns";
  }, []);

  return (
    <>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <HeroSection />

          {/* Banner Ad */}
          <div className="container mx-auto px-4 py-6">
            <AdSpace size="leaderboard" />
          </div>

          {/* Main Content with Sidebar */}
          <section className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Featured Post */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Featured Article
                  </h2>
                  <BlogCard {...featuredPost} featured />
                </div>

                {/* Inline Ad */}
                <AdSpace size="inline" />

                {/* Recent Posts Grid */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    Recent Articles
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {recentPosts.map((post) => (
                      <BlogCard key={post.id} {...post} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Sidebar />
              </div>
            </div>
          </section>

          <NewsletterSection />
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
