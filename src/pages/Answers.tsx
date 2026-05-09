import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle2, HelpCircle, Library, Scale, ShieldAlert } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { aeoAnswers, answerDetailPath, comparisonAnswers } from "@/data/aeoAnswers";

const answerFaqs = aeoAnswers.slice(0, 8).map((answer) => ({
  question: answer.question,
  answer: answer.shortAnswer,
}));

const categories = Array.from(new Set(aeoAnswers.map((answer) => answer.category)));
const firstAnswerByCategory = Object.fromEntries(
  categories.map((category) => [
    category,
    aeoAnswers.find((answer) => answer.category === category)?.id ?? "",
  ]),
);

export default function Answers() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Family Addiction Answers"
        description="Short, direct answers for families asking about enabling, boundaries, treatment refusal, adult child addiction, alcohol, relapse, coaching, and intervention."
        canonicalUrl="https://nomoreenabling.com/answers"
        keywords="family addiction answers, enabling questions, addiction boundaries answers, treatment refusal answers"
      />
      <FAQJsonLd faqs={answerFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Answers", url: "https://nomoreenabling.com/answers" },
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
                  Family Addiction Answers
                </span>
                <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  Short answers for families who need the next right step.
                </h1>
                <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                  This page turns No More Enabling into an answer library for families and search engines. Start with the question closest to what is happening today, then move into the guide, assessment, or support path that fits.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <Link to="/family-situation-assessment">
                      Take the family assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/enabling-answer-center">Open enabling answer center</Link>
                  </Button>
                </div>
              </div>

              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <ShieldAlert className="h-8 w-8 text-primary" />
                  <h2 className="mt-4 font-serif text-xl font-bold text-foreground">Safety note</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    If someone is in immediate danger, is overdosing, is suicidal, or may be in dangerous withdrawal, call emergency services or a local crisis resource first.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <a
                key={category}
                href={`#${firstAnswerByCategory[category]}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/40 hover:text-primary"
              >
                {category}
              </a>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-4 md:grid-cols-2">
            {aeoAnswers.map((answer) => (
              <article
                key={answer.id}
                id={answer.id}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">{answer.category}</p>
                <h2 className="font-serif text-2xl font-bold text-foreground">{answer.question}</h2>
                <p className="mt-3 leading-relaxed text-muted-foreground">{answer.shortAnswer}</p>
                <div className="mt-5 rounded-xl bg-secondary/40 p-4">
                  <p className="text-sm font-semibold text-foreground">Next step</p>
                  <p className="mt-1 text-sm text-muted-foreground">{answer.nextStep}</p>
                </div>
                <Link to={answerDetailPath(answer)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open answer page
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                <Scale className="h-4 w-4" />
                Comparisons answer engines can understand
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                The distinctions families keep searching for
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {comparisonAnswers.map((comparison) => (
                <Card key={comparison.title}>
                  <CardContent className="p-6">
                    <h3 className="font-serif text-2xl font-bold text-foreground">{comparison.title}</h3>
                    <p className="mt-3 text-muted-foreground">{comparison.plainAnswer}</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="font-semibold text-foreground">{comparison.leftLabel}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{comparison.leftDefinition}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="font-semibold text-foreground">{comparison.rightLabel}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{comparison.rightDefinition}</p>
                      </div>
                    </div>
                    <Link to={comparison.href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Open comparison
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <Library className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">Glossary</h2>
                <p className="mt-3 text-sm text-muted-foreground">Plain-language definitions for enabling, boundaries, codependency, treatment refusal, and recovery support.</p>
                <Link to="/glossary" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Open glossary
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">Guided hubs</h2>
                <p className="mt-3 text-sm text-muted-foreground">Read by pattern instead of one article at a time: money, refusal, boundaries, adult child addiction, and more.</p>
                <Link to="/topic-hubs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Browse hubs
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <CheckCircle2 className="h-8 w-8 text-primary" />
                <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">Private guidance</h2>
                <p className="mt-3 text-sm text-muted-foreground">When the question is no longer theoretical, route the family into coaching or intervention guidance.</p>
                <Link to="/family-addiction-consultation" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Request guidance
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
