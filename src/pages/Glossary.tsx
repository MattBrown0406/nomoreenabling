import { Link } from "react-router-dom";
import { ArrowRight, Library } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { glossaryTerms } from "@/data/aeoAnswers";

export default function Glossary() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Addiction Family Glossary"
        description="Plain-language definitions for enabling, boundaries, codependency, treatment refusal, intervention, financial enabling, and recovery support."
        canonicalUrl="https://nomoreenabling.com/glossary"
        keywords="addiction glossary, enabling definition, codependency definition, boundaries definition"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Glossary", url: "https://nomoreenabling.com/glossary" },
        ]}
      />
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-secondary/20">
          <div className="container mx-auto px-4 py-12 md:py-16">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Library className="h-4 w-4" />
              Glossary
            </span>
            <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
              Addiction family terms, explained plainly.
            </h1>
            <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              These definitions help families and answer engines understand the language behind No More Enabling: enabling, boundaries, codependency, treatment refusal, intervention, and recovery support.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {glossaryTerms.map((term) => (
              <article key={term.slug} className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground">{term.term}</h2>
                <p className="mt-3 text-muted-foreground">{term.plainDefinition}</p>
                <Link to={`/glossary/${term.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Read definition
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
