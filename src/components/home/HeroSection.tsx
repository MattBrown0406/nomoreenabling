import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const trustPoints = [
  "20+ years of intervention experience",
  "Direct guidance for families under stress",
  "Clear next steps instead of vague encouragement",
];

const HeroSection = () => {
  const scrollToNewsletter = () => {
    const element = document.getElementById("newsletter");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brick-light/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-fade-up">
            Family guidance for addiction and enabling
          </span>

          <h1
            className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            Find the right level of help before the next crisis decides for you
          </h1>

          <p
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            No More Enabling helps families move from search panic into the right next step:
            coaching, intervention guidance, family support, or a clearer boundary plan.
          </p>
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/family-situation-assessment">
                Take the family assessment
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/intervention-help">
                Intervention help
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/family-addiction-coaching">
                Family coaching
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm animate-fade-up" style={{ animationDelay: "0.35s" }}>
            {trustPoints.map((point) => (
              <div key={point} className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "0.4s" }}>
            Prefer email? <button onClick={scrollToNewsletter} className="text-primary underline underline-offset-4 hover:text-primary/80">Get practical family guidance by email</button>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
