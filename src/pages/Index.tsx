import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CrisisResourcesBanner from "@/components/home/CrisisResourcesBanner";
import HeroSection from "@/components/home/HeroSection";
import SelfAssessment from "@/components/home/SelfAssessment";
import AddictionAssessment from "@/components/home/AddictionAssessment";
import GuidedMeditation from "@/components/home/GuidedMeditation";
import NewsletterSection from "@/components/home/NewsletterSection";
import BlogCard from "@/components/blog/BlogCard";
import Sidebar from "@/components/home/Sidebar";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import { Button } from "@/components/ui/button";
import { blogPosts } from "@/data/blogPosts";
import SEOHead from "@/components/seo/SEOHead";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";

const categories = [
  "All",
  "Enabling",
  "Boundaries",
  "Codependency",
  "Family Dynamics",
  "Recovery",
];

const quickStartLinks = [
  {
    title: "Learn the difference between helping and enabling",
    description: "A practical starting point when everything feels blurry.",
    href: "/helping-or-enabling",
  },
  {
    title: "Read the latest family addiction articles",
    description: "Short, direct guidance for families carrying too much.",
    href: "/articles",
  },
  {
    title: "Understand who is behind this site",
    description: "See the experience, standards, and point of view shaping the content.",
    href: "/about",
  },
];

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
    return sortedPosts.filter((post) =>
      post.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase())
    );
  }, [sortedPosts, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const recentPosts = filteredPosts.slice(1, 7);

  useEffect(() => {
    if (location.state?.scrollToNewsletter) {
      setTimeout(() => {
        const element = document.getElementById("newsletter");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);

  return (
    <>
      <SEOHead
        title="Support Families Affected by Addiction | No More Enabling"
        description="Practical guidance for families dealing with addiction, enabling, and boundary breakdowns. Get clear articles, tools, and next steps that hold up under stress."
        canonicalUrl="https://nomoreenabling.com/"
        keywords="family addiction support, enabling addiction, boundaries with addiction, help vs enabling, codependency family recovery"
      />
      <OrganizationJsonLd />

      <div className="min-h-screen flex flex-col">
        <Header />
        <CrisisResourcesBanner />

        <main className="flex-grow" role="main">
          <HeroSection />

          <section className="container mx-auto px-4 pt-4 pb-10">
            <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
                Clearer support for families living with addiction
              </h2>
              <p className="mt-4 text-base md:text-lg text-muted-foreground">
                If you have been trying to help and somehow things keep getting worse, you are not crazy and you are not alone.
                No More Enabling is built for families who need a clearer read on what is happening, what needs to change,
                and what steady support actually looks like.
              </p>
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                {quickStartLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-primary/50 hover:bg-secondary/40"
                  >
                    <h3 className="font-semibold text-foreground">{link.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <SelfAssessment />
          <AddictionAssessment />
          <GuidedMeditation />

          <div className="container mx-auto px-4 py-6">
            <FamilyBridgeBanner size="leaderboard" />
          </div>

          <section className="container mx-auto px-4 py-12">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Browse by topic</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Start with the pressure point that shows up most in your family right now, then keep following the pattern.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link to="/articles">See all articles</Link>
              </Button>
            </div>

            <div className="flex flex-wrap gap-3 mb-10">
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

            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-12">
                {featuredPost ? (
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                      {selectedCategory === "All" ? "Start here" : `${selectedCategory} article to read first`}
                    </h2>
                    <BlogCard {...featuredPost} featured />
                  </div>
                ) : (
                  <p className="text-muted-foreground">No articles found in this category.</p>
                )}

                <div>
                  <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                    {selectedCategory === "All" ? "Recent articles" : `More on ${selectedCategory.toLowerCase()}`}
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Practical reads for families working toward steadier decisions, not perfect ones.
                  </p>
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

              <aside className="lg:col-span-1" aria-label="Related resources">
                <Sidebar />
              </aside>
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
