import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                About <span className="text-primary">No More Enabling</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We're here to help you break free from unhealthy patterns and build 
                stronger, healthier relationships with yourself and others.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Our Mission
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  No More Enabling was founded with a simple yet powerful mission: 
                  to provide support, guidance, and resources for those who find 
                  themselves caught in enabling patterns.
                </p>
                <p>
                  Whether you're supporting a loved one through addiction, dealing 
                  with codependent relationships, or simply struggling to set healthy 
                  boundaries, we're here to help you navigate these challenges.
                </p>
                <p>
                  Our content is created by mental health professionals, recovery 
                  specialists, and individuals who have walked this path themselves. 
                  We believe in the power of shared experiences and evidence-based 
                  approaches to healing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">
                What We Believe
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Compassion",
                    description: "Change starts with understanding and self-compassion, not judgment.",
                  },
                  {
                    title: "Boundaries",
                    description: "Healthy boundaries are acts of love—for ourselves and others.",
                  },
                  {
                    title: "Growth",
                    description: "Recovery is a journey, not a destination. Progress matters.",
                  },
                ].map((value) => (
                  <div key={value.title} className="text-center">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">
                      {value.title}
                    </h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">
                Join Our Community
              </h2>
              <p className="text-muted-foreground mb-8">
                Get weekly insights, practical strategies, and support delivered 
                straight to your inbox. Join thousands who are on the path to 
                healthier relationships.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  <Mail size={18} />
                  Subscribe to Newsletter
                </Button>
                <Button variant="hero-outline" size="lg">
                  Read Our Articles
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
