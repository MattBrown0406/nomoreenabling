import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, HelpCircle, ShieldAlert, UserRoundCheck } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import PersonJsonLd from "@/components/seo/PersonJsonLd";
import QAPageJsonLd from "@/components/seo/QAPageJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import TrustedResourceList from "@/components/TrustedResourceList";
import mattHeadshot from "@/assets/matt-brown-headshot.jpeg";
import {
  aeoAnswers,
  answerDetailPath,
  getRelatedAnswers,
  getRelatedGlossaryTerms,
} from "@/data/aeoAnswers";
import { getTrustedResourcesForTags } from "@/data/trustedResources";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

const laneConfig = {
  support: {
    label: "Join the free Family Squares support meeting",
    href: "https://soberhelpline.com/family-squares?utm_source=nomoreenabling&utm_medium=answer_page&utm_campaign=aeo_support_path",
    description: "Best when the family needs free, steady support before making a larger decision.",
  },
  coaching: {
    label: "Book private family guidance",
    href: "/family-addiction-consultation",
    description: "Best when the situation is specific, urgent, or too important to keep improvising.",
  },
  intervention: {
    label: "Check intervention readiness",
    href: "/intervention-help",
    description: "Best when treatment refusal, safety risk, or family division is escalating.",
  },
  assessment: {
    label: "Take the family situation assessment",
    href: "/family-situation-assessment",
    description: "Best when the family needs help choosing between education, free support, coaching, or intervention.",
  },
};

const defaultMoves = [
  "Pause the rescue decision long enough to name what is actually happening.",
  "Separate love and connection from money, housing, secrecy, or consequence removal.",
  "Choose one next action that supports safety, honesty, treatment, or accountability.",
];

export default function AnswerDetail() {
  const { answerSlug } = useParams<{ answerSlug: string }>();
  const answer = aeoAnswers.find((item) => item.id === answerSlug);

  useEffect(() => {
    if (!answer) return;

    void trackFunnelEvent("answer_page_view", {
      source: "answer_detail",
      metadata: {
        answer_id: answer.id,
        answer_question: answer.question,
        answer_category: answer.category,
        revenue_path: answer.revenuePath ?? "assessment",
      },
    });
  }, [answer]);

  if (!answer) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground">Answer not found</h1>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/answers">
              <ArrowLeft className="h-4 w-4" />
              Back to answers
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://nomoreenabling.com${answerDetailPath(answer)}`;
  const relatedAnswers = getRelatedAnswers(answer);
  const relatedTerms = getRelatedGlossaryTerms(answer);
  const lane = laneConfig[answer.revenuePath ?? "assessment"];
  const moves = answer.whatToDo ?? defaultMoves;
  const helpSignal =
    answer.whenToGetHelp ??
    "If this pattern keeps repeating, if safety is changing, or if the family cannot stay aligned, get outside guidance before the next crisis decides for you.";
  const trustedResources = getTrustedResourcesForTags(answer.tags);

  const trackAnswerClick = (clickType: string, targetHref: string, extra: Record<string, unknown> = {}) => {
    void trackFunnelEvent("answer_page_click", {
      source: "answer_detail",
      targetHref,
      metadata: {
        answer_id: answer.id,
        answer_question: answer.question,
        answer_category: answer.category,
        revenue_path: answer.revenuePath ?? "assessment",
        click_type: clickType,
        ...extra,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={answer.question}
        description={answer.shortAnswer}
        canonicalUrl={canonicalUrl}
        keywords={`${answer.question}, ${answer.tags.join(", ")}, addiction family answer`}
      />
      <QAPageJsonLd question={answer.question} answer={answer.shortAnswer} url={canonicalUrl} />
      <FAQJsonLd
        faqs={[
          { question: answer.question, answer: answer.shortAnswer },
          { question: "When should a family get help with this?", answer: helpSignal },
        ]}
      />
      <PersonJsonLd imageUrl={`https://nomoreenabling.com${mattHeadshot}`} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Answers", url: "https://nomoreenabling.com/answers" },
          { name: answer.question, url: canonicalUrl },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link to="/answers" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to answers
            </Link>
            <span className="mb-6 flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <HelpCircle className="h-4 w-4" />
              {answer.category}
            </span>
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
              <div>
                <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                  {answer.question}
                </h1>
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Direct answer</p>
                  <p className="mt-3 text-xl leading-relaxed text-foreground">{answer.shortAnswer}</p>
                </div>
              </div>

              <Card className="border-primary/20">
                <CardContent className="p-6">
                  <UserRoundCheck className="h-8 w-8 text-primary" />
                  <h2 className="mt-4 font-serif text-2xl font-bold text-foreground">Answered by Matt Brown</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    Matt Brown is a professional interventionist and family addiction coach. These answers are written for families trying to stop enabling without losing clarity, love, or safety.
                  </p>
                  <Link to="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    About Matt
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">What this usually means</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-foreground">The pattern underneath the question</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {answer.concern ?? "This question usually shows up when a family has been carrying too much for too long and needs a cleaner way to respond."}
                </p>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">What to do next</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-foreground">A steadier first move</h2>
                <div className="mt-6 space-y-4">
                  {moves.map((move) => (
                    <div key={move} className="flex gap-3 rounded-xl bg-secondary/40 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <p className="text-muted-foreground">{move}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-primary">
                  <ShieldAlert className="h-4 w-4" />
                  When to get help
                </p>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{helpSignal}</p>
              </article>

              <TrustedResourceList
                resources={trustedResources}
                source="answer_detail"
                trackingContext={{
                  answer_id: answer.id,
                  answer_question: answer.question,
                  answer_category: answer.category,
                  revenue_path: answer.revenuePath ?? "assessment",
                }}
              />
            </div>

            <aside className="space-y-6">
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">Best next step</p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">{lane.label}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{lane.description}</p>
                  <Button asChild className="mt-5 w-full">
                    <a
                      href={lane.href}
                      onClick={() => trackAnswerClick("primary_revenue_path", lane.href, {
                        label: lane.label,
                      })}
                    >
                      Start here
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">Deeper guide</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{answer.nextStep}</p>
                  <Link
                    to={answer.href}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    onClick={() => trackAnswerClick("related_guide", answer.href, {
                      label: answer.nextStep,
                    })}
                  >
                    Open the related guide
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>

              {relatedTerms.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <h2 className="font-serif text-2xl font-bold text-foreground">Related definitions</h2>
                    <div className="mt-4 space-y-3">
                      {relatedTerms.map((term) => (
                        <Link
                          key={term.slug}
                          to={`/glossary/${term.slug}`}
                          className="block rounded-xl border border-border bg-background p-4 hover:border-primary/40"
                          onClick={() => trackAnswerClick("glossary_definition", `/glossary/${term.slug}`, {
                            term_slug: term.slug,
                            term: term.term,
                          })}
                        >
                          <p className="font-semibold text-foreground">{term.term}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{term.plainDefinition}</p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </aside>
          </div>
        </section>

        {relatedAnswers.length > 0 && (
          <section className="border-t border-border bg-muted/30 py-12">
            <div className="container mx-auto px-4">
              <h2 className="font-serif text-3xl font-bold text-foreground">Related answers</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {relatedAnswers.map((related) => (
                  <Link
                    key={related.id}
                    to={answerDetailPath(related)}
                    className="rounded-2xl border border-border bg-card p-5 hover:border-primary/40"
                    onClick={() => trackAnswerClick("related_answer", answerDetailPath(related), {
                      related_answer_id: related.id,
                      related_answer_question: related.question,
                    })}
                  >
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">{related.category}</p>
                    <h3 className="mt-2 font-serif text-xl font-bold text-foreground">{related.question}</h3>
                    <p className="mt-3 text-sm text-muted-foreground">{related.shortAnswer}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
