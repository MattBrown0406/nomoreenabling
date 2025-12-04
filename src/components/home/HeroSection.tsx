import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-sage-light/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-fade-up">
            Welcome to Your Journey
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Break Free from{" "}
            <span className="text-primary">Unhealthy Patterns</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Discover insights, strategies, and support for setting healthy boundaries, 
            building self-worth, and creating relationships that nurture your growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg">
              Start Reading
              <ArrowRight size={18} />
            </Button>
            <Button variant="hero-outline" size="lg">
              Join Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
