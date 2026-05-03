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
import { ArrowRight, BadgeDollarSign, CheckCircle2, HeartHandshake, Route, ShieldAlert } from "lucide-react";
import { blogPostsMeta } from "@/data/blogPostMeta";
import SEOHead from "@/components/seo/SEOHead";
import { trackGAConversion } from "@/lib/gaConversions";
import { withOwnedUtm } from "@/lib/ownedLinks";
import mattHeadshot from "@/assets/matt-brown-headshot.jpeg";
import freedomLogo from "@/assets/freedom-interventions-logo.jpg";
import soberHelplineLogo from "@/assets/sober-helpline-logo.png";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import partyWreckersLogo from "@/assets/party-wreckers-logo.jpg";

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
    icon: ShieldAlert,
    accent: "bg-red-50 border-red-200 text-red-950",
  },
  {
    title: "Family addiction coaching",
    description: "Best when boundaries, relapse, money, housing, or family alignment keep breaking down.",
    href: "/family-addiction-coaching",
    icon: HeartHandshake,
    accent: "bg-amber-50 border-amber-200 text-amber-950",
  },
  {
    title: "Family situation assessment",
    description: "Best when you do not know whether this is support, coaching, intervention, safety, or aftercare.",
    href: "/family-situation-assessment",
    icon: Route,
    accent: "bg-emerald-50 border-emerald-200 text-emerald-950",
  },
  {
    title: "Advertise here",
    description: "Best for recovery-aligned brands that want an ethical, family-focused audience.",
    href: "/advertise/media-kit",
    icon: BadgeDollarSign,
    accent: "bg-sky-50 border-sky-200 text-sky-950",
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

const ecosystemProof = [
  { name: "Freedom Interventions", image: freedomLogo, detail: "Structured intervention guidance" },
  { name: "Sober Helpline", image: soberHelplineLogo, detail: "Family support and live help" },
  { name: "Family Bridge", image: familyBridgeLogo, detail: "Recovery support technology" },
  { name: "Party Wreckers", image: partyWreckersLogo, detail: "Podcast education and reach" },
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
  const soberHelplineHref = withOwnedUtm("https://soberhelpline.com/from-no-more-enabling", {
    medium: "homepage_cta",
    campaign: "soberhelpline_bridge",
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

          <section className="container mx-auto px-4 pt-8 pb-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Decision engine</p>
                  <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
                    One site. Four clean doorways.
                  </h2>
                  <p className="mt-4 text-base md:text-lg text-muted-foreground">
                    If you have been trying to help and somehow things keep getting worse, start by choosing the doorway that matches the pressure in your home right now.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-3xl font-bold text-foreground">143</p>
                    <p className="text-sm text-muted-foreground">Search-focused family education articles</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-3xl font-bold text-foreground">20+</p>
                    <p className="text-sm text-muted-foreground">Years of intervention and family support work</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mt-6">
                {quickStartLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`group rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-hover ${link.accent}`}
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/70">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif text-xl font-bold mt-4">{link.title}</h3>
                      <p className="mt-2 text-sm opacity-80">{link.description}</p>
                      <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                        Open path
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </p>
                    </Link>
                  );
                })}
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
              <div className="rounded-3xl border border-border bg-card p-6 md:p-8 overflow-hidden relative">
                <div className="absolute right-0 top-0 h-full w-1 bg-primary" aria-hidden="true" />
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Why trust this guidance</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Built by a working interventionist, not a content mill</h2>
                <div className="mt-5 grid gap-5 md:grid-cols-[120px_1fr] md:items-center">
                  <img src={mattHeadshot} alt="Matt Brown" className="h-28 w-28 rounded-2xl object-cover shadow-card" />
                  <p className="text-muted-foreground">
                    Matt Brown has spent more than 20 years helping families through addiction, treatment resistance, relapse, and the fallout that wears people down at home.
                    The goal here is not more panic, more guilt, or more theory. It is clearer pattern recognition and steadier next steps.
                  </p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["20+ years in the work", "Grounded in real family systems, not generic wellness advice."],
                    ["Direct but calm", "Clear enough to act on when your family is under stress."],
                    ["Action over scrolling", "Articles, tools, and support paths meant to move families forward."],
                  ].map(([title, copy]) => (
                    <div key={title} className="rounded-2xl bg-secondary/40 p-4">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <p className="font-medium text-foreground mt-3">{title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{copy}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-4">
                  {ecosystemProof.map((item) => (
                    <div key={item.name} className="rounded-2xl border border-border bg-background p-3">
                      <div className="h-14 flex items-center">
                        <img src={item.image} alt={item.name} className="max-h-12 max-w-full rounded object-contain" />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
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
                    <p className="font-medium text-foreground">Sober Helpline bridge and Family Squares</p>
                    <p className="text-sm text-muted-foreground mt-1">A guided handoff into free Monday support, private consultation, or intervention readiness.</p>
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

          <section className="container mx-auto px-4 py-4 md:py-8">
            <div className="max-w-6xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-center">
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">For ethical sponsors</p>
                  <h2 className="font-serif text-3xl font-bold text-foreground mt-2">A premium family addiction audience is taking shape here</h2>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    No More Enabling now tracks sponsor impressions, clicks, lead source pages, advertiser inquiries, and weekly reporting so recovery-aligned brands can buy visibility with cleaner proof.
                  </p>
                  <div className="mt-5 flex flex-col sm:flex-row gap-3">
                    <Button asChild>
                      <Link to="/advertise/media-kit">
                        View media kit
                        <BadgeDollarSign className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/advertise">Sponsor overview</Link>
                    </Button>
                  </div>
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
