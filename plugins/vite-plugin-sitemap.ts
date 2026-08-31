import { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";

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
        const appFilePath = path.resolve(__dirname, "../src/App.tsx");
        const metaContent = fs.readFileSync(metaFilePath, "utf-8");
        const topicHubContent = fs.readFileSync(topicHubFilePath, "utf-8");
        const supportOffersContent = fs.readFileSync(supportOffersFilePath, "utf-8");
        const appContent = fs.readFileSync(appFilePath, "utf-8");

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

        const { generateSitemapXml, staticPages } = await import("../scripts/generate-sitemap");

        const repoRoot = path.resolve(__dirname, "..");
        const today = new Date().toISOString().slice(0, 10);
        const gitDateCache = new Map<string, string>();
        const gitLastModified = (relativePath: string) => {
          if (gitDateCache.has(relativePath)) return gitDateCache.get(relativePath)!;
          const dirty = spawnSync("git", ["status", "--porcelain", "--", relativePath], { cwd: repoRoot, encoding: "utf8" }).stdout.trim();
          if (dirty) {
            gitDateCache.set(relativePath, today);
            return today;
          }
          const result = spawnSync("git", ["log", "-1", "--format=%cs", "--", relativePath], { cwd: repoRoot, encoding: "utf8" });
          const value = result.status === 0 ? result.stdout.trim() : "";
          const date = /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : today;
          gitDateCache.set(relativePath, date);
          return date;
        };

        const componentFiles = new Map<string, string>();
        for (const [, component, pageFile] of appContent.matchAll(/import\s+([A-Za-z0-9_]+)\s+from\s+["']\.\/pages\/([^"']+)["']/g)) {
          componentFiles.set(component, `src/pages/${pageFile}.tsx`);
        }
        const routeSourceFiles = new Map<string, string>();
        for (const [, route, component] of appContent.matchAll(/<Route\s+path="([^"]+)"[\s\S]{0,160}?element=\{<([A-Za-z0-9_]+)/g)) {
          routeSourceFiles.set(route, componentFiles.get(component) || "src/App.tsx");
        }

        const lastmods: Record<string, string> = {};
        for (const page of staticPages) {
          let source = routeSourceFiles.get(page.path) || "src/App.tsx";
          if (page.path.startsWith("/answers/") || page.path.startsWith("/glossary/")) source = "src/data/aeoAnswers.ts";
          if (["/intervention-help", "/family-addiction-coaching", "/addiction-intervention-for-adult-child", "/alcohol-intervention-help", "/what-to-do-when-they-refuse-treatment", "/family-addiction-consultation"].includes(page.path)) source = "src/data/commercialIntentPages.ts";
          lastmods[page.path] = gitLastModified(source);
        }
        for (const article of articles) {
          const sourceSlug = article.slug === "codependency-spouses-parents-siblings-addiction"
            ? "codependency-spouses-parents-siblings"
            : article.slug;
          const sourcePath = `src/data/article-content/${sourceSlug}.ts`;
          if (!fs.existsSync(path.resolve(repoRoot, sourcePath))) {
            throw new Error(`Missing article content source for sitemap route: ${article.slug}`);
          }
          lastmods[`/articles/${article.slug}`] = gitLastModified(sourcePath);
        }
        const metaDate = gitLastModified("src/data/blogPostMeta.ts");
        for (const category of categories) lastmods[`/category/${category}`] = metaDate;
        const topicDate = gitLastModified("src/data/topicHubs.ts");
        for (const hub of topicHubs) lastmods[`/topic-hubs/${hub}`] = topicDate;
        const supportDate = gitLastModified("src/data/supportOffers.ts");
        for (const offer of supportOffers) lastmods[`/support/${offer}`] = supportDate;

        const xml = generateSitemapXml({
          articles,
          categories: Array.from(categories).sort(),
          topicHubs,
          supportOffers,
          lastmods,
        });

        const distPath = path.resolve(__dirname, "../dist/sitemap.xml");
        fs.writeFileSync(distPath, xml, "utf-8");
        fs.writeFileSync(path.resolve(__dirname, "../public/sitemap.xml"), xml, "utf-8");
        console.log(`✅ Sitemap generated with ${articles.length} articles, ${categories.size} categories, ${topicHubs.length} topic hubs, and ${supportOffers.length} support pages`);
      } catch (err) {
        console.error("❌ Failed to generate sitemap:", err);
        throw err;
      }
    },
  };
}
