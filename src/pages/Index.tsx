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
import AdSpace from "@/components/ads/AdSpace";
import CoachingInterventionCTA from "@/components/CoachingInterventionCTA";
import { Button } from "@/components/ui/button";
import { blogPostsMeta } from "@/data/blogPostMeta";
import SEOHead from "@/components/seo/SEOHead";
import { trackGAConversion } from "@/lib/gaConversions";
import { withOwnedUtm } from "@/lib/ownedLinks";

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
    title: "Intervention help",
    description: "Best when treatment is refused, consequences are escalating, or your family needs a structured plan.",
    href: "/intervention-help",
  },
  {
    title: "Family addiction coaching",
    description: "Best when boundaries, relapse, money, housing, or family alignment keep breaking down.",
    href: "/family-addiction-coaching",
  },
  {
    title: "Family situation assessment",
    description: "Best when you do not know whether this is support, coaching, intervention, safety, or aftercare.",
    href: "/family-situation-assessment",
  },
];

const guidedPaths = [
  {
    title: "If they refuse treatment",
    description: "Stop repeating the same argument and build a family plan that does not depend on another promise.",
    href: "/what-to-do-when-they-refuse-treatment",
    cta: "Build a refusal plan",
  },
  {
    title: "If alcohol is being minimized",
    description: "Use the alcohol-specific path when drinking is hidden behind functioning, denial, or broken promises.",
    href: "/alcohol-intervention-help",
    cta: "Open alcohol help",
  },
  {
    title: "If your adult child is stuck",
    description: "Sort money, housing, treatment refusal, and intervention questions from the parent lane.",
    href: "/addiction-intervention-for-adult-child",
    cta: "Open parent guidance",
  },
  {
    title: "If you just need the right doorway",
    description: "Use one private consultation path to decide between coaching, intervention, Family Squares, or self-guided support.",
    href: "/family-addiction-consultation",
    cta: "Request direction",
  },
];

const sortByDate = (posts: typeof blogPostsMeta) => {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
};

const Index = () => {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const sortedPosts = useMemo(() => sortByDate(blogPostsMeta), []);

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
  const soberHelplineHref = withOwnedUtm("https://soberhelpline.com", {
    medium: "homepage_cta",
    campaign: "family_squares",
    content: "support_lane",
  });
  const freedomInterventionsHref = withOwnedUtm("https://freedominterventions.com", {
    medium: "homepage_cta",
    campaign: "intervention_consult",
    content: "support_lane",
  });

  useEffect(() => {
    if (location.state?.scrollToNewsletter || location.hash === "#newsletter") {
      setTimeout(() => {
        const element = document.getElementById("newsletter");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.hash, location.state]);

  return (
    <>
      <SEOHead
        title="Support Families Affected by Addiction | No More Enabling"
        description="Practical guidance for families dealing with addiction, enabling, and boundary breakdowns. Get clear articles, tools, and next steps that hold up under stress."
        canonicalUrl="https://nomoreenabling.com/"
        keywords="family addiction support, enabling addiction, boundaries with addiction, help vs enabling, codependency family recovery"
      />

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
                If you have been trying to help and somehow things keep getting worse, use this site to route the situation.
                The goal is to help you decide whether your family needs education, boundaries, live support, coaching,
                or higher-level intervention guidance.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="rounded-full bg-secondary px-3 py-1">20+ years intervention experience</span>
                <span className="rounded-full bg-secondary px-3 py-1">Direct, practical family guidance</span>
                <span className="rounded-full bg-secondary px-3 py-1">Less panic. Better decisions.</span>
              </div>
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

          <section className="container mx-auto px-4 py-4 md:py-8">
            <div className="max-w-6xl mx-auto">
              <div className="mb-6">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">Choose your starting path</h2>
                <p className="mt-2 text-muted-foreground max-w-3xl">
                  Don’t start with everything. Start with the pressure point that is hurting your family most right now.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {guidedPaths.map((path) => (
                  <Link
                    key={path.href}
                    to={path.href}
                    className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-secondary/20"
                  >
                    <h3 className="font-semibold text-foreground">{path.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{path.description}</p>
                    <p className="mt-4 text-sm font-medium text-primary">{path.cta} →</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="container mx-auto px-4 py-6 md:py-10">
            <div className="max-w-6xl mx-auto grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Why trust this guidance</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Built by a working interventionist, not a content mill</h2>
                <p className="mt-4 text-muted-foreground max-w-3xl">
                  Matt Brown has spent more than 20 years helping families through addiction, treatment resistance, relapse, and the fallout that wears people down at home.
                  The goal here is not more panic, more guilt, or more theory. It is clearer pattern recognition and steadier next steps.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">20+ years in the work</p>
                    <p className="text-sm text-muted-foreground mt-1">Grounded in real family systems, not generic wellness advice.</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">Direct but calm</p>
                    <p className="text-sm text-muted-foreground mt-1">Clear enough to act on when your family is under stress.</p>
                  </div>
                  <div className="rounded-2xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">Action over doom-scrolling</p>
                    <p className="text-sm text-muted-foreground mt-1">Articles, tools, and courses meant to move families forward.</p>
                  </div>
                </div>
                <Button variant="outline" className="mt-6" asChild>
                  <Link to="/about">Read Matt’s background</Link>
                </Button>
              </div>

              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Need more than articles?</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Pick the support lane that fits</h2>
                <div className="mt-5 space-y-3">
                  <a
                    href={soberHelplineHref}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                    onClick={() => trackGAConversion("family_squares_click", { source: "homepage_support_lane" })}
                  >
                  <p className="font-medium text-foreground">Sober Helpline and Family Squares</p>
                    <p className="text-sm text-muted-foreground mt-1">Free family support Zoom every Monday night plus practical support for families who need live help.</p>
                  </a>
                  <a
                    href={freedomInterventionsHref}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                    onClick={() => trackGAConversion("owned_offer_click", { source: "homepage_support_lane", owned_brand: "freedom-interventions" })}
                  >
                  <p className="font-medium text-foreground">Freedom Interventions</p>
                  <p className="text-sm text-muted-foreground mt-1">When the situation is escalating and your family may need professional intervention guidance.</p>
                </a>
                  <Link to="/family-addiction-consultation" className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                    <p className="font-medium text-foreground">Private family consultation</p>
                    <p className="text-sm text-muted-foreground mt-1">Best if you need help choosing between coaching, support, treatment planning, or intervention.</p>
                  </Link>
                  <Link to="/advertise" className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                    <p className="font-medium text-foreground">Advertise to this audience</p>
                    <p className="text-sm text-muted-foreground mt-1">For ethical recovery, prevention, treatment-adjacent, and family-support sponsors.</p>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <CoachingInterventionCTA />

          <SelfAssessment />
          <AddictionAssessment />
          <GuidedMeditation />

          <div className="container mx-auto px-4 py-6">
            <AdSpace size="leaderboard" placementKey="article_bottom_leaderboard" />
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
