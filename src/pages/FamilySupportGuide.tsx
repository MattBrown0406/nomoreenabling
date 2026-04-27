import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AdSpace from "@/components/ads/AdSpace";
import SEOHead from "@/components/seo/SEOHead";
import CoachingInterventionCTA from "@/components/CoachingInterventionCTA";

const FamilySupportGuide = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Family Support Guide — Help Without Enabling"
        description="A practical guide for families of addicts: how to support your loved one without enabling their addiction. Boundaries, communication, and self-care."
        canonicalUrl="https://nomoreenabling.com/family-support-guide"
        keywords="family support guide, addiction help, family recovery, enabling behaviors"
      />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar Ad - Desktop Only */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0 no-print">
            <div className="sticky top-24 space-y-6">
              <AdSpace size="sidebar" />
            </div>
          </aside>

          <main className="flex-1">
            <article className="max-w-4xl mx-auto print-content">
          {/* Print button */}
          <div className="flex justify-end mb-6 print:hidden">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print Guide
            </Button>
          </div>

          <header className="mb-12 text-center print-header">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 print:hidden">
              Family Support Guide
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              Family Support Guide
            </h1>
            <p className="text-xl md:text-2xl text-primary font-medium mb-4">
              A Family Support Guide for Loving Someone Struggling With Addiction
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Practical guidance for families who are exhausted, confused, and ready for change
            </p>
          </header>

          <div className="prose prose-lg max-w-none">
            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Introduction: You Are Not the Problem — But You Are Part of the System
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you are reading this, you are likely overwhelmed, afraid, and doing your best to help someone you love survive addiction. You may feel responsible, angry, guilty, or completely lost. Many families arrive here believing they have failed.
              </p>
              <p className="text-foreground font-semibold text-lg mb-4">You have not.</p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Addiction does not occur in isolation. It reshapes entire family systems — communication patterns, roles, rules, and emotional responses. This guide is not about blaming families. It is about empowering them.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-6">
                <p className="text-foreground font-medium mb-2">Helping does not mean sacrificing yourself.</p>
                <p className="text-foreground font-medium mb-2">Loving does not require enabling.</p>
                <p className="text-foreground font-medium">And change does not start with the addicted person — it starts with the family system around them.</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 1: Understanding Addiction as a Family Disorder
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Addiction is often described as an individual disease, but its impact is systemic. Families adapt in order to survive, and those adaptations — while understandable — often become part of the problem.
              </p>
              <p className="text-foreground font-medium mb-3">Common family adaptations include:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Covering up consequences</li>
                <li>Avoiding conflict to "keep the peace"</li>
                <li>Over-functioning while the addicted person under-functions</li>
                <li>Normalizing chaos</li>
                <li>Mistaking control for care</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                None of these behaviors mean you are weak or naïve. They mean you are human.
              </p>
              <p className="text-primary font-semibold italic">
                Families do not enable because they are ignorant. They enable because they love.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 2: The Difference Between Helping and Enabling
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                One of the most painful realizations for families is that love alone cannot produce recovery.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Helping</h3>
                  <p className="text-green-700 dark:text-green-400">Supports growth, responsibility, and accountability — even when it is uncomfortable.</p>
                </div>
                <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Enabling</h3>
                  <p className="text-red-700 dark:text-red-400">Protects addiction from consequences — often unintentionally — and delays change.</p>
                </div>
              </div>
              <p className="text-foreground font-medium mb-3">A simple filter to use:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Does this action reduce my loved one's discomfort without requiring growth?</li>
                <li>Does it protect them from consequences they need to experience?</li>
                <li>Does it cost me my peace, safety, or integrity?</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If the answer is yes, it may be enabling — even if your intentions are loving.
              </p>
              <p className="text-primary font-semibold italic">
                This is not about punishment. It is about reality.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 3: Why Boundaries Feel So Hard (And Why They Matter)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Boundaries are often misunderstood as ultimatums or punishments. In truth, boundaries are not about controlling someone else's behavior — they are about clarifying your own.
              </p>
              <div className="bg-secondary p-6 rounded-lg my-6">
                <p className="text-foreground font-medium">A boundary answers one question:</p>
                <p className="text-primary text-lg font-semibold mt-2">"What will I do to take care of myself if this behavior continues?"</p>
              </div>
              <p className="text-foreground font-medium mb-3">Common fears families have about boundaries:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>"If I stop helping, they'll die."</li>
                <li>"They'll hate me."</li>
                <li>"I'm being selfish."</li>
                <li>"I'll destroy the relationship."</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In reality, boundaries are often the first honest moment in a relationship that addiction has distorted.
              </p>
              <p className="text-primary font-semibold italic">
                Boundaries are not powered by anger. They are powered by clarity.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 4: Requests, Ultimatums, and Boundaries — Know the Difference
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Families often confuse these three concepts, which leads to frustration and repeated breakdowns.
              </p>
              <div className="grid md:grid-cols-3 gap-4 my-6">
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Requests</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Ask for change</li>
                    <li>• No consequence if ignored</li>
                    <li>• Often repeated endlessly</li>
                  </ul>
                </div>
                <div className="bg-secondary p-6 rounded-lg">
                  <h3 className="font-semibold text-foreground mb-3">Ultimatums</h3>
                  <ul className="text-muted-foreground text-sm space-y-1">
                    <li>• Attempt to force behavior</li>
                    <li>• Often delivered emotionally</li>
                    <li>• Frequently collapse when challenged</li>
                  </ul>
                </div>
                <div className="bg-primary/10 p-6 rounded-lg border border-primary/30">
                  <h3 className="font-semibold text-primary mb-3">Boundaries</h3>
                  <ul className="text-foreground text-sm space-y-1">
                    <li>• Clearly stated</li>
                    <li>• Behavior-focused, not character-focused</li>
                    <li>• Followed through regardless of reaction</li>
                  </ul>
                </div>
              </div>
              <p className="text-primary font-semibold italic">
                Boundaries do not require agreement. They require consistency.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 5: Common Family Traps That Keep Addiction in Place
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Most families fall into predictable patterns. Awareness is the first step out.
              </p>
              <p className="text-foreground font-medium mb-3">Some common traps include:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Waiting for the "right time" to speak up</li>
                <li>Believing one more sacrifice will fix things</li>
                <li>Letting guilt replace discernment</li>
                <li>Confusing calm periods with recovery</li>
                <li>Centering every decision around avoiding a crisis</li>
              </ul>
              <p className="text-primary font-semibold italic">
                Addiction thrives in ambiguity. Clarity disrupts it.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 6: What You Can Control — And What You Can't
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Families often burn themselves out trying to manage what is not theirs to manage.
              </p>
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div className="bg-red-50 dark:bg-red-950/30 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="font-semibold text-red-800 dark:text-red-300 mb-3">You cannot:</h3>
                  <ul className="text-red-700 dark:text-red-400 space-y-2">
                    <li>• Make someone want recovery</li>
                    <li>• Control their honesty</li>
                    <li>• Prevent every consequence</li>
                    <li>• Love addiction away</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">You can:</h3>
                  <ul className="text-green-700 dark:text-green-400 space-y-2">
                    <li>• Change how you respond</li>
                    <li>• Decide what you will tolerate</li>
                    <li>• Protect children and vulnerable family members</li>
                    <li>• Stop participating in denial</li>
                    <li>• Seek support for yourself</li>
                  </ul>
                </div>
              </div>
              <p className="text-primary font-semibold italic">
                Recovery is not contagious. But clarity is.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 7: Taking Notes From the Family System — Not Just the Addicted Person
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                One of the most overlooked tools families have is observation.
              </p>
              <p className="text-foreground font-medium mb-3">Pay attention to:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>How addiction dictates family schedules</li>
                <li>Who absorbs the emotional fallout</li>
                <li>Who speaks the truth — and who stays silent</li>
                <li>What happens when limits are suggested</li>
                <li>How quickly focus returns to the addicted person after conflict</li>
              </ul>
              <p className="text-primary font-semibold italic">
                These patterns matter more than promises.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 8: Why Families Need Support Too
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Trying to navigate addiction alone is not strength — it is isolation.
              </p>
              <p className="text-foreground font-medium mb-3">Families need:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Education that reduces shame</li>
                <li>Language that replaces blame</li>
                <li>Support from people who understand addiction</li>
                <li>Guidance that prioritizes safety and sustainability</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are allowed to get help even if your loved one refuses it.
              </p>
              <p className="text-primary font-semibold italic">
                In fact, family change often precedes individual change.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 9: Signs It May Be Time for Professional Guidance
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Professional help does not mean failure. It means escalation when informal strategies no longer work.
              </p>
              <p className="text-foreground font-medium mb-3">Consider professional support if:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                <li>Boundaries consistently collapse</li>
                <li>Threats of self-harm are present</li>
                <li>Violence, driving under the influence, or child endangerment exists</li>
                <li>The family is emotionally paralyzed</li>
                <li>You are afraid of what will happen next</li>
              </ul>
              <p className="text-primary font-semibold italic">
                Waiting rarely improves these situations. Preparation does.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6 border-b border-border pb-3">
                Section 10: A Grounding Reminder for Families
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Addiction convinces families that urgency equals effectiveness. It does not.
              </p>
              <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-lg my-6">
                <p className="text-foreground font-medium mb-2">Calm, clarity, and consistency change systems.</p>
                <p className="text-foreground font-medium mb-2">Chaos maintains them.</p>
                <p className="text-foreground font-medium mb-2">You are not giving up.</p>
                <p className="text-foreground font-medium">You are growing up the system.</p>
              </div>
              <p className="text-primary font-semibold text-lg">
                And that matters more than you know.
              </p>
            </section>

            <section className="mb-12 bg-secondary p-8 rounded-lg">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-6">
                Next Steps
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If this guide resonated with you, consider:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                <li>Joining a family support community</li>
                <li>Learning structured boundary frameworks</li>
                <li>Scheduling a family consultation</li>
                <li>Continuing education through NoMoreEnabling.com</li>
              </ul>
              <p className="text-primary font-semibold italic">
                Change does not require perfection. It requires honesty, support, and follow-through.
              </p>
            </section>

            <section className="mb-12">
              <CoachingInterventionCTA variant="compact" />
            </section>

            <section className="text-center border-t border-border pt-8">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-4">
                About No More Enabling
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                No More Enabling exists to help families stop carrying what addiction has placed on them and start responding in ways that support real change — with compassion, structure, and clarity.
              </p>
            </section>
          </div>
        </article>
      </main>

          {/* Right Sidebar Ad - Desktop Only */}
          <aside className="hidden xl:block w-[160px] flex-shrink-0 no-print">
            <div className="sticky top-24 space-y-6">
              <AdSpace size="sidebar" />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FamilySupportGuide;
