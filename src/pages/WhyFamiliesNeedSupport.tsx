import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Heart, Users, Shield, Brain, Eye, Compass, ArrowRight, HandHeart, Lock } from "lucide-react";
import AdSpace from "@/components/ads/AdSpace";
import SEOHead from "@/components/seo/SEOHead";

const WhyFamiliesNeedSupport = () => {
  const handlePrint = () => {
    window.print();
  };

  const sections = [
    {
      title: "Addiction Changes the Family System",
      icon: Users,
      content: "When addiction is present, families adapt in order to survive. These adaptations may include increased vigilance, emotional suppression, role shifts, and conflict avoidance. Over time, these patterns become ingrained—not because families are dysfunctional, but because they are responding to chronic stress.",
      highlight: "Without support, families often normalize conditions that are not sustainable.",
      insight: "Support helps families recognize how addiction has altered the system and how to restore balance without escalating harm."
    },
    {
      title: "Families Carry the Emotional Weight Others Don't See",
      icon: Heart,
      content: "Family members often absorb fear, grief, anger, and responsibility quietly.",
      list: [
        "Monitor moods and substance use",
        "Anticipate crises",
        "Manage consequences behind the scenes",
        "Protect others from the impact"
      ],
      highlight: "This invisible labor comes at a cost. Chronic stress without relief increases anxiety, depression, health problems, and emotional burnout.",
      insight: "Support provides families with a place to set the weight down."
    },
    {
      title: "Love Alone Does Not Create Change",
      icon: HandHeart,
      content: "Families are often told that if they love harder, stay positive, or say the right thing, recovery will follow. This belief creates false responsibility and deep guilt when change does not occur.",
      highlight: "Addiction is not resolved through emotional intensity. It responds to clarity, consistency, and structure.",
      insight: "Support helps families move from emotional reactivity to intentional response."
    },
    {
      title: "Isolation Strengthens Addiction",
      icon: Lock,
      content: "Addiction thrives in secrecy and isolation—not just for the individual, but for the family. When families avoid talking about what is happening, they lose perspective and reinforce distorted norms.",
      highlight: "Support breaks isolation. It restores reality. It reduces shame.",
      insight: "Families who connect with informed support are less likely to enable and more likely to respond effectively."
    },
    {
      title: "Boundaries Are Difficult to Learn Alone",
      icon: Shield,
      content: "Most families were never taught how to set boundaries under high emotional pressure. In the presence of addiction, guilt, fear, and manipulation can make even clear boundaries collapse.",
      highlight: "Boundaries are skills, not instincts.",
      insight: "Support does not impose boundaries—it helps families learn how to create, communicate, and maintain them without escalating conflict or risk."
    },
    {
      title: "Families Need Help Separating What They Control From What They Don't",
      icon: Compass,
      content: "One of the greatest sources of family exhaustion is carrying responsibility for outcomes that are not within their control.",
      list: [
        "Let go of managing another person's recovery",
        "Focus on what they can influence",
        "Make decisions aligned with safety and values",
        "Stop negotiating with chaos"
      ],
      insight: "This shift alone often brings measurable relief."
    },
    {
      title: "Support Improves Outcomes—Even When the Addicted Person Resists",
      icon: Eye,
      content: "Families often hesitate to seek support because their loved one is unwilling or defensive. This hesitation is understandable—but misplaced.",
      highlight: "Family change frequently precedes individual change.",
      list: [
        "Enabling decreases",
        "Boundaries strengthen",
        "Communication becomes clearer",
        "Chaos reduces"
      ],
      insight: "These changes alter the environment in ways that make recovery more likely over time."
    },
    {
      title: "Support Is Not About Blame or Control",
      icon: Brain,
      content: "Healthy family support is not about fixing the addicted person, forcing compliance, or assigning fault. It is about understanding how systems work—and how to respond without losing oneself.",
      replacements: [
        { from: "Blame", to: "understanding" },
        { from: "Panic", to: "planning" },
        { from: "Guilt", to: "clarity" },
        { from: "Isolation", to: "connection" }
      ]
    }
  ];

  return (
    <>
      <SEOHead
        title="Why Families Need Support in Addiction Recovery"
        description="Addiction is a family disease. Here's why families need their own support, education, and recovery — not just the person who's using."
        canonicalUrl="https://nomoreenabling.com/why-families-need-support"
        keywords="family support addiction, why families need help, addiction family resources, family recovery support"
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
              Why Families Need Support Too
            </h1>
            <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground">
              <p>
                Addiction rarely affects just one person. It reshapes entire families—emotionally, relationally, and psychologically. Yet families are often expected to remain strong, patient, and self-sacrificing while navigating circumstances that would overwhelm almost anyone.
              </p>
              <p className="text-xl font-medium text-primary">
                Support for families is not optional. It is essential.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8 mb-12">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-foreground mb-3">
                          {section.title}
                        </h2>
                        <p className="text-muted-foreground mb-3">
                          {section.content}
                        </p>
                        
                        {section.list && (
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-3 ml-4">
                            {section.list.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        )}

                        {section.replacements && (
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            {section.replacements.map((rep, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground line-through">{rep.from}</span>
                                <ArrowRight className="h-3 w-3 text-primary" />
                                <span className="text-foreground font-medium">{rep.to}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {section.highlight && (
                          <p className="text-foreground font-medium mb-3">
                            {section.highlight}
                          </p>
                        )}
                        
                        {section.insight && (
                          <p className="text-sm bg-muted/50 p-3 rounded-lg italic text-foreground/80">
                            {section.insight}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Final Word */}
          <Card className="mb-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                A Final Word to Families
              </h2>
              <div className="space-y-4 text-lg max-w-2xl mx-auto">
                <p className="text-foreground">
                  Needing support does not mean you are weak.
                </p>
                <p className="text-muted-foreground">
                  It means you are facing something that was never meant to be handled alone.
                </p>
                <p className="text-muted-foreground">
                  Addiction is a complex, long-term stressor. Families deserve care, education, and relief—regardless of where their loved one is in the process.
                </p>
                <p className="text-primary font-semibold text-xl mt-6">
                  Supporting families is not secondary to recovery.<br />
                  It is foundational.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Explore More Resources
              </h2>
              <div className="space-y-3">
                <Link 
                  to="/helping-or-enabling" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Use our Helping or Enabling decision tool
                </Link>
                <Link 
                  to="/professional-guidance-signs" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Signs it may be time for professional guidance
                </Link>
                <Link 
                  to="/family-support-guide" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Complete Family Support Guide
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground text-center">
            This guide is educational and does not replace professional advice. It is designed to help families understand the importance of seeking their own support.
          </p>
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

export default WhyFamiliesNeedSupport;
