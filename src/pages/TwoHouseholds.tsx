import { Link } from "react-router-dom";
import { ArrowRight, Home, MessageSquareOff, Phone, ShieldAlert, Wallet } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import { Button } from "@/components/ui/button";
import PhoneCallButton from "@/components/PhoneCallButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { withOwnedUtm } from "@/lib/ownedLinks";

const freedomHref = withOwnedUtm("https://freedominterventions.com/from-no-more-enabling", {
  medium: "page",
  campaign: "two_households",
});

const soberHelplineHref = withOwnedUtm("https://soberhelpline.com/from-no-more-enabling", {
  medium: "page",
  campaign: "two_households",
});

const threeLines = [
  {
    title: "Money",
    icon: Wallet,
    body: "If one house pays the bill and the other will not, the loved one will live where the money still moves. Rent, phones, cars, court costs, and “just this once” are the same line — or they are not a line.",
  },
  {
    title: "Housing",
    icon: Home,
    body: "A spare key, a couch, a weekend, a “they can stay here so the kids aren’t in the middle” is housing. If one kitchen is closed and the other is open, the disease has an address.",
  },
  {
    title: "Contact",
    icon: Phone,
    body: "Texts, rides, late-night check-ins, and using the kids as a reason to stay available are contact. The disease uses whichever parent still answers.",
  },
];

const enablingLooksLike = [
  {
    title: "One pays the phone. The other stays out of it.",
    body: "The bill still gets paid. The loved one still has a line. “I don’t want to fight with their other parent” is how the rescue stays invisible.",
  },
  {
    title: "One says no car. The other hands over the spare.",
    body: "Pickup still happens. Work still gets covered. The limit did not hold. It moved to the other driveway.",
  },
  {
    title: "One says no overnight. The other says yes.",
    body: "It gets framed as protecting the kids. The kids did not ask to be the reason the door opened. The disease did.",
  },
  {
    title: "Court-order language used as cover for a bailout.",
    body: "“I have to” can be real custody. It can also be a way to keep paying, housing, or driving without naming it as enabling. Name which one you are doing.",
  },
];

const notTonight = [
  "Do not send the kids with a message for the other parent.",
  "Do not match their rescue so you do not look like the mean one.",
  "Do not have the 11pm argument about who caused this.",
  "Do not wire the money because they are now on your porch.",
];

const yourPart = [
  {
    title: "Money",
    prompt: "Write one sentence you will hold even if the other house will not. What you will pay. What you will not.",
  },
  {
    title: "Housing",
    prompt: "Write one sentence. Keys, couch, weekends, “just tonight.” What is closed in your house.",
  },
  {
    title: "Contact",
    prompt: "Write one sentence. Calls, rides, using the kids as a reason to stay available. What you will still do, and what stops.",
  },
];

const faqs = [
  {
    question: "What if the other parent is still paying rent or handing over the keys?",
    answer:
      "Two houses. One disease. If one parent pays rent and the other hands over the keys, nothing holds. You cannot control the other kitchen. You can stop being the second rescue. Money, housing, and contact have to be the same line in both houses, or the loved one will live where the rescue is.",
  },
  {
    question: "Is this a custody issue or an enabling issue?",
    answer:
      "Divorced, separated, or never-married parents are a real case type, not a footnote. Custody language can be real. It can also be cover for a bailout. If one house is secretly undoing the other, that is how enabling works when there are two kitchens. This is not about who is the good parent. The disease uses the gap.",
  },
  {
    question: "Should I send the kids to talk to the other parent?",
    answer:
      "No. Kids are not messengers and not the reason to cave. Do not put them in the middle of the 11pm argument or use them to carry a boundary the adults will not hold.",
  },
];

export default function TwoHouseholds() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="The Other House Is Undoing It"
        description="Two houses. One disease. If one parent pays rent and the other hands over the keys, nothing holds. Money, housing, and contact have to be the same line in both kitchens."
        canonicalUrl="https://nomoreenabling.com/two-households"
        keywords="divorced parents addiction, split household enabling, two households addiction, separated parents boundaries, never-married parents enabling"
      />
      <FAQJsonLd faqs={faqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Start Here", url: "https://nomoreenabling.com/start-here" },
          { name: "Two Households", url: "https://nomoreenabling.com/two-households" },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <div className="max-w-4xl">
              <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Home className="h-4 w-4" />
                Two households
              </span>
              <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                The other house is undoing it.
              </h1>
              <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
                You held the line. They paid the rent, handed over the keys, or said “just this weekend.” That is not a custody issue first. That is how enabling works when there are two kitchens.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg">
                  <Link to="/start-here">
                    Start here / find the next step
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <PhoneCallButton
                  source="two_households_hero"
                  size="lg"
                  variant="outline"
                  label="Call 458-298-8002"
                />
                <WhatsAppButton
                  source="two_households_hero"
                  size="lg"
                  variant="outline"
                  className="border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                  label="WhatsApp"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mb-8 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">The three lines</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
              Money. Housing. Contact.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Two houses. One disease. If those three do not match, the loved one will live where the rescue is. Divorced, separated, or never-married parents are a real case type, not a footnote. One house cannot secretly undo the other.
            </p>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              This is not about who is the “good” parent. Fear, guilt, and “I don’t want the kids to suffer” are how the gap stays open. The disease uses the gap.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {threeLines.map((line) => {
              const Icon = line.icon;
              return (
                <article key={line.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-foreground">{line.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{line.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Across two houses</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                What enabling looks like when there are two kitchens
              </h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                The other parent is not the villain in this story. The gap is. Name the pattern without turning it into a custody fight.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {enablingLooksLike.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="font-serif text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Tonight</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                What not to do tonight
              </h2>
              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                Kids are not messengers and not the reason to cave. Hold your house. Do not spend the night trying to win the other one.
              </p>
              <ul className="mt-6 space-y-3">
                {notTonight.map((item) => (
                  <li key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-5">
                    <MessageSquareOff className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-foreground">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
            <aside className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <ShieldAlert className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-serif text-xl font-bold text-foreground">If it is danger</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                If someone is in immediate danger, call 911. If this is a suicidal crisis in the United States, call or text 988. This page is education. It is not a crisis line.
              </p>
            </aside>
          </div>
        </section>

        <section className="border-y border-border bg-secondary/20 py-12">
          <div className="container mx-auto px-4">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Your part</p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
                You cannot control the other house
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                You can stop being the second rescue. Write the three lines you will hold even if they will not. One sentence each.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {yourPart.map((item) => (
                <article key={item.title} className="rounded-2xl border border-border bg-background p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary">{item.title}</p>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{item.prompt}</p>
                </article>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link to="/start-here">
                  Start here / find the next step
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl rounded-2xl border border-border bg-card p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">If it is past education</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">
              When the split is now a safety or refusal case
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If treatment is being refused and the two-house gap is now a safety or refusal case, Freedom Interventions is the structured path. Sober Helpline is free live support.
            </p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline">
                <a href={freedomHref} target="_blank" rel="noreferrer">
                  Freedom Interventions
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={soberHelplineHref} target="_blank" rel="noreferrer">
                  Sober Helpline
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
