import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ConsultationRequestForm from "@/components/ConsultationRequestForm";
import { Button } from "@/components/ui/button";

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
        <section className="container mx-auto px-4 py-14 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
                Work with Matt Brown
              </span>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Family addiction coaching and intervention guidance
              </h1>
              <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl">
                When your family has read enough articles and still does not know what to do next, Matt helps you sort the pattern,
                align the family, and decide whether coaching, treatment planning, or a professional intervention is the right next step.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" asChild>
                  <a href="#consultation-form">
                    Request guidance
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/professional-guidance-signs">See signs you may need help</Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Best fit when</p>
              <div className="mt-5 space-y-4">
                {supportOptions.map((option) => (
                  <div key={option} className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-foreground">{option}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <Users className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">Coaching</h2>
              <p className="mt-3 text-muted-foreground">
                For families who need clearer language, calmer boundaries, and help deciding what belongs to them and what does not.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Shield className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">Planning</h2>
              <p className="mt-3 text-muted-foreground">
                For situations involving treatment refusal, escalating consequences, repeated relapse, or family division.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <ArrowRight className="h-8 w-8 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground mt-4">Intervention guidance</h2>
              <p className="mt-3 text-muted-foreground">
                For families who may need a structured professional intervention and want experienced guidance before acting.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="rounded-2xl border border-border bg-secondary/30 p-6 md:p-8">
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
            <ConsultationRequestForm />
            <aside className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">What makes a good first message?</h2>
              <ul className="mt-4 space-y-3 text-muted-foreground list-disc pl-5">
                <li>What substance or behavior is causing concern</li>
                <li>What your family has already tried</li>
                <li>Whether safety, self-harm, violence, children, or driving under the influence are involved</li>
                <li>Whether your loved one has accepted or refused treatment before</li>
                <li>What decision your family is trying to make right now</li>
              </ul>
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
