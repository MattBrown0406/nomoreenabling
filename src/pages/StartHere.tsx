import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";
import { Button } from "@/components/ui/button";
import CoachingInterventionCTA from "@/components/CoachingInterventionCTA";
import { funnelPaths } from "@/data/funnelPaths";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardList, ExternalLink, LifeBuoy, MapPinned, ShieldAlert } from "lucide-react";

const principles = [
  {
    title: "Safety first",
    description: "If someone may be harmed, do not treat it as a normal family conflict.",
  },
  {
    title: "One path at a time",
    description: "Choose the pressure point that is costing the most peace right now.",
  },
  {
    title: "Support recovery",
    description: "The goal is to support truth, treatment, boundaries, and repair without rescuing the addiction.",
  },
];

const isExternalHref = (href: string) => href.startsWith("http");

const FunnelLink = ({ href, children, variant = "default" }: { href: string; children: ReactNode; variant?: "default" | "outline" }) => {
  const className = variant === "outline"
    ? "inline-flex items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors"
    : "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors";

  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={href} className={className}>
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

export default function StartHere() {
  const [selectedPathId, setSelectedPathId] = useState(funnelPaths[0].id);
  const selectedPath = funnelPaths.find((path) => path.id === selectedPathId) ?? funnelPaths[0];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Start Here — Family Addiction Help Without Enabling"
        description="A practical starting page for families dealing with addiction, enabling, chaos, and boundary breakdowns."
        canonicalUrl="https://nomoreenabling.com/start-here"
        keywords="family addiction help, start here addiction family, helping vs enabling, addiction boundaries"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Start Here", url: "https://nomoreenabling.com/start-here" },
        ]}
      />
      <ItemListJsonLd
        name="No More Enabling Start Here Decision Paths"
        description="Guided starting points for families facing addiction, enabling, treatment refusal, alcohol problems, crisis, and recovery decisions."
        items={funnelPaths.map((path) => ({
          name: path.label,
          description: path.prompt,
          url: `https://nomoreenabling.com${path.hubHref}`,
        }))}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                  <MapPinned className="h-4 w-4" />
                  Start Here
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-4xl">
                  Find the right next step for your family
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
                  No More Enabling now has a full education library. This page turns it into a decision path so you can move from the article you found to the support your situation actually needs.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button asChild size="lg">
                    <a href="#decision-paths">
                      Choose your path
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/family-situation-assessment">Take the family assessment</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-background p-6 shadow-sm">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold text-foreground">If someone is in immediate danger</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Call emergency services. For suicide or mental health crisis in the U.S., call or text 988. Use this site after immediate safety is addressed.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((principle) => (
              <div key={principle.title} className="rounded-2xl border border-border bg-card p-5">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h2 className="mt-3 font-serif text-xl font-bold text-foreground">{principle.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="decision-paths" className="container mx-auto px-4 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm uppercase tracking-wide text-primary font-medium">Decision routing</p>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mt-2">
              What is happening right now?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Pick the closest match. You do not have to diagnose the whole family system before taking the next useful step.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {funnelPaths.map((path) => (
                <button
                  key={path.id}
                  type="button"
                  onClick={() => setSelectedPathId(path.id)}
                  className={`text-left rounded-2xl border p-5 transition-colors ${
                    selectedPath.id === path.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-foreground">{path.label}</h3>
                    {path.urgency === "urgent" && <AlertTriangle className="h-4 w-4 text-primary" />}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{path.prompt}</p>
                </button>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 self-start rounded-2xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Recommended route</p>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-2">{selectedPath.hubLabel}</h2>
              <p className="mt-3 text-muted-foreground">{selectedPath.bestFor}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {selectedPath.signals.map((signal) => (
                  <span key={signal} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                    {signal}
                  </span>
                ))}
              </div>
              <div className="mt-6 grid gap-3">
                <FunnelLink href={selectedPath.primaryHref}>{selectedPath.primaryLabel}</FunnelLink>
                <FunnelLink href={selectedPath.secondaryHref} variant="outline">{selectedPath.secondaryLabel}</FunnelLink>
              </div>
              <div className="mt-6 border-t border-border pt-5">
                <Link to={selectedPath.hubHref} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  View the full reading path
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-secondary/20 border-y border-border">
          <div className="container mx-auto px-4 py-12">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Business routing</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">
                  Where each reader should go next
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
                <Link to="/family-situation-assessment" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold text-foreground">Family Situation Assessment</p>
                  <p className="mt-2 text-sm text-muted-foreground">Best for readers who need to identify whether this is a safety, intervention, boundaries, after-treatment, or support problem.</p>
                </Link>
                <Link to="/support/sober-helpline" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <LifeBuoy className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold text-foreground">Sober Helpline</p>
                  <p className="mt-2 text-sm text-muted-foreground">Best for families who need live support, orientation, and a place to ask questions before choosing a bigger step.</p>
                </Link>
                <Link to="/support/freedom-interventions" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <ShieldAlert className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold text-foreground">Freedom Interventions</p>
                  <p className="mt-2 text-sm text-muted-foreground">Best when treatment refusal, escalating risk, relapse, or family division means education alone is not enough.</p>
                </Link>
                <Link to="/support/boundaries-course" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold text-foreground">Boundaries Course</p>
                  <p className="mt-2 text-sm text-muted-foreground">Best when the family knows the issue but keeps losing the limit under guilt, fear, or pressure.</p>
                </Link>
                <Link to="/support/family-bridge" className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <MapPinned className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-semibold text-foreground">Family Bridge</p>
                  <p className="mt-2 text-sm text-muted-foreground">Best after treatment, when the family needs structure, shared expectations, and better communication.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <CoachingInterventionCTA />

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-3xl border border-border bg-card p-6 md:p-8">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Before you keep reading</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-2">A calmer standard for what good help looks like</h2>
              <p className="mt-4 text-muted-foreground">
                Good family support is not frantic. It is honest, boundaried, and steady enough to survive the next hard conversation.
                That is the standard behind this site.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Less rescuing</p>
                  <p className="text-sm text-muted-foreground mt-1">More clarity about what belongs to you and what does not.</p>
                </div>
                <div className="rounded-2xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Less guessing</p>
                  <p className="text-sm text-muted-foreground mt-1">More pattern recognition before you react.</p>
                </div>
                <div className="rounded-2xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Less panic</p>
                  <p className="text-sm text-muted-foreground mt-1">More next steps that still make sense tomorrow.</p>
                </div>
              </div>
              <Button variant="outline" className="mt-6" asChild>
                <Link to="/about">Why Matt Brown built this site</Link>
              </Button>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">When self-help is not enough</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Use the right level of support</h2>
              <div className="mt-5 space-y-3">
                <a href="https://soberhelpline.com" target="_blank" rel="noreferrer" className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">Join Sober Helpline</p>
                  <p className="text-sm text-muted-foreground mt-1">Free family support Zoom every Monday night led by professional interventionists. Ask questions or just listen.</p>
                </a>
                <a href="https://freedominterventions.com" target="_blank" rel="noreferrer" className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">Talk to Freedom Interventions</p>
                  <p className="text-sm text-muted-foreground mt-1">For families facing treatment refusal, escalating risk, or repeated relapse patterns.</p>
                </a>
                <Link to="/family-support-guide" className="block rounded-2xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">Stay in the guided path</p>
                  <p className="text-sm text-muted-foreground mt-1">If you need a steadier first move before deciding on outside help.</p>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
