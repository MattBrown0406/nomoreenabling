import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, ExternalLink, HeartHandshake, Route, Shield, Sparkles, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import { Button } from "@/components/ui/button";
import { trackGAConversion } from "@/lib/gaConversions";
import { withOwnedUtm } from "@/lib/ownedLinks";
import mattHeadshot from "@/assets/matt-brown-headshot.jpeg";
import freedomLogo from "@/assets/freedom-interventions-logo.jpg";
import soberHelplineLogo from "@/assets/sober-helpline-logo.png";
import familyBridgeLogo from "@/assets/family-bridge-logo.png";

const faqs = [
  {
    question: "Who is family addiction coaching for?",
    answer:
      "Family addiction coaching is for parents, spouses, siblings, adult children, and other loved ones who need help responding to addiction, relapse, treatment refusal, codependency, enabling, or boundary breakdowns.",
  },
  {
    question: "Is this the same as a professional intervention?",
    answer:
      "Not always. Some families need coaching and planning before an intervention is appropriate. Others are already facing safety risks, treatment refusal, or repeated relapse and may need formal intervention guidance.",
  },
  {
    question: "What happens after I request guidance?",
    answer:
      "Matt reviews the information you share, looks for the level of support that fits the situation, and follows up with a next step. If a higher level of intervention support is needed, he can help point the family toward that path.",
  },
  {
    question: "Can families get help even if their loved one refuses treatment?",
    answer:
      "Yes. Families can often begin changing the conditions around addiction before the loved one agrees to help. Coaching can support family alignment, safer boundaries, and clearer planning.",
  },
  {
    question: "Is this a crisis service?",
    answer:
      "No. No More Enabling is not a crisis service. If someone is in immediate danger, call 911 or 988 in the United States. The consultation form is for non-emergency family guidance and planning.",
  },
];

const supportOptions = [
  "Family alignment before another conversation",
  "Boundary planning that does not collapse under pressure",
  "Treatment refusal and repeated relapse patterns",
  "Deciding whether a professional intervention makes sense",
  "Reducing enabling without abandoning your loved one",
  "Protecting children, partners, and exhausted family members",
];

const freedomHref = withOwnedUtm("https://freedominterventions.com", {
  medium: "work_with_matt",
  campaign: "intervention_consult",
  content: "business_bridge",
});

const soberHelplineHref = withOwnedUtm("https://soberhelpline.com/from-no-more-enabling", {
  medium: "work_with_matt",
  campaign: "soberhelpline_bridge",
  content: "business_bridge",
});

const familyBridgeHref = withOwnedUtm("https://familybridgeapp.com", {
  medium: "work_with_matt",
  campaign: "family_bridge_app",
  content: "business_bridge",
});

const supportLanes = [
  {
    title: "Coaching with Matt",
    description: "A private next-step conversation when your family needs clarity, language, and a steadier plan.",
    href: "#consultation-form",
    icon: Users,
    brand: "No More Enabling",
    image: mattHeadshot,
    external: false,
    accent: "bg-amber-50 border-amber-200 text-amber-950",
  },
  {
    title: "Professional intervention",
    description: "When treatment refusal, relapse, safety, or escalation calls for formal intervention planning.",
    href: freedomHref,
    icon: Shield,
    brand: "Freedom Interventions",
    image: freedomLogo,
    external: true,
    accent: "bg-red-50 border-red-200 text-red-950",
  },
  {
    title: "Family Squares support",
    description: "A live support lane for families who need community, education, and a place to stop carrying it alone.",
    href: soberHelplineHref,
    icon: HeartHandshake,
    brand: "Sober Helpline",
    image: soberHelplineLogo,
    external: true,
    accent: "bg-emerald-50 border-emerald-200 text-emerald-950",
  },
  {
    title: "Recovery structure",
    description: "Technology support for families and recovery teams who need better communication after treatment begins.",
    href: familyBridgeHref,
    icon: Route,
    brand: "Family Bridge",
    image: familyBridgeLogo,
    external: true,
    accent: "bg-sky-50 border-sky-200 text-sky-950",
  },
];

const nextSteps = [
  "Matt reviews the family pattern, urgency, and what has already been tried.",
  "You get routed toward coaching, intervention planning, Family Squares, or another support lane.",
  "Follow-up stays organized so the next step does not disappear after one emotional conversation.",
];

export default function WorkWithMatt() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Family Addiction Coaching and Intervention Guidance"
        description="Work with interventionist Matt Brown for family addiction coaching, boundary planning, treatment refusal guidance, and professional intervention next steps."
        canonicalUrl="https://nomoreenabling.com/work-with-matt"
        keywords="family addiction coaching, addiction interventionist, family intervention guidance, treatment refusal help, addiction family consultant, Matt Brown interventionist"
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Work With Matt", url: "https://nomoreenabling.com/work-with-matt" },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-maroon via-primary to-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_34%)]" aria-hidden="true" />
          <div className="container mx-auto px-4 py-14 md:py-20 relative">
            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <span className="inline-block rounded-full bg-white/15 text-white px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
                Work with Matt Brown
                </span>
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Turn the family chaos into a next-step plan
                </h1>
                <p className="mt-6 text-lg md:text-xl text-white/85 max-w-3xl">
                  When articles are no longer enough, Matt helps your family sort the pattern, align around reality, and choose the right lane: coaching, intervention planning, live family support, or recovery structure.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <Button size="lg" className="bg-white text-maroon hover:bg-white/90" asChild>
                    <a href="#consultation-form">
                      Request guidance
                      <ArrowRight className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="lg" className="border-white/40 bg-white/10 text-white hover:bg-white hover:text-maroon" asChild>
                    <Link to="/professional-guidance-signs">See signs you may need help</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-white/20 bg-white/95 p-5 md:p-6 shadow-hover">
                <div className="grid gap-5 sm:grid-cols-[140px_1fr] sm:items-center">
                  <img src={mattHeadshot} alt="Matt Brown" className="h-36 w-36 rounded-2xl object-cover shadow-card" />
                  <div>
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">Best fit when</p>
                    <div className="mt-4 space-y-3">
                      {supportOptions.slice(0, 4).map((option) => (
                        <div key={option} className="flex gap-3">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-foreground text-sm">{option}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-2xl bg-secondary/60 p-4">
                  <p className="font-serif text-xl font-bold text-foreground">This is not a generic intake form.</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    It is a routing point for the whole No More Enabling ecosystem, so families do not have to guess which business or support path fits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-wide text-primary font-medium">The business bridge</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">One conversation can route the family to the right level of help</h2>
              </div>
              <Button variant="outline" asChild>
                <Link to="/family-addiction-consultation">Private consultation path</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {supportLanes.map((lane) => {
                const Icon = lane.icon;
                const content = (
                  <div className={`group h-full rounded-2xl border p-5 transition-all hover:-translate-y-1 hover:shadow-hover ${lane.accent}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/75">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="h-12 w-20 rounded-lg bg-white/75 p-1 flex items-center justify-center">
                        <img src={lane.image} alt={lane.brand} className="max-h-10 max-w-full rounded object-contain" />
                      </div>
                    </div>
                    <p className="mt-5 text-xs uppercase tracking-wide opacity-70">{lane.brand}</p>
                    <h3 className="font-serif text-xl font-bold mt-1">{lane.title}</h3>
                    <p className="mt-2 text-sm opacity-80">{lane.description}</p>
                    <p className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                      Open lane
                      {lane.external ? <ExternalLink className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />}
                    </p>
                  </div>
                );

                return lane.external ? (
                  <a
                    key={lane.title}
                    href={lane.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackGAConversion("owned_offer_click", { source: "work_with_matt", owned_brand: lane.brand })}
                  >
                    {content}
                  </a>
                ) : (
                  <a key={lane.title} href={lane.href}>
                    {content}
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="rounded-3xl border border-border bg-secondary/30 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <p className="text-sm uppercase tracking-wide text-primary font-medium">Experience and standards</p>
                <h2 className="font-serif text-3xl font-bold text-foreground mt-2">Direct, practical help for family systems under stress</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Matt Brown has worked with families affected by addiction since 2004. His guidance is grounded in intervention experience,
                  family systems thinking, treatment planning, and the reality that families need support they can hold under pressure.
                </p>
                <p>
                  No More Enabling does not replace medical, legal, or emergency care. The work here is educational and consultative: helping families see the pattern, reduce enabling, and choose a better next step.
                </p>
                <Link to="/about" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
                  Read Matt’s background
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="consultation-form" className="container mx-auto px-4 pb-16">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-start">
            <ConsultationRequestForm
              source="work-with-matt"
              contextLabel="Work with Matt"
              defaultConcern="We need help deciding the next step"
              leadIntent="work-with-matt"
            />
            <aside className="space-y-4">
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h2 className="font-serif text-2xl font-bold text-foreground">What happens next</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {nextSteps.map((step, index) => (
                    <div key={step} className="flex gap-3">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">What makes a good first message?</h2>
                <ul className="mt-4 space-y-3 text-muted-foreground list-disc pl-5">
                  <li>What substance or behavior is causing concern</li>
                  <li>What your family has already tried</li>
                  <li>Whether safety, self-harm, violence, children, or driving under the influence are involved</li>
                  <li>Whether your loved one has accepted or refused treatment before</li>
                  <li>What decision your family is trying to make right now</li>
                </ul>
              </div>
              <div className="mt-6 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-muted-foreground">
                If someone is in immediate danger, call 911. If there is suicidal thinking or threat of self-harm in the United States, call or text 988.
              </div>
            </aside>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl">
            <h2 className="font-serif text-3xl font-bold text-foreground">Frequently asked questions</h2>
            <div className="mt-6 grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-foreground">{faq.question}</h3>
                  <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
