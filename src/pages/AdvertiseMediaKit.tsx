import { Link } from "react-router-dom";
import { BarChart3, CheckCircle2, Download, Mail, ShieldCheck, Target, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { topicHubs } from "@/data/topicHubs";
import { leadMagnets } from "@/data/leadMagnets";
import {
  formatSponsorRate,
  sponsorPlacements,
  sponsorshipPackages,
  sponsorStandards,
} from "@/data/sponsorInventory";

const AdvertiseMediaKit = () => {
  const articleCount = blogPostsMeta.length;
  const categoryCount = new Set(blogPostsMeta.flatMap((post) => post.categories)).size;
  const monthlyInventory = sponsorPlacements.reduce((total, placement) => total + placement.monthlyRate, 0);

  const audienceProof = [
    {
      label: "High-intent search audience",
      detail: "Readers arrive through specific family addiction questions, not broad lifestyle content.",
    },
    {
      label: "Topic-clustered inventory",
      detail: "Sponsors can align with adult-child addiction, financial enabling, treatment refusal, after-treatment, spouse/partner addiction, and boundaries.",
    },
    {
      label: "First-party funnel tracking",
      detail: "Placements now track impressions, clicks, page path, and article or cluster context inside the admin dashboard.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="No More Enabling Media Kit"
        description="Media kit for ethical recovery, treatment, family support, and addiction education sponsors interested in NoMoreEnabling.com."
        canonicalUrl="https://nomoreenabling.com/advertise/media-kit"
        keywords="No More Enabling media kit, addiction recovery advertising media kit, family addiction audience"
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-14 md:py-20">
            <div className="max-w-4xl">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Advertiser media kit</p>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mt-3">
                Reach families actively looking for addiction, intervention, recovery, and boundary support
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
                No More Enabling is an education and routing site for families affected by addiction. The audience is practical, urgent, and decision-oriented.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <a href="mailto:matt@nomoreenabling.com?subject=No%20More%20Enabling%20Media%20Kit%20Inquiry">
                    <Mail className="h-4 w-4" />
                    Request availability
                  </a>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link to="/advertise">
                    Sponsorship overview
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <BarChart3 className="h-5 w-5 text-primary" />
              <p className="mt-3 text-3xl font-bold text-foreground">{articleCount}</p>
              <p className="text-sm text-muted-foreground">Published articles</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <Target className="h-5 w-5 text-primary" />
              <p className="mt-3 text-3xl font-bold text-foreground">{topicHubs.length}</p>
              <p className="text-sm text-muted-foreground">SEO topic hubs</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <Users className="h-5 w-5 text-primary" />
              <p className="mt-3 text-3xl font-bold text-foreground">{categoryCount}</p>
              <p className="text-sm text-muted-foreground">Reader categories</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <p className="mt-3 text-3xl font-bold text-foreground">{formatSponsorRate(monthlyInventory)}</p>
              <p className="text-sm text-muted-foreground">Current monthly inventory</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 lg:grid-cols-3">
            {audienceProof.map((proof) => (
              <div key={proof.label} className="rounded-2xl border border-border bg-card p-6">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">{proof.label}</h2>
                <p className="mt-3 text-muted-foreground">{proof.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-secondary/30 border-y border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Intent segments</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Lead magnets show what readers are actively trying to solve</h2>
              <p className="mt-3 text-muted-foreground">
                These tools turn anonymous SEO traffic into segmented first-party interest signals while keeping Family Squares as the live support CTA.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {leadMagnets.map((magnet) => (
                <div key={magnet.slug} className="rounded-2xl border border-border bg-background p-5">
                  <Download className="h-5 w-5 text-primary" />
                  <h3 className="mt-3 font-semibold text-foreground">{magnet.shortTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{magnet.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-6">
                <h2 className="font-serif text-3xl font-bold text-foreground">Placement Menu</h2>
                <p className="mt-2 text-muted-foreground">Flat-rate monthly inventory with ethical review before launch.</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Placement</TableHead>
                    <TableHead className="hidden md:table-cell">Surface</TableHead>
                    <TableHead className="text-right">Monthly</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Quarterly</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sponsorPlacements.map((placement) => (
                    <TableRow key={placement.key}>
                      <TableCell>
                        <p className="font-medium text-foreground">{placement.name}</p>
                        <p className="text-xs text-muted-foreground">{placement.buyerFit}</p>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">{placement.surface}</TableCell>
                      <TableCell className="text-right font-medium">{formatSponsorRate(placement.monthlyRate)}</TableCell>
                      <TableCell className="text-right font-medium hidden sm:table-cell">{formatSponsorRate(placement.quarterlyRate)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Package Ladder</h2>
                <div className="mt-4 space-y-4">
                  {sponsorshipPackages.map((packageOption) => (
                    <div key={packageOption.name} className="rounded-xl bg-secondary/40 p-4">
                      <p className="font-medium text-foreground">{packageOption.name}</p>
                      <p className="text-sm text-primary mt-1">{packageOption.price}</p>
                      <p className="text-sm text-muted-foreground mt-2">{packageOption.fit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">Ethical Fit</h2>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {sponsorStandards.accepted.slice(0, 4).map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AdvertiseMediaKit;
