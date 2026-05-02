import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import AdSpace from "@/components/ads/AdSpace";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Mail, ShieldCheck, X } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import {
  formatSponsorRate,
  sponsorPlacements,
  sponsorshipPackages,
  sponsorStandards,
} from "@/data/sponsorInventory";

const Advertise = () => {
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
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-xl font-bold text-foreground">{packageOption.name}</h3>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">{packageOption.price}</span>
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{packageOption.fit}</p>
                    <div className="mt-5 rounded-lg bg-primary/10 p-4">
                      <p className="text-sm font-medium text-primary">Includes</p>
                      <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                        {packageOption.includes.map((item) => (
                          <li key={item} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Sellable inventory</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">
                  Current Placement Menu
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Until a sponsor is approved, these placements remain house inventory for Freedom Interventions,
                  Family Bridge, and The Party Wreckers Podcast.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Placement</TableHead>
                      <TableHead className="hidden md:table-cell">Surface</TableHead>
                      <TableHead className="hidden lg:table-cell">Best Fit</TableHead>
                      <TableHead className="text-right">Monthly</TableHead>
                      <TableHead className="text-right hidden sm:table-cell">Quarterly</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sponsorPlacements.map((placement) => (
                      <TableRow key={placement.key}>
                        <TableCell>
                          <p className="font-medium text-foreground">{placement.name}</p>
                          <p className="text-xs text-muted-foreground">{placement.size}</p>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">{placement.surface}</TableCell>
                        <TableCell className="hidden lg:table-cell text-muted-foreground max-w-xs">{placement.buyerFit}</TableCell>
                        <TableCell className="text-right font-medium text-foreground">
                          {formatSponsorRate(placement.monthlyRate)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-foreground hidden sm:table-cell">
                          {formatSponsorRate(placement.quarterlyRate)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Example house placement</p>
                  <h2 className="font-serif text-3xl font-bold text-foreground mt-2">
                    Paid ads will be limited and clearly reviewed
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    The live site currently uses house placements for the No More Enabling ecosystem. Future paid
                    sponsors will be reviewed before launch and kept separate from editorial recommendations.
                  </p>
                  <div className="mt-8 grid md:grid-cols-2 gap-6">
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <ShieldCheck className="h-5 w-5" />
                        Accepted Sponsor Types
                      </div>
                      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {sponsorStandards.accepted.map((item) => (
                          <li key={item} className="flex gap-2">
                            <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-6">
                      <div className="flex items-center gap-2 text-destructive font-medium">
                        <X className="h-5 w-5" />
                        Not a Fit
                      </div>
                      <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                        {sponsorStandards.notAccepted.map((item) => (
                          <li key={item} className="flex gap-2">
                            <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <AdSpace size="sidebar" placementKey="article_sidebar" />
                  <div className="rounded-xl border border-border bg-secondary/40 p-4">
                    <p className="text-sm font-medium text-foreground">Sponsor review questions</p>
                    <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                      {sponsorStandards.reviewQuestions.map((question) => (
                        <li key={question}>{question}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
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
