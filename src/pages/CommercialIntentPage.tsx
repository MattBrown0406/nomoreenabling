import { Link, useParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, TriangleAlert, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import HowToJsonLd from "@/components/seo/HowToJsonLd";
import PersonJsonLd from "@/components/seo/PersonJsonLd";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import { Button } from "@/components/ui/button";
import { getCommercialIntentPage } from "@/data/commercialIntentPages";
import { getCommercialHowToSteps } from "@/data/aeoAnswers";
import { trackGAConversion } from "@/lib/gaConversions";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import mattHeadshot from "@/assets/matt-brown-headshot.jpeg";

const urgencyLabels = {
  urgent: "Safety-sensitive",
  high: "High-intent",
  steady: "Planning support",
};

interface CommercialIntentPageProps {
  pageSlug?: string;
}

export default function CommercialIntentPage({ pageSlug }: CommercialIntentPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const page = getCommercialIntentPage(pageSlug || slug);

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground">Guidance page not found</h1>
          <p className="mt-4 text-muted-foreground">Try the Work With Matt page instead.</p>
          <Button asChild className="mt-6">
            <Link to="/work-with-matt">Work with Matt</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://nomoreenabling.com/${page.slug}`;
  const directAnswer = page.faqs[0];

  const trackPageCta = (label: string, href: string) => {
    trackGAConversion("money_page_cta_click", {
      source: page.slug,
      lead_intent: page.leadIntent,
      cta_label: label,
    });
    void trackFunnelEvent("article_intent_cta_click", {
      source: "commercial_intent_page",
      targetHref: href,
      metadata: {
        pageSlug: page.slug,
        leadIntent: page.leadIntent,
        label,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={page.metaTitle}
        description={page.description}
        canonicalUrl={canonicalUrl}
        keywords={page.keywords}
      />
      <FAQJsonLd faqs={page.faqs} />
      <HowToJsonLd
        name={`How to approach ${page.eyebrow.toLowerCase()}`}
        description={page.description}
        steps={getCommercialHowToSteps(page)}
      />
      <PersonJsonLd imageUrl={`https://nomoreenabling.com${mattHeadshot}`} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: page.eyebrow, url: canonicalUrl },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                <ShieldCheck className="h-4 w-4" />
                {page.eyebrow}
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                {page.title}
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
                This page is for {page.audience}
              </p>
              {directAnswer && (
                <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Direct answer</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mt-2">{directAnswer.question}</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{directAnswer.answer}</p>
                </div>
              )}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <a href="#consultation-form" onClick={() => trackPageCta("Request private guidance", "#consultation-form")}>
                    Request private guidance
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/family-situation-assessment" onClick={() => trackPageCta("Take the assessment", "/family-situation-assessment")}>
                    Take the assessment first
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  {page.urgency === "urgent" ? <TriangleAlert className="h-6 w-6" /> : <Users className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">{urgencyLabels[page.urgency]}</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Best fit when</h2>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                {page.signs.map((sign) => (
                  <div key={sign} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{sign}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/30 py-10">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 md:grid-cols-3">
              {page.trustProof.map((proof) => (
                <div key={proof} className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{proof}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">How this works</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">A clearer sequence before another hard conversation</h2>
                <div className="mt-6 grid gap-5">
                  {page.process.map((step, index) => (
                    <div key={step.title} className="grid gap-4 sm:grid-cols-[56px_1fr]">
                      <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-foreground">{step.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">{step.body}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Related reading path</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Keep the search journey focused</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {page.relatedLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => trackPageCta(link.label, link.href)}
                      className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                    >
                      <p className="font-medium text-foreground">{link.label}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{link.description}</p>
                      <p className="mt-3 text-sm font-medium text-primary">Open path →</p>
                    </Link>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <h2 className="font-serif text-3xl font-bold text-foreground">Frequently asked questions</h2>
                <div className="mt-6 grid gap-4">
                  {page.faqs.map((faq) => (
                    <div key={faq.question} className="rounded-xl bg-secondary/40 p-4">
                      <h3 className="font-semibold text-foreground">{faq.question}</h3>
                      <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <Clock className="h-5 w-5" />
                  Next step
                </div>
                <h2 className="font-serif text-2xl font-bold text-foreground mt-3">Do not wait for the next crisis to build the plan</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  If this page describes your family, the useful next move is to share enough context for Matt to understand the pattern and route the situation.
                </p>
                <Button className="w-full mt-5" asChild>
                  <a href="#consultation-form" onClick={() => trackPageCta("Sidebar request guidance", "#consultation-form")}>
                    Request guidance
                  </a>
                </Button>
                <div className="mt-5 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-muted-foreground">
                  If someone is in immediate danger, call 911. If there is suicidal thinking or threat of self-harm in the United States, call or text 988.
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section id="consultation-form" className="container mx-auto px-4 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
            <ConsultationRequestForm
              source={`commercial-intent:${page.slug}`}
              contextLabel={page.eyebrow}
              defaultConcern={page.defaultConcern}
              leadIntent={page.leadIntent}
              submitLabel="Send private request"
            />
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Lead quality signal</p>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Why this page exists</h2>
              <p className="mt-3 text-muted-foreground">
                Searches like this usually come from people closer to action. The form captures the concern, urgency, source page, and lead intent so follow-up can prioritize the families most likely to need coaching or intervention support.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
