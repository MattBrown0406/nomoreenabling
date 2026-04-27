import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { topicHubs } from "@/data/topicHubs";
import { Button } from "@/components/ui/button";

export default function TopicHubs() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="Topic Hubs — Guided Family Addiction Resources"
        description="Browse guided topic hubs for enabling, boundaries, codependency, intervention, family dynamics, and recovery."
        canonicalUrl="https://nomoreenabling.com/topic-hubs"
        keywords="family addiction resources, enabling help, boundaries help, codependency help, intervention guidance, recovery family support"
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Topic Hubs", url: "https://nomoreenabling.com/topic-hubs" },
        ]}
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-4xl">
          <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-6">
            Guided Topic Hubs
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Stop wandering. Start with the right pattern.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-3xl">
            These hubs group the most useful content by the actual problem families are dealing with — not just by blog category.
          </p>
          <div className="mt-6 flex gap-3 flex-col sm:flex-row">
            <Button asChild>
              <Link to="/start-here">Go to Start Here</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/articles">Browse all articles</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/work-with-matt">Work with Matt</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 mt-10">
          {topicHubs.map((hub) => (
            <Link key={hub.slug} to={`/topic-hubs/${hub.slug}`} className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors">
              <h2 className="font-serif text-2xl font-bold text-foreground">{hub.shortTitle}</h2>
              <p className="mt-3 text-muted-foreground">{hub.description}</p>
              <p className="mt-4 text-sm text-muted-foreground">{hub.bestFor}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {hub.categories.slice(0, 3).map((category) => (
                  <span key={category} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">{category}</span>
                ))}
              </div>
              <p className="mt-5 text-sm font-medium text-primary">Open hub →</p>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
