/**
 * Sitemap Generator
 * 
 * Auto-generates sitemap.xml at build time from:
 * - Static routes defined below
 * - All blog post slugs from blogPosts data
 * 
 * Run: npx tsx scripts/generate-sitemap.ts
 * Also runs automatically at build time via Vite plugin.
 */

const DOMAIN = "https://nomoreenabling.com";

export interface SitemapArticle {
  slug: string;
  date?: string;
}

export interface SitemapInput {
  articles: SitemapArticle[];
  categories?: string[];
  topicHubs?: string[];
  supportOffers?: string[];
}

// Static pages with their priorities and change frequencies
const staticPages: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/start-here", priority: "0.95", changefreq: "monthly" },
  { path: "/work-with-matt", priority: "0.95", changefreq: "monthly" },
  { path: "/family-situation-assessment", priority: "0.95", changefreq: "monthly" },
  { path: "/articles", priority: "0.9", changefreq: "weekly" },
  { path: "/topic-hubs", priority: "0.85", changefreq: "monthly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/advertise", priority: "0.7", changefreq: "monthly" },
  { path: "/boundaries-course", priority: "0.8", changefreq: "monthly" },
  { path: "/family-support-guide", priority: "0.8", changefreq: "monthly" },
  { path: "/helping-or-enabling", priority: "0.8", changefreq: "monthly" },
  { path: "/professional-guidance-signs", priority: "0.8", changefreq: "monthly" },
  { path: "/why-families-need-support", priority: "0.8", changefreq: "monthly" },
  { path: "/grounding-reminder", priority: "0.7", changefreq: "monthly" },
  { path: "/family-system-notes", priority: "0.7", changefreq: "monthly" },
  { path: "/privacy", priority: "0.5", changefreq: "monthly" },
  { path: "/terms", priority: "0.5", changefreq: "monthly" },
  { path: "/cookies", priority: "0.5", changefreq: "monthly" },
];

const toLastMod = (date?: string) => {
  if (!date) return null;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
};

const formatUrl = ({
  loc,
  changefreq,
  priority,
  lastmod,
}: {
  loc: string;
  changefreq: string;
  priority: string;
  lastmod?: string | null;
}) => `  <url>
    <loc>${loc}</loc>
${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ""}    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

export function generateSitemapXml(input: SitemapInput | string[]): string {
  const normalizedInput: SitemapInput = Array.isArray(input)
    ? { articles: input.map((slug) => ({ slug })) }
    : input;

  const urls: string[] = [];

  for (const page of staticPages) {
    urls.push(formatUrl({
      loc: `${DOMAIN}${page.path}`,
      changefreq: page.changefreq,
      priority: page.priority,
    }));
  }

  for (const category of normalizedInput.categories ?? []) {
    urls.push(formatUrl({
      loc: `${DOMAIN}/category/${category}`,
      changefreq: "weekly",
      priority: "0.75",
    }));
  }

  for (const hub of normalizedInput.topicHubs ?? []) {
    urls.push(formatUrl({
      loc: `${DOMAIN}/topic-hubs/${hub}`,
      changefreq: "monthly",
      priority: "0.8",
    }));
  }

  for (const offer of normalizedInput.supportOffers ?? []) {
    urls.push(formatUrl({
      loc: `${DOMAIN}/support/${offer}`,
      changefreq: "monthly",
      priority: "0.75",
    }));
  }

  for (const article of normalizedInput.articles) {
    urls.push(formatUrl({
      loc: `${DOMAIN}/articles/${article.slug}`,
      lastmod: toLastMod(article.date),
      changefreq: "monthly",
      priority: "0.7",
    }));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}
