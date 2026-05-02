import { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Vite plugin that auto-generates sitemap.xml during build.
 * It reads route data from the same source files the app uses and combines
 * articles, categories, topic hubs, and static routes.
 */
export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        const metaFilePath = path.resolve(__dirname, "../src/data/blogPostMeta.ts");
        const topicHubFilePath = path.resolve(__dirname, "../src/data/topicHubs.ts");
        const supportOffersFilePath = path.resolve(__dirname, "../src/data/supportOffers.ts");
        const metaContent = fs.readFileSync(metaFilePath, "utf-8");
        const topicHubContent = fs.readFileSync(topicHubFilePath, "utf-8");
        const supportOffersContent = fs.readFileSync(supportOffersFilePath, "utf-8");

        const articles: { slug: string; date?: string }[] = [];
        const categories = new Set<string>();
        const articleBlockRegex = /\{\s*id:\s*["'][^"']+["'][\s\S]*?slug:\s*["']([^"']+)["'][\s\S]*?\}/g;
        let articleMatch: RegExpExecArray | null;
        while ((articleMatch = articleBlockRegex.exec(metaContent)) !== null) {
          const block = articleMatch[0];
          const slug = articleMatch[1];
          const date = block.match(/date:\s*["']([^"']+)["']/)?.[1];
          const categoriesText = block.match(/categories:\s*\[([^\]]+)\]/)?.[1] ?? "";

          if (!articles.some((article) => article.slug === slug)) {
            articles.push({ slug, date });
          }

          for (const category of categoriesText.matchAll(/["']([^"']+)["']/g)) {
            categories.add(category[1].toLowerCase().replace(/\s+/g, "-"));
          }
        }

        const topicHubs = Array.from(topicHubContent.matchAll(/slug:\s*["']([^"']+)["']/g))
          .map((match) => match[1])
          .filter((slug, index, all) => all.indexOf(slug) === index);

        const supportOffers = Array.from(supportOffersContent.matchAll(/slug:\s*["']([^"']+)["']/g))
          .map((match) => match[1])
          .filter((slug, index, all) => all.indexOf(slug) === index);

        const { generateSitemapXml } = await import("../scripts/generate-sitemap");
        const xml = generateSitemapXml({
          articles,
          categories: Array.from(categories).sort(),
          topicHubs,
          supportOffers,
        });

        const distPath = path.resolve(__dirname, "../dist/sitemap.xml");
        fs.writeFileSync(distPath, xml, "utf-8");
        console.log(`✅ Sitemap generated with ${articles.length} articles, ${categories.size} categories, ${topicHubs.length} topic hubs, and ${supportOffers.length} support pages`);
      } catch (err) {
        console.error("⚠️ Failed to generate sitemap:", err);
      }
    },
  };
}
