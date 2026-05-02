import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import mattHeadshot from "@/assets/matt-brown-headshot.jpeg";

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
            <div className="max-w-5xl mx-auto grid gap-10 lg:grid-cols-[0.9fr_1.4fr] lg:items-start">
              <aside className="space-y-6 lg:sticky lg:top-24">
                <figure className="rounded-2xl overflow-hidden border border-border bg-card shadow-card">
                  <img
                    src={mattHeadshot}
                    alt="Matt Brown, founder of No More Enabling and professional interventionist"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                  <figcaption className="p-5">
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">Founder</p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-1">Matt Brown</h2>
                    <p className="text-sm text-muted-foreground mt-2">
                      Professional interventionist. Helping families navigate addiction, treatment resistance, and recovery since 2004.
                    </p>
                    <a href="mailto:matt@nomoreenabling.com" className="inline-flex items-center gap-2 text-primary mt-4 hover:underline text-sm font-medium">
                      Contact Matt
                      <ArrowRight size={16} />
                    </a>
                  </figcaption>
                </figure>

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

              <div className="prose prose-lg max-w-none text-muted-foreground">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose">Meet Matt Brown</h2>
                <p>
                  Matt Brown is a professional interventionist and the founder of No More Enabling. Since 2004, he has worked
                  directly with families in the hardest moments of addiction — the late-night phone calls, the standoffs over
                  treatment, the relapses, and the slow, quieter work of rebuilding trust afterward.
                </p>
                <p>
                  His approach is shaped by one stubborn pattern he kept seeing: families rarely lacked love or effort. What
                  they lacked was a framework that held up when fear, guilt, and exhaustion were running the show. So the work
                  he does now — and the writing on this site — is built around clarity under pressure, not theory in calm rooms.
                </p>
                <p>
                  Matt is also a man in long-term recovery himself, sober since <strong>April 6, 2003</strong>. In 2001, he
                  was on the receiving end of his own family's DIY intervention. It took two more years after that before he
                  found lasting sobriety — and he uses that lived experience to help families avoid some of the well-meaning
                  but innocent mistakes his own family made with him.
                </p>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose mt-10">How he got here</h2>
                <p>
                  Matt entered this field because he saw, up close, what addiction does to the people around it. Over two
                  decades he has guided interventions, coached parents through impossible decisions about adult children,
                  helped spouses figure out where the line is, and walked alongside families after treatment when the real
                  work begins.
                </p>
                <p>
                  He treats addiction as a chronic brain disease, not a moral failure — and he treats family members as people
                  who deserve real tools, not platitudes. That clinical orientation, paired with thousands of hours of
                  family-room conversations, is what informs the articles, courses, and assessments here.
                </p>

                <h2 className="font-serif text-3xl font-bold text-foreground mb-6 not-prose mt-10">Why this site exists</h2>
                <p>
                  No More Enabling is not a treatment center and it is not a crisis line. It is an educational platform for
                  families who want a clearer mirror, fewer false promises, and guidance that respects both the seriousness of
                  addiction and the limits of what families can control.
                </p>
                <p>
                  The mission is simple: help families act <em>without fear and without guilt</em>.
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
                  Content on No More Enabling is grounded in direct intervention experience, family systems thinking, and
                  practical recovery guidance. The standard is simple: if advice will not hold up in a tense family
                  conversation, it does not belong here.
                </p>
                <p className="font-medium text-foreground">
                  We aim for truth people can stay present for — not shame, hype, or false certainty.
                </p>

                <div className="not-prose mt-10 flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link to="/work-with-matt">
                      Work with Matt
                      <ArrowRight size={18} />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/articles">Read the articles</Link>
                  </Button>
                </div>
              </div>
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
