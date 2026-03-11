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

// Static pages with their priorities and change frequencies
const staticPages: { path: string; priority: string; changefreq: string }[] = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/articles", priority: "0.9", changefreq: "weekly" },
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

export function generateSitemapXml(slugs: string[]): string {
  const urls: string[] = [];

  // Add static pages
  for (const page of staticPages) {
    urls.push(`  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`);
  }

  // Add article pages
  for (const slug of slugs) {
    urls.push(`  <url>
    <loc>${DOMAIN}/articles/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;
}
