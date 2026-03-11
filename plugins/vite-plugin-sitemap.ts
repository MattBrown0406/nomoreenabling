import { Plugin } from "vite";
import fs from "fs";
import path from "path";

/**
 * Vite plugin that auto-generates sitemap.xml during build.
 * It reads all blog post slugs from the blogPosts data file
 * and combines them with static routes.
 */
export function sitemapPlugin(): Plugin {
  return {
    name: "vite-plugin-sitemap",
    apply: "build",
    async closeBundle() {
      try {
        // Dynamically read slugs from the built blogPosts data
        const dataFilePath = path.resolve(__dirname, "../src/data/blogPosts.ts");
        const content = fs.readFileSync(dataFilePath, "utf-8");

        // Extract all slugs from the source using regex
        const slugRegex = /slug:\s*["']([^"']+)["']/g;
        const slugs: string[] = [];
        let match: RegExpExecArray | null;
        while ((match = slugRegex.exec(content)) !== null) {
          // Deduplicate slugs
          if (!slugs.includes(match[1])) {
            slugs.push(match[1]);
          }
        }

        // Import the generator
        const { generateSitemapXml } = await import("../scripts/generate-sitemap");
        const xml = generateSitemapXml(slugs);

        // Write to dist/sitemap.xml
        const distPath = path.resolve(__dirname, "../dist/sitemap.xml");
        fs.writeFileSync(distPath, xml, "utf-8");
        console.log(`✅ Sitemap generated with ${slugs.length} articles and static pages`);
      } catch (err) {
        console.error("⚠️ Failed to generate sitemap:", err);
      }
    },
  };
}
