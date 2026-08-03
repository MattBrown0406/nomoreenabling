import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download, Mic, Newspaper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// press_feed is newer than the generated database types; use an untyped
// client for this one read-only lookup rather than regenerating types here.
const untypedSupabase = supabase as unknown as SupabaseClient;
import { blogPostsMeta } from "@/data/blogPostMeta";
import pressHeadshot from "@/assets/matt-brown-press-headshot.jpeg";

/**
 * /press — the media kit for journalists, podcasters, and event organizers.
 * The "Latest from The Party Wreckers" section reads press_feed, which a
 * weekly pg_cron + refresh-press-feed edge function keeps current; article
 * stats and recent posts update automatically with every site deploy.
 */

interface PressEpisode {
  title: string;
  url: string;
  published_at: string;
}

const SHORT_BIO =
  "Matt Brown is a professional interventionist, founder of Freedom Interventions and the Sober Helpline family support app, and host of The Party Wreckers podcast. He has guided families through addiction crises, interventions, and recovery since 2004, and publishes family education at NoMoreEnabling.com.";

const LONG_BIO =
  "Matt Brown has worked as a professional interventionist since 2004, guiding families through the hardest conversations of their lives — treatment refusal, relapse, and the patterns of enabling and codependency that keep addiction in place. He is the founder of Freedom Interventions, creator of the Sober Helpline family support app, and host of The Party Wreckers, a podcast of real conversations about addiction, intervention, and recovery. Through NoMoreEnabling.com he publishes plain-language education used by families navigating a loved one's addiction, and he hosts The Family Squares, a free weekly Zoom support group for families. His message is consistent: families don't have to wait for rock bottom, and love and boundaries are not opposites.";

const TALKING_POINTS = [
  "Enabling and the family system — why loving families accidentally protect the addiction, and how they stop",
  "Intervention, demystified — what actually happens, when it's necessary, and what TV gets wrong",
  "Treatment refusal — what families can do when their loved one keeps saying no",
  "The financial cost of enabling — rent, bail, and rescue money, and how families stop the bleed",
  "Relapse and the year after treatment — why families fall apart after rehab, and what to change at home",
  "Codependency — when helping becomes an identity, and how family members recover their own lives",
];

const QUICK_FACTS = [
  { label: "Interventionist since", value: "2004" },
  { label: "Podcast", value: "The Party Wreckers" },
  { label: "Family education articles", value: `${blogPostsMeta.length}+` },
  { label: "Weekly free family group", value: "The Family Squares" },
];

const dateLabel = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const BioCard = ({ title, text }: { title: string; text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — reporters can still select the text.
    }
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-serif text-lg font-bold text-foreground">{title}</h3>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
};

const Press = () => {
  const [episodes, setEpisodes] = useState<PressEpisode[]>([]);

  useEffect(() => {
    let cancelled = false;
    void untypedSupabase
      .from("press_feed")
      .select("episodes")
      .eq("id", 1)
      .maybeSingle()
      .then(({ data }) => {
        if (cancelled || !data?.episodes || !Array.isArray(data.episodes)) return;
        setEpisodes((data.episodes as PressEpisode[]).slice(0, 3));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recentArticles = [...blogPostsMeta]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <>
      <SEOHead
        title="Press & Media — Matt Brown, Professional Interventionist"
        description="Press resources for journalists and podcasters: bios, approved headshot, talking points, and recent work from Matt Brown — interventionist since 2004, founder of Freedom Interventions, and host of The Party Wreckers podcast."
        canonicalUrl="https://nomoreenabling.com/press"
        keywords="Matt Brown interventionist, addiction expert source, intervention expert interview, family addiction expert, The Party Wreckers host, press media kit"
      />

      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto max-w-5xl px-4 pb-16">
          {/* Hero */}
          <div className="flex flex-wrap items-center gap-10 pt-14">
            <img
              src={pressHeadshot}
              alt="Matt Brown, professional interventionist — approved press headshot"
              className="w-56 rounded-2xl shadow-lg md:w-64"
            />
            <div className="min-w-[280px] flex-1">
              <div className="text-xs font-extrabold uppercase tracking-[0.2em] text-accent">
                Press &amp; Media
              </div>
              <h1 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground md:text-5xl">
                Matt Brown
              </h1>
              <p className="mt-2 text-lg font-medium text-muted-foreground">
                Professional Interventionist · Founder, Freedom Interventions · Host, The Party
                Wreckers
              </p>
              <p className="mt-4 max-w-xl text-[15px] text-muted-foreground">
                Available for interviews, podcasts, and expert commentary on addiction, enabling,
                intervention, and how families survive all three.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="rounded-full px-6 font-bold">
                  <a href="mailto:matt@soberhelpline.com?subject=Media%20inquiry">
                    Media inquiries: matt@soberhelpline.com
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-2 border-primary px-6 font-bold text-primary">
                  <a href={pressHeadshot} download="matt-brown-headshot.jpeg">
                    <Download className="mr-1.5 h-4 w-4" /> Download headshot
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick facts */}
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUICK_FACTS.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-border bg-card p-5 text-center">
                <div className="font-serif text-xl font-bold text-primary">{fact.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {fact.label}
                </div>
              </div>
            ))}
          </div>

          {/* Bios */}
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">Approved bios</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <BioCard title="Short bio (~50 words)" text={SHORT_BIO} />
              <BioCard title="Full bio (~130 words)" text={LONG_BIO} />
            </div>
          </section>

          {/* Talking points */}
          <section className="mt-10">
            <h2 className="mb-4 font-serif text-2xl font-bold text-foreground">
              What Matt can speak to
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {TALKING_POINTS.map((point) => (
                <div key={point} className="flex gap-3 rounded-xl border border-border bg-card p-4">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  <p className="text-sm text-foreground">{point}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent work — auto-updating */}
          <section className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Latest from The Party Wreckers
                </h2>
              </div>
              {episodes.length === 0 ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Real conversations about addiction, intervention, and recovery — listen at{" "}
                  <a href="https://partywreckers.com" className="font-semibold text-primary" target="_blank" rel="noopener">
                    partywreckers.com
                  </a>
                  .
                </p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {episodes.map((episode) => (
                    <li key={episode.url}>
                      <a
                        href={episode.url}
                        target="_blank"
                        rel="noopener"
                        className="text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {episode.title}
                      </a>
                      {episode.published_at && (
                        <div className="text-xs text-muted-foreground">{dateLabel(episode.published_at)}</div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <h2 className="font-serif text-xl font-bold text-foreground">
                  Recent writing on No More Enabling
                </h2>
              </div>
              <ul className="mt-3 space-y-3">
                {recentArticles.map((article) => (
                  <li key={article.slug}>
                    <Link
                      to={`/articles/${article.slug}`}
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {article.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">{article.date}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* House rules */}
          <div className="mt-10 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-sm leading-relaxed">
            <p>
              <strong className="text-primary">A note for producers and journalists:</strong> Matt
              speaks plainly about addiction and families, from two decades of sitting in living
              rooms during the worst week of people's lives. He does not name or discuss individual
              clients, does not endorse specific treatment centers, and will not provide commentary
              that shames families or people in active addiction. Everything else is on the table.
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Press;
