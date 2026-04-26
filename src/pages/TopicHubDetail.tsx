import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import { blogPosts } from "@/data/blogPosts";
import { topicHubs } from "@/data/topicHubs";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";

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
    .map((featuredSlug) => blogPosts.find((post) => post.slug === featuredSlug))
    .filter(Boolean);

  const additionalPosts = blogPosts
    .filter(
      (post) =>
        post.categories.some((category) => hub.categories.includes(category)) &&
        !hub.featuredSlugs.includes(post.slug),
    )
    .slice(0, 8);

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
      <Header />

      <main className="flex-1 container mx-auto px-4 py-14 md:py-20">
        <div className="max-w-4xl">
          <Link to="/topic-hubs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back to topic hubs</Link>
          <div className="mt-5">
            <span className="inline-block rounded-full bg-primary/10 text-primary px-4 py-1.5 text-sm font-medium mb-5">
              {hub.shortTitle} Hub
            </span>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground leading-tight">{hub.title}</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-3xl">{hub.description}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.8fr_1fr] mt-10">
          <div className="space-y-8">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-serif text-2xl font-bold text-foreground">What this hub is for</h2>
              <p className="mt-3 text-muted-foreground">{hub.intro}</p>
              <p className="mt-3 text-foreground font-medium">{hub.bestFor}</p>
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
                <Button variant="ghost" className="w-full" asChild>
                  <Link to="/start-here">Open the Start Here page</Link>
                </Button>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {hub.categories.map((category) => (
                  <Link key={category} to={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`} className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground hover:text-foreground">
                    {category}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
