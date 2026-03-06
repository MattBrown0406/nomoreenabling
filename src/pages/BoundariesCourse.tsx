import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Mail, ArrowRight, Flame } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const lessons = [
  {
    number: 1,
    title: "Why Boundaries Feel Like Abandonment (But Aren't)",
    description: "Understanding why setting limits triggers guilt—and why that guilt is misleading.",
  },
  {
    number: 2,
    title: "The Difference Between Boundaries and Ultimatums",
    description: "One tries to control them. The other protects you. Learn to tell them apart.",
  },
  {
    number: 3,
    title: "What Boundaries Actually Protect",
    description: "It's not just about you. Boundaries protect the relationship—and their opportunity to change.",
  },
  {
    number: 4,
    title: "Holding Boundaries When It Hurts",
    description: "The hardest part isn't setting boundaries. It's keeping them when everything pushes back.",
  },
];

const BoundariesCourse = () => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('course-enroll', {
        body: { 
          email, 
          first_name: firstName || null,
          course_name: 'boundaries'
        },
      });

      if (error) throw error;

      if (data?.error === 'already_enrolled') {
        toast({
          title: "Already enrolled",
          description: "You're already enrolled in this course. Check your email for lessons!",
        });
      } else {
        setIsEnrolled(true);
        toast({
          title: "You're enrolled!",
          description: "Check your email for a welcome message. Your first lesson arrives in one week.",
        });
      }
    } catch (error) {
      console.error('Enrollment error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHead
        title="Boundaries Course — Learn to Set Healthy Limits"
        description="A structured course on setting and maintaining healthy boundaries with an addicted loved one. Stop enabling, start recovering — even if they don't."
        canonicalUrl="https://nomoreenabling.com/boundaries-course"
        keywords="boundaries addiction, enabling family, codependency course, setting boundaries, addiction family support"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Course",
          "name": "Boundaries Course — Setting Healthy Limits in Addiction",
          "description": "Learn to set and maintain healthy boundaries with an addicted loved one. A structured course for families ready to stop enabling.",
          "provider": {
            "@type": "Organization",
            "name": "No More Enabling",
            "url": "https://nomoreenabling.com"
          },
          "url": "https://nomoreenabling.com/boundaries-course",
          "isAccessibleForFree": true
        })}</script>
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          {/* Hero Section */}
          <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Mail className="w-4 h-4" />
                  Free 4-Week Email Course
                </div>
                
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Boundaries: Removing the Oxygen from the Fire of Addiction
                </h1>
                
                <p className="text-lg md:text-xl text-muted-foreground mb-8">
                  A weekly email series that helps families understand what boundaries really are, 
                  why they feel so hard to set, and how to hold them—even when it hurts.
                </p>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <span>4 lessons over 4 weeks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Delivered to your inbox</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-primary" />
                    <span>100% free</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Enrollment Form */}
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-md mx-auto">
                {isEnrolled ? (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-8 pb-6 text-center">
                      <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                      <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
                        You're In!
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Check your email for a welcome message. Your first lesson arrives in one week.
                      </p>
                      <Link to="/articles">
                        <Button variant="outline">
                          Read Articles While You Wait
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="font-serif text-xl font-bold text-foreground mb-4 text-center">
                        Start Learning Today
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <Input
                            type="text"
                            placeholder="First name (optional)"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Input
                            type="email"
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Enrolling..." : "Enroll for Free"}
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                          We respect your privacy. Unsubscribe anytime.
                        </p>
                      </form>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </section>

          {/* Course Outline */}
          <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                  What You'll Learn
                </h2>
                
                <div className="space-y-6">
                  {lessons.map((lesson) => (
                    <Card key={lesson.number} className="overflow-hidden">
                      <CardContent className="p-6 flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-serif text-xl font-bold text-primary">
                            {lesson.number}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {lesson.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Who This Is For */}
          <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-8 text-center">
                  This Course Is For You If...
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "You've been told to 'set boundaries' but don't know what that actually means",
                    "You feel guilty every time you say no—even when you know you should",
                    "You've tried ultimatums and they haven't worked",
                    "You're exhausted from helping someone who won't accept help",
                    "You wonder if setting limits makes you a bad parent, spouse, or friend",
                    "You want to stop enabling without abandoning someone you love",
                  ].map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-16 bg-primary/5">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <p className="font-serif text-xl text-foreground mb-6 italic">
                  "You didn't cause it. You can't cure it. But you can stop participating in cycles 
                  that keep everyone stuck—including you."
                </p>
                
                {!isEnrolled && (
                  <Button 
                    size="lg" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    Start the Free Course
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BoundariesCourse;
