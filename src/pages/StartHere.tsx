import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { Button } from "@/components/ui/button";
import { topicHubs } from "@/data/topicHubs";

const steps = [
  {
    title: "Get honest about the pattern",
    description: "If things keep getting worse despite all your effort, stop assuming the answer is to try harder the same way.",
    cta: { label: "Take the helping vs enabling assessment", href: "/helping-or-enabling" },
  },
  {
    title: "Choose one clear next step",
    description: "Don’t bounce between ten articles and a hundred worries. Start with one path that matches what hurts most right now.",
    cta: { label: "Read the family support guide", href: "/family-support-guide" },
  },
  {
    title: "Build steadier follow-through",
    description: "Insight matters, but families make real progress when they move from emotional reacting to clearer, repeatable decisions.",
    cta: { label: "Start the free boundaries course", href: "/boundaries-course" },
  },
];

export default function StartHere() {
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
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
              Start Here
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">
              If addiction has your family spinning, start here
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              You do not need to solve everything today. You need a clearer read on the pattern, a calmer next step, and a path you can actually follow without getting lost in panic.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link to="/helping-or-enabling">Take the assessment</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/topic-hubs">Browse guided topic hubs</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="max-w-5xl mx-auto grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-medium text-primary">Step {index + 1}</p>
                <h2 className="font-serif text-2xl font-bold text-foreground mt-2">{step.title}</h2>
                <p className="mt-3 text-muted-foreground">{step.description}</p>
                <Button variant="outline" className="mt-5 w-full" asChild>
                  <Link to={step.cta.href}>{step.cta.label}</Link>
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-card p-6 md:p-8">
            <div className="max-w-3xl">
              <h2 className="font-serif text-3xl font-bold text-foreground">Choose the path that fits your family best</h2>
              <p className="mt-3 text-muted-foreground">
                Start with the pressure point that is costing you the most peace right now. You can always widen out later.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 mt-8">
              {topicHubs.map((hub) => (
                <Link key={hub.slug} to={`/topic-hubs/${hub.slug}`} className="rounded-2xl border border-border bg-background p-5 hover:border-primary/40 transition-colors">
                  <h3 className="font-semibold text-foreground">{hub.shortTitle}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{hub.description}</p>
                  <p className="mt-4 text-sm font-medium text-primary">Open this hub →</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
