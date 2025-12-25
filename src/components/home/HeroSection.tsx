import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToNewsletter = () => {
    const element = document.getElementById('newsletter');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-brick-light/50 to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6 animate-fade-up">
            Welcome to Your Journey
          </span>
          
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Support Without Enabling:{" "}
            <span className="text-primary">Tools for Families Ready to Break the Cycle</span>
          </h1>
          
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            We empower families with proven communication strategies and support to stop enabling behaviors and promote recovery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10 animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Button variant="hero" size="lg" asChild>
              <Link to="/articles">
                Start Reading
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="hero-outline" size="lg" onClick={scrollToNewsletter}>
              Join Newsletter
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
