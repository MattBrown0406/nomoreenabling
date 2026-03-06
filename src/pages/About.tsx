import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";

const aboutFaqs = [
  {
    question: "What is No More Enabling?",
    answer: "No More Enabling is an educational and support resource for families affected by addiction, codependency, and enabling behaviors. The platform helps families understand how addiction impacts relationships and how changes within the family system can support healthier outcomes."
  },
  {
    question: "Who founded No More Enabling?",
    answer: "No More Enabling was founded by Matt Brown, a professional interventionist who has worked with families affected by substance use disorders for more than two decades since 2004."
  },
  {
    question: "Is No More Enabling a treatment provider?",
    answer: "No, No More Enabling is not a treatment provider or crisis service. It is a trusted educational resource designed to help families make informed decisions, set healthier boundaries, and reduce the chaos and confusion that addiction often creates within families."
  },
  {
    question: "What topics does No More Enabling cover?",
    answer: "The platform focuses on enabling vs. helping, family boundaries and communication, codependency and family roles, preparing for intervention and treatment decisions, and supporting recovery without losing oneself."
  }
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="About No More Enabling — Our Mission & Story"
        description="No More Enabling is an educational resource for families affected by addiction. Founded by Matt Brown, professional interventionist with 20+ years experience."
        canonicalUrl="https://nomoreenabling.com/about"
        keywords="about no more enabling, addiction support, family education, Matt Brown interventionist"
      />
      <FAQJsonLd faqs={aboutFaqs} />
      <Header />
      
      <main className="flex-grow" role="main">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                About <span className="text-primary">No More Enabling</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                We're here to help you break free from unhealthy patterns, find hope, and build 
                stronger, healthier relationships with yourself and others...without fear and without guilt.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6 text-center">
                Our Mission
              </h2>
              <div className="prose prose-lg text-muted-foreground space-y-4">
                <p>
                  No More Enabling is an educational and support resource for families affected by addiction, codependency, and enabling behaviors. The platform exists to help families understand how addiction impacts relationships—and how changes within the family system can support healthier outcomes.
                </p>
                <p>
                  No More Enabling was founded by Matt Brown, a professional interventionist who has worked with families affected by substance use disorders for more than two decades. Since 2004, Matt has helped hundreds of families navigate addiction-related crises, boundary breakdowns, resistance to treatment, relapse, and recovery planning. His work has consistently focused on helping families shift from reactive, fear-based patterns to clear, structured, and sustainable responses.
                </p>
                <p>
                  Through years of direct intervention work, Matt identified a critical gap: families are often overwhelmed, misinformed, or unintentionally enabling addiction—not because they lack care or intelligence, but because they lack clear, practical education. No More Enabling was created to meet that need.
                </p>
                <p>
                  All content on No More Enabling is grounded in real-world intervention experience, evidence-informed family systems principles, and best practices in addiction recovery. The platform focuses on topics such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Enabling vs. helping</li>
                  <li>Family boundaries and communication</li>
                  <li>Codependency and family roles</li>
                  <li>Preparing for intervention and treatment decisions</li>
                  <li>Supporting recovery without losing oneself</li>
                </ul>
                <p>
                  In addition to Matt's contributions, No More Enabling features articles, guides, and worksheets developed by licensed mental health professionals, experienced recovery specialists, and qualified educators. Contributors are selected for their clinical knowledge, ethical standards, and firsthand experience working with families affected by addiction. Many also bring lived experience as individuals in recovery or family members, ensuring content remains practical, compassionate, and grounded in reality.
                </p>
                <p>
                  No More Enabling is not a treatment provider or crisis service. It is a trusted educational resource designed to help families make informed decisions, set healthier boundaries, and reduce the chaos and confusion that addiction often creates within families.
                </p>
                <p className="font-medium text-foreground">
                  Our commitment is to clarity over shame, education over blame, and support that strengthens families—regardless of whether their loved one is ready for change.
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
