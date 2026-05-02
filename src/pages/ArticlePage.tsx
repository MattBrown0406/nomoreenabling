import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef, useMemo } from "react";
import { ArrowLeft, Clock, Calendar, Tag, Facebook, Mail, Link2, Check, Share2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { blogPostsMeta } from "@/data/blogPostMeta";
import { articleContentLoaders } from "@/data/articleContentLoaders";
import { topicHubs } from "@/data/topicHubs";
import AdSpace from "@/components/ads/AdSpace";
import RelatedArticleCallout from "@/components/blog/RelatedArticleCallout";
import ArticleStickyCTA from "@/components/blog/ArticleStickyCTA";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import SEOHead from "@/components/seo/SEOHead";
import ArticleJsonLd from "@/components/seo/ArticleJsonLd";
import BreadcrumbJsonLd from "@/components/seo/BreadcrumbJsonLd";
import FAQJsonLd from "@/components/seo/FAQJsonLd";
import { useInitialArticleContent } from "@/lib/articleContentContext";
import CoachingInterventionCTA from "@/components/CoachingInterventionCTA";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const convertMarkdownLikeContentToHtml = (content: string) => {
  const paragraphs = content
    .split("\n\n")
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs
    .map((paragraph) => {
      if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
        return `<h2>${paragraph.replace(/\*\*/g, "")}</h2>`;
      }

      const inlineFormatted = paragraph
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br />");

      return `<p>${inlineFormatted}</p>`;
    })
    .join("");
};

const normalizeArticleHtml = (content: string) => {
  if (/<(h2|h3|p|ul|ol|blockquote)>/i.test(content)) {
    return content;
  }
  return convertMarkdownLikeContentToHtml(content);
};

const stripHtml = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

const slugifyHeading = (text: string) =>
  text
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const withHeadingIds = (html: string) => {
  const seen: Record<string, number> = {};

  return html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (match, attrs, innerHtml) => {
    if (/\sid=/i.test(attrs)) return match;

    const headingText = stripHtml(innerHtml);
    const baseId = slugifyHeading(headingText) || "section";
    seen[baseId] = (seen[baseId] || 0) + 1;
    const id = seen[baseId] === 1 ? baseId : `${baseId}-${seen[baseId]}`;

    return `<h2${attrs} id="${id}">${innerHtml}</h2>`;
  });
};

const getNormalizedArticleHtml = (content: string) => withHeadingIds(normalizeArticleHtml(content).trim());

const getArticleHeadings = (content: string) => {
  const normalizedHtml = getNormalizedArticleHtml(content);
  const headings: { id: string; text: string }[] = [];
  const headingRegex = /<h2[^>]*id=["']([^"']+)["'][^>]*>([\s\S]*?)<\/h2>/gi;
  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(normalizedHtml)) !== null) {
    const text = stripHtml(match[2]);
    if (text && !/^frequently asked questions/i.test(text)) {
      headings.push({ id: match[1], text });
    }
  }

  return headings.slice(0, 8);
};

const getArticleSections = (content: string) => {
  const normalizedHtml = getNormalizedArticleHtml(content);
  if (!normalizedHtml) return [];

  const sections = normalizedHtml.split(/(?=<h2[\s>])/i).filter(Boolean);
  return sections.length ? sections : [normalizedHtml];
};

const extractArticleFaqs = (content: string) => {
  const normalizedHtml = normalizeArticleHtml(content);
  const faqStart = normalizedHtml.search(/<h2[^>]*>\s*Frequently Asked Questions/i);

  if (faqStart === -1) return [];

  const faqHtml = normalizedHtml.slice(faqStart);
  const faqs: { question: string; answer: string }[] = [];
  const questionRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match: RegExpExecArray | null;

  while ((match = questionRegex.exec(faqHtml)) !== null) {
    const question = stripHtml(match[1]);
    const answer = stripHtml(match[2]);

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs.slice(0, 8);
};

const getWordCount = (content: string) => {
  const text = stripHtml(normalizeArticleHtml(content));
  if (!text) return undefined;
  return text.split(/\s+/).filter(Boolean).length;
};

const getPrimaryCta = (article: { title: string; categories: string[] }) => {
  const haystack = `${article.title} ${article.categories.join(" ")}`.toLowerCase();

  if (haystack.includes("crisis") || haystack.includes("safety") || haystack.includes("911") || haystack.includes("violence") || haystack.includes("threat")) {
    return {
      label: "Open the safety path",
      href: "/topic-hubs/crisis-and-safety",
      description: "When safety is involved, the next step should be clear and proportionate. Start with the crisis and safety path before another conversation.",
      secondaryLabel: "Request private guidance",
      secondaryHref: "/work-with-matt",
    };
  }

  if (haystack.includes("intervention") || haystack.includes("refuses") || haystack.includes("refusal") || haystack.includes("treatment resistance")) {
    return {
      label: "Read the intervention path",
      href: "/topic-hubs/intervention",
      description: "If the family is circling treatment refusal or intervention questions, use the structured intervention path instead of improvising the next talk.",
      secondaryLabel: "Request guidance from Matt",
      secondaryHref: "/work-with-matt",
    };
  }

  if (haystack.includes("alcoholic") || haystack.includes("alcohol")) {
    return {
      label: "Open the alcohol family path",
      href: "/topic-hubs/alcoholic-family-member",
      description: "Alcohol can hide behind functioning and normal routines. Use the alcohol family path to separate minimization from real household impact.",
      secondaryLabel: "Take the helping vs enabling assessment",
      secondaryHref: "/helping-or-enabling",
    };
  }

  if (haystack.includes("spouse") || haystack.includes("partner")) {
    return {
      label: "Open the spouse or partner path",
      href: "/topic-hubs/spouse-partner-addiction",
      description: "When addiction is inside the relationship, the next step has to protect love, safety, money, children, and reality at the same time.",
      secondaryLabel: "Build stronger boundaries",
      secondaryHref: "/boundaries-course",
    };
  }

  if (haystack.includes("adult child")) {
    return {
      label: "Open the parent path",
      href: "/topic-hubs/adult-child-addiction",
      description: "Parents need guidance that honors the love without letting the addiction use money, housing, guilt, or rescue as the family system.",
      secondaryLabel: "Take the helping vs enabling assessment",
      secondaryHref: "/helping-or-enabling",
    };
  }

  if (haystack.includes("financial") || haystack.includes("money") || haystack.includes("rent") || haystack.includes("bills")) {
    return {
      label: "Open the money path",
      href: "/topic-hubs/financial-enabling",
      description: "Money questions are rarely only about money. Use the financial enabling path to decide what support points toward recovery.",
      secondaryLabel: "Take the helping vs enabling assessment",
      secondaryHref: "/helping-or-enabling",
    };
  }

  if (haystack.includes("after treatment") || haystack.includes("after rehab") || haystack.includes("relapse")) {
    return {
      label: "Open the after-treatment path",
      href: "/topic-hubs/after-treatment",
      description: "After treatment, the family needs structure that supports recovery without rebuilding the old rescue pattern.",
      secondaryLabel: "Build stronger boundaries",
      secondaryHref: "/boundaries-course",
    };
  }

  if (haystack.includes("boundar")) {
    return {
      label: "Build stronger boundaries",
      href: "/boundaries-course",
      description: "If the real issue is holding the line, don’t stop at reading. Work through the boundaries course next.",
      secondaryLabel: "Take the helping vs enabling assessment",
      secondaryHref: "/helping-or-enabling",
    };
  }

  if (haystack.includes("enabling") || haystack.includes("codependency")) {
    return {
      label: "Take the helping vs enabling assessment",
      href: "/helping-or-enabling",
      description: "If you keep wondering whether your support is actually helping, start with the assessment and get a clearer read.",
      secondaryLabel: "Get the family support guide",
      secondaryHref: "/family-support-guide",
    };
  }

  if (haystack.includes("family") || haystack.includes("recovery") || haystack.includes("addiction")) {
    return {
      label: "Get the family support guide",
      href: "/family-support-guide",
      description: "If this article feels close to home, the best next move is a steadier starting point instead of more frantic searching.",
      secondaryLabel: "Get practical guidance by email",
      secondaryHref: "#newsletter",
    };
  }

  return {
    label: "Start with the family support guide",
    href: "/family-support-guide",
    description: "If this hit a nerve, take the next structured step instead of trying to carry it all in your head.",
    secondaryLabel: "Browse more articles",
    secondaryHref: "/articles",
  };
};

const isHighIntentArticle = (article: { title: string; categories: string[] }) => {
  const haystack = `${article.title} ${article.categories.join(" ")}`.toLowerCase();
  const highIntentTerms = [
    "crisis",
    "safety",
    "unsafe",
    "violence",
    "threat",
    "intervention",
    "refuses",
    "refusal",
    "alcoholic",
    "alcohol",
    "spouse",
    "partner",
    "adult child",
    "financial",
    "money",
    "rent",
    "bills",
    "after treatment",
    "after rehab",
    "relapse",
    "boundary",
    "enabling",
    "codependency",
  ];

  return highIntentTerms.some((term) => haystack.includes(term));
};

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const initialArticleContent = useInitialArticleContent();
  const article = blogPostsMeta.find((post) => post.slug === slug);
  const [copied, setCopied] = useState(false);
  const [articleContent, setArticleContent] = useState<string | null>(() => {
    if (!slug) return null;

    if (initialArticleContent?.slug === slug && initialArticleContent.content) {
      return initialArticleContent.content;
    }

    if (typeof window !== "undefined") {
      const hydratedArticle = (window as Window & {
        __ARTICLE_CONTENT__?: { slug?: string; content?: string };
      }).__ARTICLE_CONTENT__;

      if (hydratedArticle?.slug === slug && hydratedArticle.content) {
        return hydratedArticle.content;
      }
    }

    return null;
  });
  const viewRecorded = useRef(false);
  const { markAsRead } = useReadingProgress();

  const relatedPosts = useMemo(() => {
    if (!article) return [];
    const others = blogPostsMeta.filter((p) => p.slug !== slug);
    const scored = others.map((post) => {
      const sharedCategories = post.categories.filter((cat) => article.categories.includes(cat)).length;
      return { post, score: sharedCategories };
    });
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    });
    return scored.slice(0, 4).map((s) => s.post);
  }, [article, slug]);

  const midArticleSuggestion = useMemo(() => {
    return relatedPosts.length > 2 ? relatedPosts[2] : relatedPosts[0] || null;
  }, [relatedPosts]);

  const articleSections = useMemo(() => {
    if (!articleContent) return [];
    return getArticleSections(articleContent);
  }, [articleContent]);

  const tableOfContents = useMemo(() => {
    if (!articleContent) return [];
    return getArticleHeadings(articleContent);
  }, [articleContent]);

  const articleFaqs = useMemo(() => {
    if (!articleContent) return [];
    return extractArticleFaqs(articleContent);
  }, [articleContent]);

  const wordCount = useMemo(() => {
    if (!articleContent) return undefined;
    return getWordCount(articleContent);
  }, [articleContent]);

  const articleUrl = `https://nomoreenabling.com/articles/${slug}`;
  const imageUrl = article?.image?.startsWith("http") ? article.image : `https://nomoreenabling.com${article?.image}`;
  const primaryCta = article ? getPrimaryCta(article) : null;
  const showStickyCta = article ? isHighIntentArticle(article) : false;
  const matchingHubs = article
    ? topicHubs
        .map((hub) => {
          const categoryMatches = article.categories.filter((category) => hub.categories.includes(category)).length;
          const featuredMatch = hub.featuredSlugs.includes(article.slug) ? 3 : 0;
          return { hub, score: categoryMatches + featuredMatch };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(({ hub }) => hub)
    : [];

  const trackArticleIntentClick = (href: string, label: string, slot: "primary" | "secondary") => {
    if (!article) return;

    void trackFunnelEvent("article_intent_cta_click", {
      source: "article_intent_cta",
      articleSlug: article.slug,
      targetHref: href,
      metadata: {
        label,
        slot,
        articleTitle: article.title,
      },
    });
  };

  const trackTopicHubClick = (hub: (typeof topicHubs)[number]) => {
    if (!article) return;

    void trackFunnelEvent("topic_hub_cta_click", {
      source: "article_topic_hub_block",
      articleSlug: article.slug,
      targetHref: `/topic-hubs/${hub.slug}`,
      metadata: {
        hubSlug: hub.slug,
        hubTitle: hub.shortTitle,
        articleTitle: article.title,
      },
    });
  };

  const trackAllTopicHubsClick = () => {
    if (!article) return;

    void trackFunnelEvent("topic_hub_cta_click", {
      source: "article_topic_hub_block",
      articleSlug: article.slug,
      targetHref: "/topic-hubs",
      metadata: {
        hubSlug: "all",
        hubTitle: "All Topic Hubs",
        articleTitle: article.title,
      },
    });
  };

  const getISODate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [article]);

  useEffect(() => {
    viewRecorded.current = false;
  }, [slug]);

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setArticleContent(null);
      return;
    }

    const hydratedArticle = typeof window !== "undefined"
      ? (window as Window & {
          __ARTICLE_CONTENT__?: { slug?: string; content?: string };
        }).__ARTICLE_CONTENT__
      : undefined;

    if (hydratedArticle?.slug === slug && hydratedArticle.content) {
      setArticleContent(hydratedArticle.content);
      return;
    }

    const loadArticleContent = articleContentLoaders[slug];

    if (!loadArticleContent) {
      setArticleContent(null);
      return;
    }

    setArticleContent((current) => (article?.slug === slug ? current : null));

    loadArticleContent()
      .then((module) => {
        if (!cancelled) {
          setArticleContent(module.default);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setArticleContent(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, article?.slug, initialArticleContent]);

  useEffect(() => {
    if (slug && !viewRecorded.current) {
      viewRecorded.current = true;
      markAsRead(slug);
      supabase.from("article_views").insert({ article_slug: slug }).then(() => {
        // View recorded silently
      });
      if (article) {
        const prodOrigin = "https://nomoreenabling.com";
        const resolvedImage = article.image?.startsWith("http") ? article.image : `${prodOrigin}${article.image}`;
        const imgUrl = resolvedImage.includes("/src/assets/") ? `${prodOrigin}/favicon.jpg` : resolvedImage;
        supabase
          .from("articles_metadata")
          .upsert(
            {
              slug: slug,
              title: article.metaTitle || article.title,
              description: article.metaDescription || article.excerpt,
              image_url: imgUrl,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "slug" }
          )
          .then(() => {
            // Metadata synced silently
          });
      }
    }
  }, [slug, markAsRead, article]);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://ctqbadyfhcoxhywrkorf.supabase.co`;
  const sharePreviewUrl = `${supabaseUrl}/functions/v1/sharepreview/${slug}`;
  const shareTitle = article?.title || "";
  const directShareUrl = articleUrl;

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePreviewUrl)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareOnX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(sharePreviewUrl)}&text=${encodeURIComponent(shareTitle)}`,
      "_blank",
      "width=600,height=400"
    );
  };

  const shareViaEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`Check out this article: ${directShareUrl}`)}`;
  };

  const shareNatively = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: shareTitle,
        text: article?.excerpt,
        url: directShareUrl,
      });
    } catch {
      // Ignore cancelled shares
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(directShareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "The article link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL from your browser's address bar.",
        variant: "destructive",
      });
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article not found</h1>
            <Link to="/articles">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to articles
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title={article.metaTitle || article.title}
        description={article.metaDescription || article.excerpt}
        canonicalUrl={articleUrl}
        ogType="article"
        ogImage={imageUrl}
        ogImageAlt={article.title}
        articlePublishedTime={getISODate(article.date)}
        articleAuthor="Matt Brown"
        keywords={article.categories.join(", ")}
      />
      <ArticleJsonLd
        title={article.title}
        description={article.metaDescription || article.excerpt}
        image={imageUrl}
        datePublished={getISODate(article.date)}
        url={articleUrl}
        authorName="Matt Brown"
        articleSection={article.category}
        keywords={article.categories}
        wordCount={wordCount}
      />
      {articleFaqs.length > 0 && <FAQJsonLd faqs={articleFaqs} />}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: "https://nomoreenabling.com" },
          { name: "Articles", url: "https://nomoreenabling.com/articles" },
          { name: article.title, url: articleUrl },
        ]}
      />
      {articleContent && (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ARTICLE_CONTENT__ = ${JSON.stringify({ slug, content: articleContent }).replace(/</g, "\\u003c")};`,
          }}
        />
      )}
      <Header />

      <main className="flex-1" role="main">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
            loading="eager"
            width={1200}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="flex gap-8 max-w-6xl mx-auto">
            <div className="flex-1 max-w-3xl">
              <Link to="/articles" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to articles
              </Link>

              <article className="bg-card rounded-xl shadow-lg p-6 md:p-10">
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    {article.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {article.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {article.readTime}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{article.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">{article.excerpt}</p>

                <div className="rounded-xl bg-secondary/40 border border-border p-5 mb-8">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Why this is here</p>
                  <p className="text-muted-foreground mt-2">
                    Families rarely need more pressure. They need clearer patterns, steadier boundaries, and a next step they can actually hold.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-background p-5 mb-8">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Written from intervention experience</p>
                  <p className="text-muted-foreground mt-2">
                    This article is part of No More Enabling’s family education library, shaped by Matt Brown’s work with families affected by addiction,
                    treatment resistance, relapse, and boundary breakdowns since 2004.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    <Link to="/about" className="text-primary hover:underline">About Matt Brown</Link>
                    <Link to="/work-with-matt" className="text-primary hover:underline">Request family guidance</Link>
                  </div>
                </div>

                {tableOfContents.length > 2 && (
                  <nav className="rounded-2xl border border-border bg-secondary/30 p-5 mb-8" aria-label="Article table of contents">
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">In this guide</p>
                    <ol className="mt-4 grid gap-2 sm:grid-cols-2">
                      {tableOfContents.map((heading) => (
                        <li key={heading.id}>
                          <a href={`#${heading.id}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                {matchingHubs.length > 0 && (
                  <div className="rounded-2xl border border-border bg-card p-5 mb-8">
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">Read this as part of a bigger pattern</p>
                    <p className="text-muted-foreground mt-2">If this article hits home, these guided hubs will help you keep reading in a smarter order instead of starting from scratch each time.</p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {matchingHubs.map((hub) => (
                        <Link
                          key={hub.slug}
                          to={`/topic-hubs/${hub.slug}`}
                          onClick={() => trackTopicHubClick(hub)}
                          className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors"
                        >
                          <p className="font-medium text-foreground">{hub.shortTitle} Hub</p>
                          <p className="text-sm text-muted-foreground mt-1">{hub.bestFor}</p>
                          <p className="mt-3 text-sm font-medium text-primary">Open hub →</p>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/topic-hubs"
                      onClick={trackAllTopicHubsClick}
                      className="inline-flex mt-4 text-sm font-medium text-primary hover:underline"
                    >
                      Browse every guided hub →
                    </Link>
                  </div>
                )}

                {primaryCta && (
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-8">
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">If this article sounds like your family</p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Do this next</h2>
                    <p className="text-muted-foreground mt-3 max-w-2xl">{primaryCta.description}</p>
                    <div className="mt-5 flex flex-col sm:flex-row gap-3">
                      <Button asChild>
                        <Link
                          to={primaryCta.href}
                          onClick={() => trackArticleIntentClick(primaryCta.href, primaryCta.label, "primary")}
                        >
                          {primaryCta.label}
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        {primaryCta.secondaryHref.startsWith("#") ? (
                          <a
                            href={primaryCta.secondaryHref}
                            onClick={() => trackArticleIntentClick(primaryCta.secondaryHref, primaryCta.secondaryLabel, "secondary")}
                          >
                            {primaryCta.secondaryLabel}
                          </a>
                        ) : (
                          <Link
                            to={primaryCta.secondaryHref}
                            onClick={() => trackArticleIntentClick(primaryCta.secondaryHref, primaryCta.secondaryLabel, "secondary")}
                          >
                            {primaryCta.secondaryLabel}
                          </Link>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {primaryCta && showStickyCta && (
                  <div className="sticky top-24 z-20 mb-8 lg:hidden">
                    <ArticleStickyCTA
                      title="Choose your next step"
                      description="If this article sounds like your family, use the short assessment to route the situation before the next hard conversation."
                      primaryLabel="Take the family assessment"
                      primaryHref="/family-situation-assessment"
                      secondaryLabel={primaryCta.label}
                      secondaryHref={primaryCta.href}
                      articleSlug={article.slug}
                      ctaLocation="article_mobile_sticky"
                      compact
                    />
                  </div>
                )}

                <div className="mb-8">
                  <CoachingInterventionCTA variant="compact" />
                </div>

                <div className="flex items-center gap-2 mb-8 pb-6 border-b border-border flex-wrap">
                  <span className="text-sm text-muted-foreground mr-2">Share:</span>
                  {typeof navigator !== "undefined" && navigator.share && (
                    <button
                      onClick={shareNatively}
                      className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      aria-label="Share article"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={shareOnFacebook}
                    className="p-2 rounded-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90 transition-colors"
                    aria-label="Share on Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareOnX}
                    className="p-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
                    aria-label="Share on X"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={shareViaEmail}
                    className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                    aria-label="Share via Email"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                  <button
                    onClick={copyLink}
                    className="p-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
                    aria-label="Copy link"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Link2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="mb-8">
                  <AdSpace size="leaderboard" placementKey="article_top_leaderboard" />
                </div>

                {articleContent ? (
                  <div className="prose prose-lg max-w-none text-foreground/90 prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90 prose-strong:text-foreground">
                    {articleSections.map((section, index) => (
                      <div key={index}>
                        {index === Math.floor(articleSections.length / 2) && midArticleSuggestion && (
                          <RelatedArticleCallout
                            title={midArticleSuggestion.title}
                            slug={midArticleSuggestion.slug}
                            excerpt={midArticleSuggestion.excerpt}
                          />
                        )}
                        <div dangerouslySetInnerHTML={{ __html: section }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border bg-secondary/30 p-6 text-muted-foreground">
                    Loading article…
                  </div>
                )}

                <div className="mt-10 pt-8 border-t border-border">
                  <div className="rounded-2xl bg-secondary/40 border border-border p-6 mb-8">
                    <p className="text-sm uppercase tracking-wide text-primary font-medium">Need a steadier next step?</p>
                    <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Don’t stop at insight</h2>
                    <p className="text-muted-foreground mt-3 max-w-2xl">
                      The families who make progress usually do three things: they get honest about the pattern, choose one clearer next step, and stop trying to manage everything at once.
                    </p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <Link to="/helping-or-enabling" className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                        <p className="font-medium text-foreground">Helping or Enabling? Tool</p>
                        <p className="text-sm text-muted-foreground mt-1">Best when you keep second-guessing what support should look like.</p>
                      </Link>
                      <Link to="/family-support-guide" className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                        <p className="font-medium text-foreground">Family Support Guide</p>
                        <p className="text-sm text-muted-foreground mt-1">Best when everything feels heavy, urgent, or emotionally scrambled.</p>
                      </Link>
                      <Link to="/boundaries-course" className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                        <p className="font-medium text-foreground">Free Boundaries Course</p>
                        <p className="text-sm text-muted-foreground mt-1">Best when your limits keep getting negotiated away under pressure.</p>
                      </Link>
                      <Link to="/about" className="rounded-xl border border-border bg-background p-4 hover:border-primary/40 transition-colors">
                        <p className="font-medium text-foreground">About Matt Brown and this site</p>
                        <p className="text-sm text-muted-foreground mt-1">Understand the experience and point of view behind the guidance here.</p>
                      </Link>
                    </div>
                  </div>
                  <AdSpace size="leaderboard" placementKey="article_bottom_leaderboard" />
                </div>
              </article>

              <div className="mt-12 mb-16">
                <h2 className="font-serif text-2xl font-bold text-foreground mb-2">Continue reading</h2>
                <p className="text-muted-foreground text-sm mb-6">More articles on similar topics</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {relatedPosts.slice(0, 4).map((post) => (
                    <Link
                      key={post.id}
                      to={`/articles/${post.slug}`}
                      className="group bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width={640}
                          height={360}
                        />
                      </div>
                      <div className="p-4">
                        <span className="text-xs text-primary font-medium">{post.category}</span>
                        <h3 className="font-semibold text-foreground mt-1 group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{post.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <aside className="hidden lg:block w-80 flex-shrink-0" aria-label="Sponsored content">
              <div className="sticky top-24 space-y-6">
                {primaryCta && showStickyCta && (
                  <ArticleStickyCTA
                    title="Do this before the next conversation"
                    description="Take the family assessment, get a route, and move toward the right offer instead of reading one more article in panic."
                    primaryLabel="Take the assessment"
                    primaryHref="/family-situation-assessment"
                    secondaryLabel={primaryCta.label}
                    secondaryHref={primaryCta.href}
                    articleSlug={article.slug}
                    ctaLocation="article_sidebar_sticky"
                  />
                )}
                <div className="rounded-2xl border border-border bg-card p-6">
                  <p className="text-sm uppercase tracking-wide text-primary font-medium">Author perspective</p>
                  <h2 className="font-serif text-2xl font-bold text-foreground mt-2">Matt Brown</h2>
                  <p className="text-muted-foreground mt-3 text-sm">
                    Professional interventionist helping families navigate addiction, treatment resistance, relapse, and recovery planning since 2004.
                  </p>
                  <Link to="/about" className="inline-flex items-center gap-2 mt-4 text-primary hover:underline text-sm">
                    Learn more about the site
                    <ArrowLeft className="w-3 h-3 rotate-180" />
                  </Link>
                </div>
                <AdSpace size="sidebar" placementKey="article_sidebar" />
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ArticlePage;
