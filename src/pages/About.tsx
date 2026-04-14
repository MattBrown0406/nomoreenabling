import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";

const aboutFaqs = [
  {
    question: "What is No More Enabling?",
    answer:
      "No More Enabling is an educational resource for families affected by addiction, codependency, and enabling behaviors. It helps families understand patterns, make steadier decisions, and respond more clearly.",
  },
  {
    question: "Who founded No More Enabling?",
    answer:
      "No More Enabling was founded by Matt Brown, a professional interventionist who has worked with families affected by substance use disorders since 2004.",
  },
  {
    question: "Is No More Enabling a treatment provider?",
    answer:
      "No. No More Enabling is not a treatment provider or crisis service. It is an educational platform designed to help families think more clearly, set healthier boundaries, and make informed decisions.",
  },
  {
    question: "What topics does No More Enabling cover?",
    answer:
      "The site focuses on enabling vs helping, family boundaries and communication, codependency and family roles, intervention and treatment decisions, and supporting recovery without losing yourself.",
  },
];

const principles = [
  {
    title: "Clarity over panic",
    description: "Families usually do not need more intensity. They need a clearer read on what is happening and what to do next.",
  },
  {
    title: "Boundaries with backbone",
    description: "A boundary is not a speech. It is a decision you can hold when things get uncomfortable.",
  },
  {
    title: "Support that holds under stress",
    description: "Advice is only useful if it still makes sense on the hard day, not just the calm one.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="About No More Enabling"
        description="Learn about No More Enabling, founded by interventionist Matt Brown. See the experience, editorial standards, and family-first approach behind the site."
        canonicalUrl="https://nomoreenabling.com/about"
        keywords="Matt Brown interventionist, No More Enabling about, family addiction education, enabling boundaries resource"
        articleAuthor="Matt Brown"
      />
      <FAQJsonLd faqs={aboutFaqs} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "About", url: "https://nomoreenabling.com/about" },
        ]}
      />
      <Header />

      <main className="flex-grow" role="main">
        <section className="py-16 md:py-24 bg-gradient-to-br from-brick-light/50 to-transparent">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">About No More Enabling</h1>
              <p className="mt-6 text-lg text-muted-foreground">
                This site exists for families who are trying hard, carrying a lot, and need something more useful than
                recycled encouragement. The goal is clarity, steadier decisions, and support that does not fall apart when stress rises.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid gap-10 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose">Who is behind the site</h2>
                <p>
                  No More Enabling was founded by Matt Brown, a professional interventionist who has worked with families affected by
                  substance use disorders since 2004. His work has focused on one stubborn reality: families often do not need more
                  information as much as they need a better framework for using it under pressure.
                </p>
                <p>
                  Over two decades, Matt has helped families navigate active addiction, failed promises, treatment resistance, relapse,
                  and the exhausting cycle of trying to help without making things worse. That experience shapes the site. The content is
                  written to be direct, steady, and usable in real life, not just theoretically correct.
                </p>
                <p>
                  No More Enabling is not a treatment center and it is not a crisis line. It is an educational platform for families who
                  want a clearer mirror, fewer better commitments, and guidance that respects both the seriousness of addiction and the
                  limits of what families can control.
                </p>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose mt-10">What we cover</h2>
                <ul>
                  <li>How to tell the difference between helping and enabling</li>
                  <li>Family boundaries, communication, and follow-through</li>
                  <li>Codependency, overfunctioning, and emotional burnout</li>
                  <li>Intervention and treatment decision-making</li>
                  <li>Supporting recovery without losing yourself in the process</li>
                </ul>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose mt-10">Editorial standards</h2>
                <p>
                  Content on No More Enabling is grounded in direct intervention experience, family systems thinking, and practical
                  recovery guidance. When contributors are involved, they are selected for relevant clinical, educational, or lived
                  experience. The standard is simple: if advice will not hold up in a tense family conversation, it does not belong here.
                </p>
                <p className="font-medium text-foreground">
                  We aim for truth people can stay present for, not shame, hype, or false certainty.
                </p>
              </div>

              <aside className="space-y-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Experience</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Matt Brown</h2>
                  <p className="text-muted-foreground mt-3">
                    Professional interventionist helping families respond to addiction, treatment resistance, and recovery planning since 2004.
                  </p>
                  <a href="mailto:matt@nomoreenabling.com" className="inline-flex items-center gap-2 text-primary mt-4 hover:underline">
                    Contact Matt
                    <ArrowRight size={16} />
                  </a>
                </div>

                <div className="rounded-2xl border border-border bg-secondary/40 p-6">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Start here</p>
                  <div className="mt-4 space-y-3">
                    <Link to="/helping-or-enabling" className="block font-medium text-foreground hover:text-primary transition-colors">
                      Helping or Enabling? Tool
                    </Link>
                    <Link to="/family-support-guide" className="block font-medium text-foreground hover:text-primary transition-colors">
                      Family Support Guide
                    </Link>
                    <Link to="/articles" className="block font-medium text-foreground hover:text-primary transition-colors">
                      Latest articles
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-3xl font-bold text-foreground text-center mb-12">What guides the work</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {principles.map((value) => (
                  <div key={value.title} className="text-center">
                    <h3 className="font-serif text-xl font-bold text-foreground mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Stay connected</h2>
              <p className="text-muted-foreground mb-8">
                Get grounded guidance, new articles, and practical reminders in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  <Mail size={18} />
                  Subscribe to newsletter
                </Button>
                <Button variant="hero-outline" size="lg" asChild>
                  <Link to="/articles">
                    Read articles
                    <ArrowRight size={18} />
                  </Link>
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
