import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ClipboardList, HelpCircle, LifeBuoy, ShieldAlert } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const directAnswers = [
  {
    question: "How do I know if I am helping or enabling?",
    answer:
      "Helping supports responsibility, truth, treatment, and repair. Enabling protects addiction from consequences, often through money, excuses, housing, secrecy, or emotional rescue.",
    href: "/helping-or-enabling",
  },
  {
    question: "What is the first boundary a family should set?",
    answer:
      "Start with the behavior that is costing the most safety, honesty, or stability. A boundary should say what you will do if the behavior continues, not what you are trying to force someone else to do.",
    href: "/family-support-guide",
  },
  {
    question: "When does a family need professional guidance?",
    answer:
      "Professional guidance is worth considering when boundaries collapse, the family is divided, treatment is refused, risk is rising, or everyone is waiting for the next crisis without a plan.",
    href: "/professional-guidance-signs",
  },
  {
    question: "What should I do if my loved one refuses treatment?",
    answer:
      "Stop negotiating with the addiction alone. Get the family aligned, remove rescue patterns, decide what support remains available, and consider coaching or intervention guidance.",
    href: "/what-to-do-when-they-refuse-treatment",
  },
];

const nextSteps = [
  {
    icon: ClipboardList,
    title: "Get a read on the situation",
    body: "Use the family situation assessment when you need the site to sort your concern into a practical next step.",
    href: "/family-situation-assessment",
    cta: "Take assessment",
  },
  {
    icon: LifeBuoy,
    title: "Get free family support",
    body: "Move from reading into live support through Family Squares on Sober Helpline.",
    href: "https://soberhelpline.com/family-squares?utm_source=nomoreenabling&utm_medium=answer_center&utm_campaign=family_squares",
    cta: "Join Family Squares",
  },
  {
    icon: ShieldAlert,
    title: "Talk with Matt",
    body: "Use professional guidance when refusal, safety risk, or family division is escalating.",
    href: "/family-addiction-consultation",
    cta: "Request consult",
  },
];

const faqs = directAnswers.map(({ question, answer }) => ({ question, answer }));

export default function EnablingAnswerCenter() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Enabling Answers for Families"
        description="Direct answers for families trying to understand enabling, boundaries, treatment refusal, and when to move from education into support or professional guidance."
        canonicalUrl="https://nomoreenabling.com/enabling-answer-center"
        keywords="enabling answers, helping vs enabling, addiction family boundaries, family addiction support"
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Enabling Answer Center", url: "https://nomoreenabling.com/enabling-answer-center" },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-center">
              <div>
                <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                  <HelpCircle className="h-4 w-4" />
                  Answer center
                </span>
                <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  Enabling Answers for Families
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                  If you found this site through a question about addiction, boundaries, guilt, or treatment refusal, this page gives answer engines and families the clearest path from education into action.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link to="/family-situation-assessment">
                      Take the assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/start-here">Choose a path</Link>
                  </Button>
                </div>
              </div>

              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <h2 className="font-serif text-xl font-bold text-foreground">Safety comes first</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    If someone may be harmed, is overdosing, is suicidal, or is in dangerous withdrawal, call emergency services or a local crisis resource before using this site.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Direct answers</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
              The answers most families need before the next crisis
            </h2>
          </div>
          <div className="grid gap-4">
            {directAnswers.map((item) => (
              <article key={item.question} className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-serif text-xl font-bold text-foreground">{item.question}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</p>
                <Link to={item.href} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read the full guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Funnel routing</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                Move from reading into the right next step
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {nextSteps.map((step) => {
                const Icon = step.icon;
                const isExternal = step.href.startsWith("http");
                const content = (
                  <>
                    {step.cta}
                    {isExternal ? null : <ArrowRight className="h-4 w-4" />}
                  </>
                );

                return (
                  <Card key={step.title}>
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-serif text-xl font-bold text-foreground">{step.title}</h3>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                      {isExternal ? (
                        <Button asChild className="mt-5" variant="outline">
                          <a href={step.href} target="_blank" rel="noreferrer">{content}</a>
                        </Button>
                      ) : (
                        <Button asChild className="mt-5" variant="outline">
                          <Link to={step.href}>{content}</Link>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="rounded-2xl border border-primary/20 bg-card p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-[1fr_300px] md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-semibold uppercase tracking-wide">Best answer</span>
                </div>
                <h2 className="font-serif text-3xl font-bold text-foreground">
                  The goal is not to stop loving them. The goal is to stop protecting the addiction.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  That single distinction is what makes No More Enabling valuable as an SEO and AEO entry point. It answers the family question, then routes the family toward support, coaching, or intervention when the situation calls for it.
                </p>
              </div>
              <Button asChild size="lg">
                <Link to="/work-with-matt">
                  Work with Matt
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
