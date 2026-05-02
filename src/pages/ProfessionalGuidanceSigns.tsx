import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, AlertTriangle, Users, Heart, Shield, Brain, MessageCircle, HelpCircle, Clock, ArrowRight } from "lucide-react";
import AdSpace from "@/components/ads/AdSpace";
import SEOHead from "@/components/seo/SEOHead";
import CoachingInterventionCTA from "@/components/CoachingInterventionCTA";
import FAQJsonLd from "@/components/seo/FAQJsonLd";

const professionalGuidanceFaqs = [
  {
    question: "When should a family call an addiction interventionist?",
    answer:
      "Families should consider an interventionist when informal conversations, promises, and consequences keep repeating without change, especially when treatment is refused, risk is escalating, or the family cannot stay aligned.",
  },
  {
    question: "Is professional guidance only for a formal intervention?",
    answer:
      "No. Professional guidance can help with family alignment, boundary planning, safety concerns, treatment decisions, and deciding whether a formal intervention is appropriate.",
  },
  {
    question: "What if our loved one is not ready for help?",
    answer:
      "Families can still get guidance. A professional can help the family stop reinforcing the pattern, prepare for treatment opportunities, and respond more consistently when resistance shows up.",
  },
];

const ProfessionalGuidanceSigns = () => {
  const handlePrint = () => {
    window.print();
  };

  const signs = [
    {
      number: 1,
      title: "The Same Conversations Keep Repeating Without Change",
      icon: MessageCircle,
      content: "If you find yourselves having the same emotional conversations—promises, apologies, arguments, ultimatums—over and over with no sustained improvement, the issue is no longer motivation or communication.",
      insight: "Repetition without progress is a sign that the family system is stuck. Professional guidance helps interrupt these loops and introduce structure where emotion has taken over."
    },
    {
      number: 2,
      title: "Boundaries Are Identified but Not Held",
      icon: Shield,
      content: "Many families intellectually understand the need for boundaries but struggle to implement or maintain them.",
      warningList: [
        "Boundaries being stated and then softened",
        "Consequences being threatened but not followed through",
        "Decisions being reversed under pressure, guilt, or fear",
        "One family member holding boundaries while others undermine them"
      ],
      insight: "This does not mean boundaries are wrong. It means the family needs support learning how to set and sustain them safely."
    },
    {
      number: 3,
      title: "Safety Has Become a Concern",
      icon: AlertTriangle,
      content: "Professional guidance is strongly recommended when any of the following are present:",
      warningList: [
        "Threats or attempts of self-harm",
        "Driving under the influence",
        "Physical aggression or intimidation",
        "Child endangerment",
        "Unsafe living conditions"
      ],
      insight: "When safety is compromised, families should not attempt to manage the situation alone. These scenarios require experienced assessment and planning.",
      urgent: true
    },
    {
      number: 4,
      title: "The Family Is Organizing Around the Addiction",
      icon: Users,
      content: "A major indicator that professional support is needed is when addiction becomes the organizing force of the household.",
      warningList: [
        "Schedules revolving around substance use or recovery promises",
        "Other relationships being neglected",
        "Siblings or partners adapting to avoid conflict",
        "Family decisions being made to prevent emotional blowups"
      ],
      insight: "When addiction dictates the rules, outside perspective is often necessary to restore balance."
    },
    {
      number: 5,
      title: "Emotional Exhaustion or Burnout Is Setting In",
      icon: Heart,
      content: "Families often normalize levels of stress that are unsustainable.",
      warningList: [
        "Chronic anxiety or hypervigilance",
        "Difficulty sleeping",
        "Emotional numbness",
        "Loss of hope or motivation",
        "Feeling responsible for outcomes you cannot control"
      ],
      insight: "Professional support is not just for the addicted individual—it is often most needed by the family."
    },
    {
      number: 6,
      title: "Manipulation, Gaslighting, or Chronic Dishonesty Are Present",
      icon: Brain,
      content: "Addiction frequently distorts communication. Families may begin questioning their own judgment, minimizing concerns, or doubting what they see and hear.",
      insight: "If dishonesty has become the norm and trust has eroded, professional guidance can help families regain clarity and respond without escalating conflict or confusion."
    },
    {
      number: 7,
      title: "The Family Is Divided",
      icon: Users,
      content: "When families split into opposing camps—those who want to \"hold the line\" and those who want to \"keep the peace\"—progress becomes nearly impossible.",
      insight: "Division weakens boundaries and increases resentment. A neutral professional can help align the family around shared goals and consistent responses."
    },
    {
      number: 8,
      title: "You Are Afraid of What Will Happen Next",
      icon: HelpCircle,
      content: "This is one of the clearest indicators.",
      insight: "If your decisions are driven primarily by fear—fear of overdose, fear of violence, fear of abandonment, fear of regret—it may be time to stop navigating alone. Fear narrows options. Guidance expands them.",
      urgent: true
    },
    {
      number: 9,
      title: "Waiting Feels Like the Only Plan",
      icon: Clock,
      content: "Hope is not a strategy. If your current plan is to:",
      warningList: [
        "Wait for motivation",
        "Wait for consequences to \"work\"",
        "Wait for them to hit bottom",
        "Wait for the next crisis"
      ],
      insight: "Professional guidance can help families move from passive waiting to active, intentional planning."
    }
  ];

  const guidanceProvides = [
    "Education and clarity",
    "Family alignment",
    "Boundary development",
    "Safety planning",
    "Decision support",
    "Reducing chaos and emotional reactivity"
  ];

  return (
    <>
      <SEOHead
        title="Signs You Need Professional Help for Addiction"
        description="When is it time to call a professional? Recognize the signs that your family needs expert guidance to deal with addiction effectively."
        canonicalUrl="https://nomoreenabling.com/professional-guidance-signs"
        keywords="professional addiction help, when to seek help, family intervention signs"
      />
      <FAQJsonLd faqs={professionalGuidanceFaqs} />
      
      <div className="min-h-screen bg-background print-content">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar Ad - Desktop Only */}
            <aside className="hidden xl:block w-[160px] flex-shrink-0 no-print">
              <div className="sticky top-24 space-y-6">
                <AdSpace size="sidebar" placementKey="evergreen_sidebar" />
              </div>
            </aside>

            <main className="flex-1 max-w-4xl mx-auto">
          {/* Print Button */}
          <div className="flex justify-end mb-6 no-print">
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Guide
            </Button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              Signs It May Be Time for Professional Guidance
            </h1>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p>
                Families often wait far longer than they should to seek professional support—not because they are in denial, but because they are hopeful, loyal, and trying to avoid making the situation worse. Unfortunately, waiting rarely creates clarity. More often, it allows addiction to further entrench itself in the family system.
              </p>
              <p className="font-medium text-foreground">
                Professional guidance is not a last resort. It is an appropriate next step when informal strategies are no longer producing change.
              </p>
              <p>
                Below are indicators that it may be time to bring in experienced, outside support.
              </p>
            </div>
          </div>

          {/* Signs Section */}
          <div className="space-y-6 mb-12">
            {signs.map((sign) => {
              const IconComponent = sign.icon;
              return (
                <Card 
                  key={sign.number} 
                  className={`${sign.urgent ? 'border-destructive/50 bg-destructive/5' : ''}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${sign.urgent ? 'bg-destructive/20 text-destructive' : 'bg-primary/10 text-primary'}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                          {sign.number}. {sign.title}
                        </h2>
                        <p className="text-muted-foreground mb-3">
                          {sign.content}
                        </p>
                        {sign.warningList && (
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3 ml-4">
                            {sign.warningList.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}
                        <p className="text-sm bg-muted/50 p-3 rounded-lg italic text-foreground/80">
                          {sign.insight}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* What Professional Guidance Provides */}
          <Card className="mb-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                What Professional Guidance Actually Provides
              </h2>
              <p className="text-muted-foreground mb-6">
                Families often hesitate because they fear being pushed into something extreme or confrontational. In reality, effective professional guidance focuses on:
              </p>
              <div className="grid md:grid-cols-2 gap-3 mb-6">
                {guidanceProvides.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground font-medium">
                It is not about forcing outcomes. It is about changing conditions.
              </p>
            </CardContent>
          </Card>

          {/* Final Reframe */}
          <Card className="mb-12 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                A Final Reframe for Families
              </h2>
              <div className="space-y-4 text-lg">
                <p className="text-foreground">
                  Seeking professional guidance does not mean you have failed.
                </p>
                <p className="text-muted-foreground">
                  It means you have recognized that love alone is not enough—and that structure, experience, and support matter.
                </p>
                <p className="text-primary font-semibold">
                  Families often change first.<br />
                  And when they do, outcomes change too.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                Next Steps
              </h2>
              <p className="text-muted-foreground mb-6">
                If several of these signs resonate:
              </p>
              <div className="space-y-3 mb-6">
                <Link 
                  to="/family-support-guide" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Learn more about family-centered support options
                </Link>
                <Link 
                  to="/helping-or-enabling" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Use our Helping or Enabling decision tool
                </Link>
                <Link 
                  to="/articles" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Continue education through our articles
                </Link>
              </div>
              <p className="text-foreground font-medium text-center mt-8 text-lg">
                You do not need to wait for things to get worse to justify getting help.
              </p>
            </CardContent>
          </Card>

          <div className="mb-12">
            <CoachingInterventionCTA variant="compact" />
          </div>

          <Card className="mb-12">
            <CardContent className="p-8">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-5">
                Questions Families Ask Before Calling
              </h2>
              <div className="space-y-4">
                {professionalGuidanceFaqs.map((faq) => (
                  <div key={faq.question} className="rounded-lg border border-border bg-background p-4">
                    <h3 className="font-semibold text-foreground">{faq.question}</h3>
                    <p className="mt-2 text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            This guide is educational and does not replace professional advice. It is designed to support families in recognizing when outside support may be beneficial.
          </p>
        </main>

            {/* Right Sidebar Ad - Desktop Only */}
            <aside className="hidden xl:block w-[160px] flex-shrink-0 no-print">
              <div className="sticky top-24 space-y-6">
                <AdSpace size="sidebar" placementKey="evergreen_sidebar" />
              </div>
            </aside>
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
};

export default ProfessionalGuidanceSigns;
