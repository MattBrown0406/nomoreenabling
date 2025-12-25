import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import SelfAssessment from "@/components/home/SelfAssessment";
import AddictionAssessment from "@/components/home/AddictionAssessment";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import Sidebar from "@/components/home/Sidebar";
import AdSpace from "@/components/ads/AdSpace";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";

const categories = [
  "All",
  "Enabling",
  "Boundaries",
  "Codependency",
  "Family Dynamics",
  "Recovery",
];

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const sortedPosts = useMemo(() => sortByDate(blogPosts), []);
  
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") {
      return sortedPosts;
    }
    return sortedPosts.filter(post => 
      post.categories.some(cat => 
        cat.toLowerCase() === selectedCategory.toLowerCase()
      )
    );
  }, [sortedPosts, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1);

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

          {/* Addiction Assessment */}
          <AddictionAssessment />

          {/* Banner Ad */}
          <div className="container mx-auto px-4 py-6">
            <AdSpace size="leaderboard" />
          </div>

          {/* Main Content with Sidebar */}
          <section className="container mx-auto px-4 py-12">
            {/* Category Filter Buttons */}
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                Browse by Category
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-12">
                {/* Featured Post */}
                {featuredPost ? (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      {selectedCategory === "All" ? "Featured Article" : `Featured ${selectedCategory} Article`}
                    </h2>
                    <BlogCard {...featuredPost} featured />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No articles found in this category.</p>
                )}

                {/* Inline Ad */}
                <AdSpace size="inline" />

                {/* Recent Posts Grid */}
                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                    {selectedCategory === "All" ? "Recent Articles" : `${selectedCategory} Articles`}
                  </h2>
                  {recentPosts.length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {recentPosts.map((post) => (
                        <BlogCard key={post.id} {...post} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No additional articles in this category.</p>
                  )}
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
