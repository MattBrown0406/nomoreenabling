import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import ItemListJsonLd from "@/components/seo/ItemListJsonLd";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { topicHubs } from "@/data/topicHubs";
import { getLeadMagnetForHub } from "@/data/leadMagnets";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import LeadMagnetCard from "@/components/LeadMagnetCard";
import CommercialIntentCTA from "@/components/CommercialIntentCTA";
import { trackGAConversion } from "@/lib/gaConversions";
import { withOwnedUtm } from "@/lib/ownedLinks";
import { getCommercialIntentPageForContext } from "@/data/commercialIntentPages";

export default function TopicHubDetail() {
  const { slug } = useParams<{ slug: string }>();
  const hub = topicHubs.find((item) => item.slug === slug);

  if (!hub) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl font-bold text-foreground">Topic hub not found</h1>
          <p className="mt-4 text-muted-foreground">Try the main hubs page instead.</p>
          <Button asChild className="mt-6">
            <Link to="/topic-hubs">Go to topic hubs</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const featuredPosts = hub.featuredSlugs
    .map((featuredSlug) => blogPostsMeta.find((post) => post.slug === featuredSlug))
    .filter(Boolean);

  const additionalPosts = blogPostsMeta
    .filter(
      (post) =>
        post.categories.some((category) => hub.categories.includes(category)) &&
        !hub.featuredSlugs.includes(post.slug),
    )
    .slice(0, 8);
  const hubPosts = [...featuredPosts, ...additionalPosts].filter(Boolean);
  const leadMagnet = getLeadMagnetForHub(hub.slug);
  const commercialIntentPage = getCommercialIntentPageForContext({
    title: hub.title,
    categories: hub.categories,
    hubSlug: hub.slug,
  });
  const soberHelplineHref = withOwnedUtm("https://soberhelpline.com", {
    medium: "topic_hub_cta",
    campaign: "family_squares",
    content: hub.slug,
  });
  const freedomInterventionsHref = withOwnedUtm("https://freedominterventions.com", {
    medium: "topic_hub_cta",
    campaign: "intervention_consult",
    content: hub.slug,
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title={`${hub.shortTitle} Hub`}
        description={hub.description}
        canonicalUrl={`https://nomoreenabling.com/topic-hubs/${hub.slug}`}
        keywords={`${hub.categories.join(", ")}, family addiction support, ${hub.shortTitle.toLowerCase()} help`}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Topic Hubs", url: "https://nomoreenabling.com/topic-hubs" },
          { name: hub.shortTitle, url: `https://nomoreenabling.com/topic-hubs/${hub.slug}` },
        ]}
      />
      <ItemListJsonLd
        name={`${hub.shortTitle} Reading Path`}
        description={hub.description}
        items={hubPosts.map((post) => ({
          name: post!.title,
          description: post!.excerpt,
          url: `https://nomoreenabling.com/articles/${post!.slug}`,
        }))}
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-5xl">
          <Link to="/topic-hubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to topic hubs</Link>
          <div className="mt-5 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-8 md:p-10">
            <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              {hub.shortTitle} Hub
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">{hub.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{hub.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full bg-background/80 border border-border px-4 py-2 text-sm text-muted-foreground">{featuredPosts.length} curated starting articles</div>
              <div className="rounded-full bg-background/80 border border-border px-4 py-2 text-sm text-muted-foreground">Best for: {hub.shortTitle.toLowerCase()}</div>
              <div className="rounded-full bg-background/80 border border-border px-4 py-2 text-sm text-muted-foreground">Action-oriented next steps included</div>
            </div>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <Link to={hub.primaryCta.href}>{hub.primaryCta.label}</Link>
              </Button>
              {hub.secondaryCta && (
                <Button variant="outline" asChild>
                  {hub.secondaryCta.href.startsWith('/#') ? (
                    <a href={hub.secondaryCta.href}>{hub.secondaryCta.label}</a>
                  ) : (
                    <Link to={hub.secondaryCta.href}>{hub.secondaryCta.label}</Link>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] mt-10">
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">What this hub is for</h2>
              <p className="mt-3 text-muted-foreground">{hub.intro}</p>
              <p className="mt-3 text-foreground font-medium">{hub.bestFor}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-secondary/40 p-4">
                  <p className="text-sm font-medium text-foreground">Start here if…</p>
                  <p className="text-sm text-muted-foreground mt-1">the same family pattern keeps repeating and you need a clearer lens before you act again.</p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-4">
                  <p className="text-sm font-medium text-foreground">Use this hub to…</p>
                  <p className="text-sm text-muted-foreground mt-1">read in a smarter order, choose one next step, and stop bouncing between random articles.</p>
                </div>
              </div>
            </div>

            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Pillar guide</p>
              <h2 className="font-serif text-3xl font-bold text-foreground mt-2">{hub.shortTitle} guidance for families affected by addiction</h2>
              <p className="mt-4 text-muted-foreground">{hub.searchIntent}</p>
              <div className="mt-6 space-y-6">
                {hub.guideSections.map((section) => (
                  <div key={section.heading}>
                    <h3 className="font-serif text-2xl font-bold text-foreground">{section.heading}</h3>
                    <p className="mt-2 text-muted-foreground leading-relaxed">{section.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {leadMagnet && (
              <LeadMagnetCard magnet={leadMagnet} source="topic_hub" hubSlug={hub.slug} />
            )}

            {commercialIntentPage && (
              <CommercialIntentCTA page={commercialIntentPage} source="topic_hub" hubSlug={hub.slug} />
            )}

            <section className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Questions this hub answers</p>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Common searches families bring here</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {hub.keyQuestions.map((question) => (
                  <div key={question} className="rounded-xl bg-secondary/40 p-4">
                    <p className="font-medium text-foreground">{question}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm uppercase tracking-wide text-primary font-medium">Why families trust this</p>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-2">The goal is clarity, not content for content’s sake</h2>
              <p className="mt-3 text-muted-foreground">
                This hub is meant to help families read in a smarter order, spot the pattern faster, and take one sturdier step instead of circling the same fear.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Pattern-first</p>
                  <p className="text-sm text-muted-foreground mt-1">Less random reading. More useful sequencing.</p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Built from field experience</p>
                  <p className="text-sm text-muted-foreground mt-1">Grounded in real intervention and family support work.</p>
                </div>
                <div className="rounded-xl bg-secondary/40 p-4">
                  <p className="font-medium text-foreground">Action-oriented</p>
                  <p className="text-sm text-muted-foreground mt-1">Every hub should leave you with a next move.</p>
                </div>
              </div>
            </div>

            <section>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Start with these articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredPosts.map((post) => (
                  <BlogCard
                    key={post!.slug}
                    title={post!.title}
                    excerpt={post!.excerpt}
                    category={post!.category}
                    readTime={post!.readTime}
                    date={post!.date}
                    image={post!.image}
                    slug={post!.slug}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-5">Keep going</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {additionalPosts.map((post) => (
                  <BlogCard
                    key={post.slug}
                    title={post.title}
                    excerpt={post.excerpt}
                    category={post.category}
                    readTime={post.readTime}
                    date={post.date}
                    image={post.image}
                    slug={post.slug}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-foreground">Take the next step</h2>
              <p className="mt-3 text-muted-foreground">
                Don’t just collect insight. Pick the next move that gives your family more clarity and less chaos.
              </p>
              <div className="mt-5 space-y-3">
                <Button className="w-full" asChild>
                  <Link to={hub.primaryCta.href}>{hub.primaryCta.label}</Link>
                </Button>
                {hub.secondaryCta && (
                  <Button variant="outline" className="w-full" asChild>
                    {hub.secondaryCta.href.startsWith('/#') ? (
                      <a href={hub.secondaryCta.href}>{hub.secondaryCta.label}</a>
                    ) : (
                      <Link to={hub.secondaryCta.href}>{hub.secondaryCta.label}</Link>
                    )}
                  </Button>
                )}
                {hub.primaryCta.href !== "/work-with-matt" && (
                  <Button variant="ghost" className="w-full" asChild>
                    <Link to="/work-with-matt">Request guidance from Matt</Link>
                  </Button>
                )}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {hub.categories.map((category) => (
                  <Link key={category} to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
                    {category}
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-border bg-background p-4">
                <p className="text-sm font-medium text-foreground">Advertiser fit</p>
                <p className="text-sm text-muted-foreground mt-1">{hub.sponsorCategory}</p>
                <Link to="/advertise" className="inline-flex mt-3 text-sm font-medium text-primary hover:underline">
                  See sponsorship options
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <a
                  href={soberHelplineHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                  onClick={() => trackGAConversion("family_squares_click", { source: "topic_hub", hub_slug: hub.slug })}
                >
                  <p className="font-medium text-foreground">Need live family support?</p>
                  <p className="text-sm text-muted-foreground mt-1">SoberHelpline.com offers a free family support Zoom every Monday night led by professional interventionists.</p>
                </a>
                <Link to="/work-with-matt" className="block rounded-xl border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">Need a private family plan?</p>
                  <p className="text-sm text-muted-foreground mt-1">Use the consultation request form to share what is happening and ask for guidance from Matt.</p>
                </Link>
                <a
                  href={freedomInterventionsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                  onClick={() => trackGAConversion("owned_offer_click", { source: "topic_hub", owned_brand: "freedom-interventions", hub_slug: hub.slug })}
                >
                  <p className="font-medium text-foreground">Need higher-level intervention help?</p>
                  <p className="text-sm text-muted-foreground mt-1">Freedom Interventions is the better path when the situation is escalating or treatment refusal is entrenched.</p>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
