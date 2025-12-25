import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Printer, Pause, Heart, Shield, Sun, Users, ArrowRight } from "lucide-react";

const GroundingReminder = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>A Grounding Reminder for Families | No More Enabling</title>
        <meta name="description" content="When addiction creates urgency and fear, pause here. A grounding reminder that you are not required to solve everything today." />
      </Helmet>
      
      <div className="min-h-screen bg-background print-content">
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          {/* Print Button */}
          <div className="flex justify-end mb-6 no-print">
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Print Reminder
            </Button>
          </div>

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
              A Grounding Reminder for Families
            </h1>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p>
                When addiction is present, urgency often replaces clarity. Fear drives decisions. Exhaustion narrows perspective. Families begin reacting rather than responding.
              </p>
              <div className="flex items-center justify-center gap-2 text-primary text-lg font-medium py-4">
                <Pause className="h-5 w-5" />
                <span>Pause here.</span>
              </div>
              <p className="text-xl font-medium text-foreground">
                You are not required to solve everything today.
              </p>
            </div>
          </div>

          {/* Grounding Sections */}
          <div className="space-y-8 mb-12">
            {/* Section 1 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  What Feels Urgent Is Not Always What Matters Most
                </h2>
                <p className="text-muted-foreground mb-4">
                  Addiction creates a constant sense of emergency. Every call, every crisis, every promise can feel like the moment everything changes.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-4">
                  <p className="text-foreground font-medium">
                    Most change does not happen in moments of panic.
                  </p>
                  <p className="text-foreground">
                    It happens through consistent, grounded response over time.
                  </p>
                </div>
                <p className="text-primary font-medium text-lg">
                  You are allowed to slow down.
                </p>
              </CardContent>
            </Card>

            {/* Section 2 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  You Did Not Cause This
                </h2>
                <p className="text-muted-foreground mb-4">
                  Addiction convinces families they are responsible for outcomes they do not control. This belief leads to guilt, over-functioning, and self-abandonment.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-4">
                  <p className="text-foreground">You did not cause the addiction.</p>
                  <p className="text-foreground">You cannot control it.</p>
                  <p className="text-foreground">You cannot cure it.</p>
                </div>
                <p className="text-primary font-medium text-lg">
                  What you can do is choose how you participate going forward.
                </p>
              </CardContent>
            </Card>

            {/* Section 3 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Calm Is Not Indifference
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Remaining calm does not mean you don't care. It means you are refusing to let chaos dictate your behavior.
                    </p>
                    <p className="text-foreground font-medium mb-3">Calm creates:</p>
                    <ul className="space-y-2 text-muted-foreground mb-4">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Better decisions
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Clearer communication
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        Safer boundaries
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                        More sustainable support
                      </li>
                    </ul>
                    <p className="text-primary font-medium text-lg">
                      Calm is an act of strength.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      You Are Allowed to Take Care of Yourself
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Supporting someone with addiction does not require sacrificing your health, safety, or integrity.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-4">
                      <p className="text-foreground">Rest is not abandonment.</p>
                      <p className="text-foreground">Boundaries are not betrayal.</p>
                      <p className="text-foreground">Support for yourself is not selfish.</p>
                    </div>
                    <p className="text-primary font-medium text-lg">
                      Your well-being matters.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Sun className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Consistency Matters More Than Perfection
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Families often delay change because they fear doing it wrong.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2 mb-4">
                      <p className="text-foreground">There is no perfect response.</p>
                      <p className="text-foreground">There is only a consistent one.</p>
                    </div>
                    <p className="text-primary font-medium text-lg">
                      Small, steady shifts are more powerful than dramatic gestures.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 6 */}
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      You Are Not Alone in This
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Many families are walking this path—quietly, courageously, and imperfectly.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="text-foreground">Support exists.</p>
                      <p className="text-foreground">Education exists.</p>
                      <p className="text-foreground">Relief is possible.</p>
                    </div>
                    <p className="text-primary font-medium text-lg mt-4">
                      You do not have to figure this out by yourself.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Final Grounding Thought */}
          <Card className="mb-12 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-serif font-bold text-foreground mb-6">
                A Final Grounding Thought
              </h2>
              <div className="space-y-3 text-lg max-w-xl mx-auto">
                <p className="text-foreground">You are allowed to pause.</p>
                <p className="text-foreground">You are allowed to ask for help.</p>
                <p className="text-foreground">You are allowed to change how you respond.</p>
                <div className="pt-4 mt-4 border-t border-primary/20">
                  <p className="text-muted-foreground mb-2">
                    Even when nothing else feels stable, this remains true:
                  </p>
                  <p className="text-primary font-semibold text-xl">
                    You can choose clarity over chaos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Continue Your Journey
              </h2>
              <div className="space-y-3">
                <Link 
                  to="/helping-or-enabling" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Helping or Enabling decision tool
                </Link>
                <Link 
                  to="/why-families-need-support" 
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ArrowRight className="h-4 w-4" />
                  Why families need support too
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
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default GroundingReminder;
