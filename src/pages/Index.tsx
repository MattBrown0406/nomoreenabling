import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SelfAssessment from "@/components/home/SelfAssessment";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import Sidebar from "@/components/home/Sidebar";
import AdSpace from "@/components/ads/AdSpace";
import { blogPosts } from "@/data/blogPosts";

// Sort posts by date (newest first)
const sortByDate = (posts: typeof blogPosts) => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

const Index = () => {
  const location = useLocation();
  const sortedPosts = useMemo(() => sortByDate(blogPosts), []);
  const featuredPost = sortedPosts[0];
  const recentPosts = sortedPosts.slice(1);

  useEffect(() => {
    document.title = "No More Enabling - Break Free from Unhealthy Patterns";
  }, []);

  useEffect(() => {
    if (location.state?.scrollToNewsletter) {
      setTimeout(() => {
        const element = document.getElementById('newsletter');
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.state]);

  return (
    <>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <HeroSection />

          {/* Self-Assessment */}
          <SelfAssessment />

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
