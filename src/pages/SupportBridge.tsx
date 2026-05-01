import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, ShieldAlert, XCircle } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import { Button } from "@/components/ui/button";
import { getSupportOffer } from "@/data/supportOffers";

const isExternalHref = (href: string) => href.startsWith("http");

const BridgeButton = ({ href, children, variant = "default" }: { href: string; children: React.ReactNode; variant?: "default" | "outline" }) => {
  const content = (
    <>
      {children}
      {isExternalHref(href) ? <ExternalLink className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
    </>
  );

  if (isExternalHref(href)) {
    return (
      <Button variant={variant} size="lg" asChild>
        <a href={href} target="_blank" rel="noreferrer">
          {content}
        </a>
      </Button>
    );
  }

  return (
    <Button variant={variant} size="lg" asChild>
      <Link to={href}>{content}</Link>
    </Button>
  );
};

export default function SupportBridge() {
  const { slug } = useParams<{ slug: string }>();
  const offer = getSupportOffer(slug);

  if (!offer) {
    return <Navigate to="/start-here" replace />;
  }

  const canonicalUrl = `https://nomoreenabling.com/support/${offer.slug}`;
  const faqs = [
    {
      question: `Who is ${offer.name} best for?`,
      answer: offer.bestFor.join(" "),
    },
    {
      question: "What should I do if someone is in immediate danger?",
      answer:
        "Call emergency services first. In the United States, call or text 988 for suicide or mental health crisis support. Use this page after immediate safety is addressed.",
    },
    {
      question: "Why am I seeing this recommendation?",
      answer: offer.whyItFits,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${offer.name} | ${offer.headline}`}
        description={offer.description}
        canonicalUrl={canonicalUrl}
        keywords={offer.keywords}
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Support", url: "https://nomoreenabling.com/start-here" },
          { name: offer.name, url: canonicalUrl },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                  {offer.eyebrow}
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-4xl">
                  {offer.headline}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
                  {offer.description}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <BridgeButton href={offer.primaryHref}>{offer.primaryLabel}</BridgeButton>
                  <BridgeButton href={offer.secondaryHref} variant="outline">{offer.secondaryLabel}</BridgeButton>
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-card p-6">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Why this route fits</p>
                <p className="mt-3 text-muted-foreground">{offer.whyItFits}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <CheckCircle2 className="h-7 w-7 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">Best fit when</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {offer.bestFor.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <ArrowRight className="h-7 w-7 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">What happens next</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {offer.whatHappensNext.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <XCircle className="h-7 w-7 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">Do not use this for</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground">
                {offer.notFor.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <ShieldAlert className="h-8 w-8 text-primary" />
                <h2 className="font-serif text-3xl font-bold text-foreground mt-4">Choose the next step that matches the situation</h2>
              </div>
              <div>
                <p className="text-muted-foreground">
                  This page exists so No More Enabling readers do not jump from an article straight into the wrong offer. If this route fits, take the next step. If it does not, use the assessment and get rerouted.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <BridgeButton href={offer.primaryHref}>{offer.primaryLabel}</BridgeButton>
                  <BridgeButton href="/family-situation-assessment" variant="outline">Retake the assessment</BridgeButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
