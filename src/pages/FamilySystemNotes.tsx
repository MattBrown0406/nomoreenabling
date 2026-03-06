import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Eye, MessageCircle, Users, Scale, Brain, Thermometer, ArrowRight, Lightbulb } from "lucide-react";
import AdSpace from "@/components/ads/AdSpace";
import SEOHead from "@/components/seo/SEOHead";

const FamilySystemNotes = () => {
  const handlePrint = () => {
    window.print();
  };

  const observationAreas = [
    {
      number: 1,
      title: "Communication Patterns",
      icon: MessageCircle,
      intro: "Notice:",
      items: [
        "Who speaks honestly and who stays silent",
        "How conflict is avoided or escalated",
        "Whether problems are discussed openly or indirectly"
      ],
      insight: "Silence and overreaction are often two sides of the same adaptation."
    },
    {
      number: 2,
      title: "Roles That Have Formed",
      icon: Users,
      intro: "In families affected by addiction, roles often emerge:",
      items: [
        "The fixer",
        "The peacekeeper",
        "The protector",
        "The truth-teller",
        "The invisible one"
      ],
      insight: "These roles help families survive—but they can also keep the system stuck."
    },
    {
      number: 3,
      title: "How Consequences Are Managed",
      icon: Scale,
      intro: "Ask:",
      items: [
        "Who absorbs the fallout of addiction?",
        "Who shields the addicted person from consequences?",
        "What happens when limits are suggested?"
      ],
      insight: "Patterns around consequences reveal more than promises ever will."
    },
    {
      number: 4,
      title: "Decision-Making Under Pressure",
      icon: Brain,
      intro: "Pay attention to how decisions are made:",
      items: [
        "Are they driven by fear?",
        "Are they rushed to prevent discomfort?",
        "Are they consistent—or constantly renegotiated?"
      ],
      insight: "Urgency often disguises avoidance."
    },
    {
      number: 5,
      title: "Emotional Climate",
      icon: Thermometer,
      intro: "Notice the emotional tone of the household:",
      items: [
        "Hypervigilance",
        "Chronic tension",
        "Emotional numbness",
        "Explosive conflict followed by silence"
      ],
      insight: "The emotional climate tells the story addiction won't."
    }
  ];

  const discoveries = [
    "They are working harder than the addicted person",
    "Their efforts have replaced natural consequences",
    "Fear has replaced clarity",
    "Love has become transactional"
  ];

  const observationBenefits = [
    "Respond rather than react",
    "Identify leverage points",
    "Stop negotiating in the dark",
    "Make decisions based on patterns, not hope"
  ];

  const nextStepsBenefits = [
    "Decide where boundaries are needed",
    "Identify when support is required",
    "Align family members around reality",
    "Stop reacting to every crisis"
  ];

  return (
    <>
      <SEOHead
        title="Family System Notes — How Addiction Changes Families"
        description="Understand how addiction restructures your entire family system. Roles shift, communication breaks down, and enabling becomes the norm. Here's what to know."
        canonicalUrl="https://nomoreenabling.com/family-system-notes"
        keywords="family system patterns, addiction observation, family dynamics"
      />
      
      <div className="min-h-screen bg-background print-content">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Left Sidebar Ad - Desktop Only */}
            <aside className="hidden xl:block w-[160px] flex-shrink-0 no-print">
              <div className="sticky top-24 space-y-6">
                <AdSpace size="sidebar" />
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
              Taking Notes From the Family System
            </h1>
            <p className="text-lg text-muted-foreground mb-2">Not Just the Addicted Person</p>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground mt-6">
              <p>
                When addiction is present, families naturally focus their attention on the person using substances—their behavior, their choices, their promises, their setbacks. While this focus is understandable, it often obscures something just as important: the family system that has adapted around the addiction.
              </p>
              <p className="text-xl font-medium text-primary">
                Change rarely begins with the addicted individual alone. It begins when families start paying attention to patterns.
              </p>
            </div>
          </div>

          {/* Addiction Reveals Systems */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Addiction Reveals Systems, Not Just Symptoms
              </h2>
              <p className="text-muted-foreground mb-4">
                Addiction does not exist in a vacuum. It alters how families communicate, make decisions, manage emotions, and respond to stress. Over time, these adaptations become normalized.
              </p>
              <p className="text-foreground font-medium mb-3">
                Instead of asking only, "Why won't they change?" families benefit from asking:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p className="text-foreground italic">How has addiction reshaped our family rules?</p>
                <p className="text-foreground italic">What behaviors are rewarded or avoided?</p>
                <p className="text-foreground italic">Who carries the emotional weight?</p>
                <p className="text-foreground italic">Who is protected from consequences?</p>
              </div>
              <p className="text-primary font-medium mt-4">
                These questions shift the focus from blame to insight.
              </p>
            </CardContent>
          </Card>

          {/* What to Observe */}
          <div className="mb-8">
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2 text-center">
              What to Observe in the Family System
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Families do not need to diagnose or confront. They need to observe.
            </p>
            
            <div className="space-y-4">
              {observationAreas.map((area) => {
                const IconComponent = area.icon;
                return (
                  <Card key={area.number}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {area.number}. {area.title}
                          </h3>
                          <p className="text-muted-foreground mb-2">{area.intro}</p>
                          <ul className="space-y-1 mb-3">
                            {area.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-foreground">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                                {item}
                              </li>
                            ))}
                          </ul>
                          <p className="text-sm bg-muted/50 p-3 rounded-lg italic text-foreground/80">
                            {area.insight}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Why This Matters */}
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Why This Matters More Than Monitoring Use
              </h2>
              <p className="text-muted-foreground mb-4">
                Families often track substance use obsessively—days sober, slips, promises, explanations. While these details feel important, they are often unreliable indicators of real change.
              </p>
              <p className="text-lg font-medium text-primary mb-4">
                Systems change before behavior does.
              </p>
              <p className="text-foreground mb-3">When the family system shifts:</p>
              <div className="grid md:grid-cols-2 gap-2">
                {["Enabling decreases", "Boundaries strengthen", "Communication clarifies", "Chaos reduces"].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-foreground">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-muted-foreground mt-4 font-medium">
                These changes create conditions where recovery becomes possible.
              </p>
            </CardContent>
          </Card>

          {/* Observation Without Judgment */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Observation Without Judgment
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Taking notes does not mean confronting, accusing, or controlling. It means gathering information without reacting immediately.
                  </p>
                  <p className="text-foreground font-medium mb-3">Observation allows families to:</p>
                  <ul className="space-y-2 mb-4">
                    {observationBenefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <p className="text-primary font-medium text-lg">
                    Patterns are honest. They don't argue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What Families Discover */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    What Families Often Discover
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    When families step back and observe, they often notice:
                  </p>
                  <ul className="space-y-2 mb-4">
                    {discoveries.map((discovery, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-foreground">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        {discovery}
                      </li>
                    ))}
                  </ul>
                  <p className="text-muted-foreground italic">
                    These realizations are painful—but powerful.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Using Observation */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Using Observation to Inform Next Steps
              </h2>
              <p className="text-muted-foreground mb-4">
                The purpose of observation is not paralysis. It is preparation.
              </p>
              <p className="text-foreground font-medium mb-3">Taking notes helps families:</p>
              <ul className="space-y-2 mb-4">
                {nextStepsBenefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-primary flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
              <p className="text-primary font-medium text-lg">
                Clarity creates movement.
              </p>
            </CardContent>
          </Card>

          {/* Final Reframe */}
          <Card className="mb-8 bg-secondary/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                A Final Reframe for Families
              </h2>
              <p className="text-xl font-medium text-primary mb-4">
                Addiction lies. Patterns don't.
              </p>
              <p className="text-muted-foreground mb-4">
                When families shift their attention from monitoring behavior to understanding the system, they regain agency.
              </p>
              <div className="bg-background/50 p-4 rounded-lg inline-block">
                <p className="text-foreground">You do not need perfect answers.</p>
                <p className="text-foreground font-medium">You need accurate information.</p>
              </div>
              <p className="text-muted-foreground mt-4">
                And much of that information is already visible—once you know where to look.
              </p>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Next Steps
              </h2>
              <p className="text-muted-foreground mb-4">If this resonates:</p>
              <div className="space-y-3 mb-6">
                <Link 
                  to="/helping-or-enabling" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Pair observation with boundary-setting tools
                </Link>
                <Link 
                  to="/professional-guidance-signs" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Share insights with a trusted professional
                </Link>
                <Link 
                  to="/why-families-need-support" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Continue learning about family systems and addiction
                </Link>
              </div>
              <p className="text-foreground font-medium text-center">
                Change begins when families start seeing the whole picture.
              </p>
            </CardContent>
          </Card>
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
    </>
  );
};

export default FamilySystemNotes;
