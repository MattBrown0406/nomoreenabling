import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import AdSpace from "@/components/ads/AdSpace";
import { Check, Mail } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const Advertise = () => {
  const adPlacements = [
    {
      name: "Leaderboard Banner",
      size: "728×90",
      location: "Homepage, below hero section",
      visibility: "High - Above the fold",
      priceMonthly: "$500/month",
      priceQuarterly: "$1,000/quarter",
    },
    {
      name: "Sidebar Ad",
      size: "300×250",
      location: "Article pages & homepage sidebar",
      visibility: "High - Persistent on scroll",
      priceMonthly: "$400/month",
      priceQuarterly: "$800/quarter",
    },
    {
      name: "Inline Content Ad",
      size: "728×90",
      location: "Within article content",
      visibility: "Medium - Contextual placement",
      priceMonthly: "$250/month",
      priceQuarterly: "$500/quarter",
    },
  ];

  const benefits = [
    "Reach families actively researching addiction, enabling, boundaries, treatment, and recovery support",
    "Show up beside practical education instead of broad, low-intent wellness content",
    "Align with an ethics-first publication built by a working interventionist",
    "Use flexible placements across article pages, topic hubs, and the homepage",
    "Choose monthly or quarterly campaigns with simple flat-rate pricing",
    "Receive direct placement support from the No More Enabling team",
  ];

  const audienceSegments = [
    {
      title: "Families in active confusion",
      description: "Parents, spouses, siblings, and adult children trying to understand whether support has become enabling.",
    },
    {
      title: "Treatment and intervention researchers",
      description: "Readers comparing next steps when conversations, promises, and informal boundaries have stopped working.",
    },
    {
      title: "Recovery support decision-makers",
      description: "Families looking for aftercare, sober living, family coaching, accountability tools, and long-term support.",
    },
  ];

  const sponsorshipPackages = [
    {
      name: "Topic Hub Sponsor",
      fit: "Best for providers who want category-level visibility around enabling, boundaries, intervention, or recovery.",
      includes: "Hub placement, sidebar visibility, and one contextual article placement.",
    },
    {
      name: "Provider Spotlight",
      fit: "Best for ethical treatment, coaching, family support, or recovery technology providers.",
      includes: "Profile-style placement, homepage or article sidebar visibility, and newsletter-ready copy.",
    },
    {
      name: "Network Bundle",
      fit: "Best for sponsors who want reach across No More Enabling, Freedom Interventions, Family Bridge, and Party Wreckers.",
      includes: "Custom package across articles, podcast mentions, newsletter, and family support resources.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="Advertise on No More Enabling — Reach Families & Providers"
        description="Reach families and treatment providers through ethical advertising on NoMoreEnabling.com. High-intent audience actively seeking addiction and recovery resources."
        canonicalUrl="https://nomoreenabling.com/advertise"
        keywords="addiction recovery advertising, treatment provider advertising, family addiction audience, ethical recovery marketing, mental health advertising"
      />
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                Advertise to Families Looking for Real Addiction Support
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                No More Enabling reaches readers who are not casually browsing. They are trying to understand enabling,
                boundaries, treatment resistance, relapse, and what to do next for someone they love.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Audience intent</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">
                  This is not broad wellness traffic
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Readers arrive with specific family addiction questions. That makes sponsorship here more about trust,
                  timing, and fit than raw impressions alone.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {audienceSegments.map((segment) => (
                  <div key={segment.title} className="rounded-xl border border-border bg-card p-6">
                    <h3 className="font-serif text-xl font-bold text-foreground">{segment.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{segment.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Sponsorship packages</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">
                  Built for ethical recovery brands
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Sponsorships are reviewed for fit. No More Enabling sells visibility and education-aligned placement,
                  not treatment referrals, clinical endorsement, or pay-for-placement recommendations.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {sponsorshipPackages.map((packageOption) => (
                  <div key={packageOption.name} className="rounded-xl border border-border bg-card p-6 shadow-card">
                    <h3 className="font-serif text-xl font-bold text-foreground">{packageOption.name}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{packageOption.fit}</p>
                    <div className="mt-5 rounded-lg bg-primary/10 p-4">
                      <p className="text-sm font-medium text-primary">Includes</p>
                      <p className="mt-1 text-sm text-muted-foreground">{packageOption.includes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placements */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
              Available Ad Placements
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {adPlacements.map((placement) => (
                <div key={placement.name} className="bg-card rounded-xl p-6 shadow-card">
                  <div className="mb-4">
                    <AdSpace size="sidebar" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-2">
                    {placement.name}
                  </h3>
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-lg font-bold text-primary">{placement.priceMonthly}</p>
                    <p className="text-sm text-muted-foreground">or {placement.priceQuarterly} <span className="text-primary font-medium">(Save!)</span></p>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li><strong>Size:</strong> {placement.size}</li>
                    <li><strong>Location:</strong> {placement.location}</li>
                    <li><strong>Visibility:</strong> {placement.visibility}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
                Why Advertise Here?
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                      <Check size={14} className="text-primary" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Request the Current Media Kit
              </h2>
              <p className="text-muted-foreground mb-8">
                Ask for current traffic, placement availability, sponsorship guidelines, and package options.
                We only accept advertisers that fit the site’s family-support mission.
              </p>
              <div className="flex justify-center">
                <a href="mailto:matt@nomoreenabling.com">
                  <Button variant="hero" size="lg">
                    <Mail size={18} />
                    matt@nomoreenabling.com
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Advertise;
