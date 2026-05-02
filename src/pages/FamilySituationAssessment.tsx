import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Mail,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { getSupportOffer, type SupportOfferSlug } from "@/data/supportOffers";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";

type OutcomeId = "safety" | "intervention" | "boundaries" | "after-treatment" | "support";

interface AssessmentOption {
  value: string;
  label: string;
  description: string;
  scores: Partial<Record<OutcomeId, number>>;
  safetyOverride?: boolean;
}

interface AssessmentQuestion {
  id: string;
  eyebrow: string;
  question: string;
  options: AssessmentOption[];
}

interface AssessmentOutcome {
  id: OutcomeId;
  title: string;
  description: string;
  routeLabel: string;
  offerSlug: SupportOfferSlug;
  secondaryLabel: string;
  secondaryHref: string;
  warning?: string;
  plan: string[];
}

const outcomeScores: Record<OutcomeId, number> = {
  safety: 0,
  intervention: 0,
  boundaries: 0,
  "after-treatment": 0,
  support: 0,
};

const questions: AssessmentQuestion[] = [
  {
    id: "risk",
    eyebrow: "Safety",
    question: "What is the most serious thing happening right now?",
    options: [
      {
        value: "immediate-danger",
        label: "Someone may be in immediate danger",
        description: "Threats, violence, overdose risk, impaired driving, weapons, or suicidal talk are involved.",
        scores: { safety: 8 },
        safetyOverride: true,
      },
      {
        value: "unsafe-home",
        label: "The home does not feel safe",
        description: "Using in the home, stealing, unpredictable conflict, or children being affected.",
        scores: { safety: 5, intervention: 2 },
      },
      {
        value: "escalating",
        label: "Consequences are escalating",
        description: "Work, health, legal, money, or relationship problems are getting harder to ignore.",
        scores: { intervention: 4, support: 1 },
      },
      {
        value: "confusing",
        label: "It is confusing, not immediately dangerous",
        description: "You are worried, but the next step is not obvious.",
        scores: { support: 3, boundaries: 1 },
      },
    ],
  },
  {
    id: "stuck-point",
    eyebrow: "Stuck Point",
    question: "Where does the family keep getting stuck?",
    options: [
      {
        value: "refuses-help",
        label: "They refuse help",
        description: "Treatment conversations go nowhere or turn into promises, anger, or avoidance.",
        scores: { intervention: 5 },
      },
      {
        value: "boundaries-collapse",
        label: "Boundaries collapse",
        description: "You know the limit, but guilt, fear, or pushback keeps undoing it.",
        scores: { boundaries: 5 },
      },
      {
        value: "after-treatment",
        label: "They are home after treatment",
        description: "The family needs structure around trust, house rules, aftercare, or relapse risk.",
        scores: { "after-treatment": 5 },
      },
      {
        value: "need-orientation",
        label: "We need orientation",
        description: "You need help sorting the situation before choosing a bigger step.",
        scores: { support: 5 },
      },
    ],
  },
  {
    id: "family-pattern",
    eyebrow: "Family Pattern",
    question: "What pattern is costing the family the most peace?",
    options: [
      {
        value: "rescuing",
        label: "Rescuing and overfunctioning",
        description: "Money, rides, excuses, housing, or emotional cleanup keep landing on the family.",
        scores: { boundaries: 4, support: 1 },
      },
      {
        value: "division",
        label: "Family division",
        description: "People disagree about consequences, treatment, money, or how serious this is.",
        scores: { intervention: 4, support: 2 },
      },
      {
        value: "old-roles",
        label: "Old roles after rehab",
        description: "Everyone wants recovery, but the old rescue pattern is quietly rebuilding.",
        scores: { "after-treatment": 4, boundaries: 2 },
      },
      {
        value: "panic-searching",
        label: "Panic searching",
        description: "You keep reading, asking, and worrying without landing on a clear next action.",
        scores: { support: 4 },
      },
    ],
  },
  {
    id: "readiness",
    eyebrow: "Readiness",
    question: "How open is your loved one to help right now?",
    options: [
      {
        value: "willing",
        label: "They are somewhat willing",
        description: "They may not be enthusiastic, but there is some openness.",
        scores: { support: 3, "after-treatment": 1 },
      },
      {
        value: "ambivalent",
        label: "They go back and forth",
        description: "They say the right things, then avoid follow-through.",
        scores: { boundaries: 2, intervention: 2, support: 1 },
      },
      {
        value: "refusing",
        label: "They are refusing",
        description: "They deny, minimize, blame, or shut down treatment conversations.",
        scores: { intervention: 5 },
      },
      {
        value: "already-in-recovery",
        label: "They are already in recovery",
        description: "The question is how the family supports recovery without controlling it.",
        scores: { "after-treatment": 5 },
      },
    ],
  },
  {
    id: "next-step",
    eyebrow: "Next Step",
    question: "What would help most in the next seven days?",
    options: [
      {
        value: "safety-plan",
        label: "A safer plan",
        description: "You need to stop treating risk as a normal family argument.",
        scores: { safety: 5 },
      },
      {
        value: "intervention-plan",
        label: "An intervention or treatment-refusal plan",
        description: "The family needs structure before another conversation.",
        scores: { intervention: 5 },
      },
      {
        value: "boundary-language",
        label: "Boundary language that holds",
        description: "You need clearer words and follow-through.",
        scores: { boundaries: 5 },
      },
      {
        value: "support-space",
        label: "A place to ask questions",
        description: "You need live support before deciding what the situation requires.",
        scores: { support: 5 },
      },
    ],
  },
];

const outcomes: Record<OutcomeId, AssessmentOutcome> = {
  safety: {
    id: "safety",
    title: "You are in a safety-first situation",
    description:
      "The next move should reduce immediate risk before the family tries another emotional conversation. Treat safety as the first decision, not as a side note.",
    routeLabel: "Safety and intervention guidance",
    offerSlug: "freedom-interventions",
    secondaryLabel: "Read the crisis and safety hub",
    secondaryHref: "/topic-hubs/crisis-and-safety",
    warning: "If someone is in immediate danger, call emergency services. In the U.S., call or text 988 for suicide or mental health crisis support.",
    plan: [
      "Write down the specific safety concern in plain language.",
      "Decide who is physically safest to contact first.",
      "Avoid another confrontation while someone is intoxicated, threatening, or unstable.",
      "Use professional or emergency support when risk is active.",
    ],
  },
  intervention: {
    id: "intervention",
    title: "You are in an intervention-readiness situation",
    description:
      "The family has likely moved past casual advice. The next step is to stop improvising and build a coordinated treatment-refusal plan.",
    routeLabel: "Intervention planning",
    offerSlug: "freedom-interventions",
    secondaryLabel: "Read the intervention hub",
    secondaryHref: "/topic-hubs/intervention",
    plan: [
      "Stop scheduling another unplanned debate.",
      "Gather the family around one shared picture of the pattern.",
      "Clarify treatment options and consequences before the next conversation.",
      "Get help if the family is divided or the risk keeps escalating.",
    ],
  },
  boundaries: {
    id: "boundaries",
    title: "You are in a boundaries problem",
    description:
      "The issue is not lack of love. The issue is that guilt, fear, and pressure keep turning support into rescue.",
    routeLabel: "Boundary repair",
    offerSlug: "boundaries-course",
    secondaryLabel: "Take the helping vs enabling tool",
    secondaryHref: "/helping-or-enabling",
    plan: [
      "Choose one boundary to practice instead of fixing everything.",
      "Name what you will do, not what they must do.",
      "Remove money, housing, excuses, or emotional cleanup from autopilot.",
      "Expect pushback and plan your response before it arrives.",
    ],
  },
  "after-treatment": {
    id: "after-treatment",
    title: "You are in an after-treatment support problem",
    description:
      "The crisis may be quieter now, but the family still needs structure. Recovery needs support without rebuilding old roles.",
    routeLabel: "After-treatment family structure",
    offerSlug: "family-bridge",
    secondaryLabel: "Read the after-treatment hub",
    secondaryHref: "/topic-hubs/after-treatment",
    plan: [
      "Clarify house rules, aftercare expectations, and communication boundaries.",
      "Stop making one family member the recovery manager.",
      "Separate support from monitoring, rescuing, or bargaining.",
      "Create a shared structure before relapse fear takes over.",
    ],
  },
  support: {
    id: "support",
    title: "You need a support and orientation path",
    description:
      "You may not need a formal intervention today. You do need a calmer place to sort what is happening and choose the right next level of help.",
    routeLabel: "Live family support",
    offerSlug: "sober-helpline",
    secondaryLabel: "Start with guided paths",
    secondaryHref: "/start-here",
    plan: [
      "Describe the situation without trying to diagnose everyone.",
      "Separate immediate risk from long-term family patterns.",
      "Choose one next step instead of five frantic ones.",
      "Use support before the family burns out or splits further.",
    ],
  },
};

const isExternalHref = (href: string) => href.startsWith("http");

const AssessmentLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
        {children}
        <ExternalLink className="h-4 w-4" />
      </a>
    );
  }

  return (
    <Link to={href} className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
      {children}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
};

const AssessmentButtonLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const className = "inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors";

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

export default function FamilySituationAssessment() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captureComplete, setCaptureComplete] = useState(false);
  const loadedAt = useRef(Date.now());
  const startedTracked = useRef(false);
  const completedTracked = useRef(false);

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === questions.length;

  const result = useMemo(() => {
    if (!isComplete) return null;

    const scores = { ...outcomeScores };
    let safetyOverride = false;

    questions.forEach((question) => {
      const selected = question.options.find((option) => option.value === answers[question.id]);
      if (!selected) return;
      if (selected.safetyOverride) safetyOverride = true;

      Object.entries(selected.scores).forEach(([outcome, score]) => {
        scores[outcome as OutcomeId] += score;
      });
    });

    if (safetyOverride) return outcomes.safety;

    const winner = (Object.keys(scores) as OutcomeId[]).sort((a, b) => scores[b] - scores[a])[0];
    return outcomes[winner];
  }, [answers, isComplete]);

  const offer = result ? getSupportOffer(result.offerSlug) : null;

  useEffect(() => {
    if (!result || completedTracked.current) return;

    completedTracked.current = true;
    void trackFunnelEvent("assessment_completed", {
      source: "family_situation_assessment",
      assessmentResult: result.id,
      offerSlug: result.offerSlug,
      metadata: { answers },
    });
    trackGAConversion("assessment_completed", {
      assessment_result: result.id,
      offer_slug: result.offerSlug,
    });
  }, [answers, result]);

  const handleAnswer = (questionId: string, value: string) => {
    if (!startedTracked.current) {
      startedTracked.current = true;
      void trackFunnelEvent("assessment_started", {
        source: "family_situation_assessment",
      });
    }

    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!result || !email.trim()) return;

    if (honeypot) {
      setCaptureComplete(true);
      return;
    }

    setIsSubmitting(true);
    void trackFunnelEvent("email_capture_attempt", {
      source: "family_situation_assessment",
      assessmentResult: result.id,
      offerSlug: offer?.slug,
    });

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email,
          first_name: firstName || null,
          source: "family_situation_assessment",
          result: result.id,
          recommended_offer: offer?.slug,
          answers,
          _t: loadedAt.current,
        },
      });

      if (error && data?.error !== "already_subscribed") throw error;

      setCaptureComplete(true);
      void trackFunnelEvent("email_capture_success", {
        source: "family_situation_assessment",
        assessmentResult: result.id,
        offerSlug: offer?.slug,
      });
      trackGAConversion("assessment_email_capture", {
        assessment_result: result.id,
        offer_slug: offer?.slug,
      });
      toast({
        title: data?.error === "already_subscribed" ? "You are already on the list." : "Your plan is saved.",
        description: "Use the result below now, and watch your inbox for practical family guidance.",
      });
      setEmail("");
      setFirstName("");
    } catch {
      void trackFunnelEvent("email_capture_failure", {
        source: "family_situation_assessment",
        assessmentResult: result.id,
        offerSlug: offer?.slug,
      });
      toast({
        title: "Something went wrong",
        description: "Your result is still available below. Please try the email form again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCaptureComplete(false);
    loadedAt.current = Date.now();
    startedTracked.current = false;
    completedTracked.current = false;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Family Situation Assessment | Find the Right Addiction Support Path"
        description="A short family addiction assessment that routes you to the right next step: safety, intervention readiness, boundaries, after-treatment support, or live family support."
        canonicalUrl="https://nomoreenabling.com/family-situation-assessment"
        keywords="family addiction assessment, addiction family quiz, intervention readiness, addiction boundaries, after rehab family support"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Family Situation Assessment", url: "https://nomoreenabling.com/family-situation-assessment" },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                  <ClipboardList className="h-4 w-4" />
                  Family Situation Assessment
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-4xl">
                  Find the right next step before you react again
                </h1>
                <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
                  Answer five questions and get routed into the right path: safety, intervention readiness, boundaries, after-treatment structure, or live support.
                </p>
              </div>
              <div className="rounded-2xl border border-primary/20 bg-card p-6">
                <ShieldAlert className="h-6 w-6 text-primary" />
                <p className="mt-3 font-semibold text-foreground">Not a crisis service</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  If someone is in immediate danger, call emergency services. In the U.S., call or text 988 for suicide or mental health crisis support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
            <div className="space-y-5">
              {questions.map((question, questionIndex) => (
                <fieldset key={question.id} className="rounded-2xl border border-border bg-card p-5 md:p-6">
                  <legend className="sr-only">{question.question}</legend>
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">{question.eyebrow}</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mt-2">{question.question}</h2>
                  <div className="mt-5 grid gap-3">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleAnswer(question.id, option.value)}
                          className={`text-left rounded-xl border p-4 transition-colors ${
                            selected ? "border-primary bg-primary/5" : "border-border bg-background hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30"
                            }`}>
                              {selected && <CheckCircle2 className="h-3.5 w-3.5" />}
                            </span>
                            <span>
                              <span className="font-medium text-foreground">{option.label}</span>
                              <span className="block text-sm text-muted-foreground mt-1">{option.description}</span>
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">Question {questionIndex + 1} of {questions.length}</p>
                </fieldset>
              ))}
            </div>

            <aside className="lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Your route</p>
                {!result ? (
                  <>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Answer the five questions</h2>
                    <div className="mt-5 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {answeredCount} of {questions.length} answered. Your recommended path appears here as soon as the assessment is complete.
                    </p>
                  </>
                ) : (
                  <>
                    {result.warning && (
                      <div className="mb-5 rounded-xl border border-destructive/20 bg-destructive/10 p-4">
                        <div className="flex gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 text-destructive" />
                          <p className="text-sm text-foreground">{result.warning}</p>
                        </div>
                      </div>
                    )}
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-2">{result.title}</h2>
                    <p className="mt-3 text-muted-foreground">{result.description}</p>
                    <div className="mt-5 rounded-xl bg-secondary/40 p-4">
                      <p className="text-sm font-medium text-foreground">Recommended route</p>
                      <p className="mt-1 text-sm text-muted-foreground">{result.routeLabel}</p>
                    </div>
                    {offer && (
                      <div className="mt-5 grid gap-3">
                        <Button asChild>
                          <Link
                            to={`/support/${offer.slug}`}
                            onClick={() => {
                              void trackFunnelEvent("assessment_route_click", {
                                source: "family_situation_assessment",
                                assessmentResult: result.id,
                                offerSlug: offer.slug,
                                targetHref: `/support/${offer.slug}`,
                              });
                            }}
                          >
                            See why {offer.name} fits
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                        <AssessmentButtonLink href={result.secondaryHref}>{result.secondaryLabel}</AssessmentButtonLink>
                      </div>
                    )}
                    <Button variant="ghost" className="mt-4 w-full" onClick={resetAssessment}>
                      <RotateCcw className="h-4 w-4" />
                      Retake assessment
                    </Button>
                  </>
                )}
              </div>

              {result && (
                <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-6">
                  <Mail className="h-5 w-5 text-primary" />
                  <h2 className="font-serif text-xl font-bold text-foreground mt-3">Get the 7-day stabilization plan</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Save this route and join the email list for practical family guidance around boundaries, treatment resistance, relapse, and next steps.
                  </p>
                  {captureComplete ? (
                    <div className="mt-5 rounded-xl border border-primary/20 bg-background p-4">
                      <p className="font-medium text-foreground">You are set.</p>
                      <p className="mt-1 text-sm text-muted-foreground">Your result is below, and your inbox will get the follow-up guidance.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                      <input
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                        className="absolute -left-[9999px] opacity-0"
                        tabIndex={-1}
                        autoComplete="off"
                      />
                      <div>
                        <Label htmlFor="assessment-first-name">First name</Label>
                        <Input
                          id="assessment-first-name"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder="Optional"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="assessment-email">Email</Label>
                        <Input
                          id="assessment-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="you@example.com"
                          className="mt-1"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Send my plan"}
                      </Button>
                    </form>
                  )}
                </div>
              )}
            </aside>
          </div>
        </section>

        {result && (
          <section className="container mx-auto px-4 pb-16">
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Your 7-day focus</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Stabilize the next step</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-4">
                {result.plan.map((step, index) => (
                  <div key={step} className="rounded-xl border border-border bg-background p-4">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                      {index + 1}
                    </span>
                    <p className="mt-3 text-sm text-muted-foreground">{step}</p>
                  </div>
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
