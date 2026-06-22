import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Library } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import DefinedTermJsonLd from "@/components/seo/DefinedTermJsonLd";
import { Button } from "@/components/ui/button";
import { glossaryTerms } from "@/data/aeoAnswers";

export default function GlossaryTerm() {
  const { termSlug } = useParams<{ termSlug: string }>();
  const term = glossaryTerms.find((item) => item.slug === termSlug);

  if (!term) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="container mx-auto flex-1 px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground">Glossary term not found</h1>
          <Button asChild className="mt-6" variant="outline">
            <Link to="/glossary">
              <ArrowLeft className="h-4 w-4" />
              Back to glossary
            </Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const canonicalUrl = `https://nomoreenabling.com/glossary/${term.slug}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${term.term} Definition for Addiction Families`}
        description={`${term.term}: ${term.plainDefinition} Learn what the family should do next.`}
        canonicalUrl={canonicalUrl}
        keywords={`${term.term}, ${term.term} definition, addiction family glossary`}
      />
      <DefinedTermJsonLd term={term} />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Glossary", url: "https://nomoreenabling.com/glossary" },
          { name: term.term, url: canonicalUrl },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <Link to="/glossary" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" />
              Back to glossary
            </Link>
            <span className="mb-6 flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Library className="h-4 w-4" />
              Addiction family glossary
            </span>
            <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              What is {term.term.toLowerCase()}?
            </h1>
            <p className="mt-6 max-w-3xl text-xl text-foreground">{term.plainDefinition}</p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <article className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Plain answer</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{term.expandedAnswer}</p>
            </article>

            <section className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">What to do next</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-foreground">Turn the definition into one clear family action</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                If this term describes what is happening at home, do not stop at the definition. Use the related guidance below to choose the next step: check the pattern, get family coaching, attend live family support, or use Family Bridge when the family needs shared structure after treatment, relapse concerns, or a new boundary plan.
              </p>
            </section>

            <section className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-8">
              <h2 className="font-serif text-2xl font-bold text-foreground">Related guidance</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {term.relatedLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="rounded-xl border border-border bg-background p-4 font-medium text-foreground hover:border-primary/40"
                  >
                    {link.label}
                    <ArrowRight className="mt-3 h-4 w-4 text-primary" />
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
