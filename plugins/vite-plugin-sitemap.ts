import { Plugin } from "vite";
import fs from "fs";
import path from "path";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";

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
        const isIsoDate = (value: string | undefined): value is string => Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value));
        const runGit = (args: string[]) => {
          const result = spawnSync("git", args, { cwd: repoRoot, encoding: "utf8" });
          // stdout is undefined when git isn't installed; never crash the build on it.
          return { ok: result.status === 0, out: result.stdout?.trim() ?? "" };
        };
        // A shallow clone (the norm on build hosts) only has the latest commit,
        // so `git log -1 -- <file>` returns that commit's date for EVERY file and
        // every URL got the same lastmod. Only trust git with full history.
        const gitHistoryUsable = (() => {
          const shallow = runGit(["rev-parse", "--is-shallow-repository"]);
          if (!shallow.ok) return false;
          if (shallow.out === "false") return true;
          // Build hosts usually clone with --depth 1. On CI only (never on a
          // developer machine, where it would rewrite the clone's config),
          // fetch the commit graph without file contents so real per-file
          // dates are available. Set SITEMAP_SKIP_UNSHALLOW=1 to disable.
          if (!process.env.CI || process.env.SITEMAP_SKIP_UNSHALLOW) return false;
          const result = spawnSync("git", ["fetch", "--quiet", "--unshallow", "--filter=blob:none"], {
            cwd: repoRoot,
            encoding: "utf8",
            timeout: 120_000,
            // Never stall a build on a credential prompt.
            env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
          });
          return result.status === 0 && runGit(["rev-parse", "--is-shallow-repository"]).out === "false";
        })();
        // Fallback: the lastmod each URL had in the previously generated sitemap.
        const previousLastmods = new Map<string, string>();
        try {
          const previousXml = fs.readFileSync(path.resolve(__dirname, "../public/sitemap.xml"), "utf-8");
          for (const [, loc, lastmod] of previousXml.matchAll(/<loc>https:\/\/nomoreenabling\.com([^<]*)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
            previousLastmods.set((loc || "/").replace(/&amp;/g, "&"), lastmod);
          }
        } catch {
          /* no previous sitemap */
        }
        const toIsoDate = (value: string | undefined) => {
          if (!value) return undefined;
          const parsed = new Date(value);
          if (Number.isNaN(parsed.getTime())) return undefined;
          return new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())).toISOString().slice(0, 10);
        };
        // Content-hash manifest: lets a shallow clone tell which source files
        // changed since the manifest was last written (by a full-history build
        // or a previous build), so edited pages get a fresh lastmod instead of
        // inheriting the previous sitemap's date forever.
        const manifestPath = path.resolve(__dirname, "../scripts/sitemap-lastmods.json");
        let manifest: Record<string, { hash: string; lastmod: string }> = {};
        try {
          manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        } catch {
          /* first run */
        }
        const nextManifest: typeof manifest = {};
        const headCommitDate = (() => {
          const value = runGit(["log", "-1", "--format=%cs"]).out;
          return isIsoDate(value) ? value : today;
        })();
        // Files touched by the checked-out commit (empty for a depth-1 clone,
        // whose commit has no parent locally).
        const changedInHead = new Set(
          runGit(["diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD"]).out.split("\n").filter(Boolean),
        );
        // git's own object hash applies the repo's line-ending normalization,
        // so a CRLF checkout doesn't look like an edit. Fall back to raw bytes.
        const fileHash = (relativePath: string) => {
          const gitHash = runGit(["hash-object", "--", relativePath]);
          if (gitHash.ok && /^[0-9a-f]{40,64}$/.test(gitHash.out)) return gitHash.out;
          return createHash("sha1").update(fs.readFileSync(path.resolve(repoRoot, relativePath))).digest("hex");
        };

        const fileDateCache = new Map<string, string | undefined>();
        const staleWithoutHistory: string[] = [];
        const fileLastModified = (relativePath: string): string | undefined => {
          if (fileDateCache.has(relativePath)) return fileDateCache.get(relativePath);
          const hash = fileHash(relativePath);
          const dirty = Boolean(runGit(["status", "--porcelain", "--", relativePath]).out);
          let date: string | undefined;
          if (dirty) {
            date = today;
          } else if (gitHistoryUsable) {
            const value = runGit(["log", "-1", "--format=%cs", "--", relativePath]).out;
            date = isIsoDate(value) ? value : undefined;
          } else if (changedInHead.has(relativePath)) {
            date = headCommitDate;
          } else if (manifest[relativePath]) {
            // No usable history (the CI unshallow failed or was skipped).
            // Keep the recorded date: re-dating changed files to the deployed
            // commit would move their lastmod on every deploy, since CI never
            // commits the manifest back. Keep the old hash too, so the change
            // is still detected by the next full-history build.
            date = manifest[relativePath].lastmod;
            if (manifest[relativePath].hash !== hash) {
              staleWithoutHistory.push(relativePath);
              nextManifest[relativePath] = manifest[relativePath];
              fileDateCache.set(relativePath, date);
              return date;
            }
          }
          if (date) nextManifest[relativePath] = { hash, lastmod: date };
          fileDateCache.set(relativePath, date);
          return date;
        };
        const gitLastModified = (relativePath: string, routePath: string, fallbackDate?: string) => {
          const fileDate = fileLastModified(relativePath);
          if (fileDate) return fileDate;
          const previous = previousLastmods.get(routePath);
          const resolved = (isIsoDate(previous) ? previous : undefined) ?? toIsoDate(fallbackDate) ?? today;
          // Seed the manifest so the next build can detect changes to this file.
          if (!nextManifest[relativePath]) nextManifest[relativePath] = { hash: fileHash(relativePath), lastmod: resolved };
          return resolved;
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
          lastmods[page.path] = gitLastModified(source, page.path);
        }
        for (const article of articles) {
          const sourceSlug = article.slug === "codependency-spouses-parents-siblings-addiction"
            ? "codependency-spouses-parents-siblings"
            : article.slug;
          const sourcePath = `src/data/article-content/${sourceSlug}.ts`;
          if (!fs.existsSync(path.resolve(repoRoot, sourcePath))) {
            throw new Error(`Missing article content source for sitemap route: ${article.slug}`);
          }
          lastmods[`/articles/${article.slug}`] = gitLastModified(sourcePath, `/articles/${article.slug}`, article.date);
        }
        for (const category of categories) lastmods[`/category/${category}`] = gitLastModified("src/data/blogPostMeta.ts", `/category/${category}`);
        for (const hub of topicHubs) lastmods[`/topic-hubs/${hub}`] = gitLastModified("src/data/topicHubs.ts", `/topic-hubs/${hub}`);
        for (const offer of supportOffers) lastmods[`/support/${offer}`] = gitLastModified("src/data/supportOffers.ts", `/support/${offer}`);

        if (staleWithoutHistory.length > 0) {
          console.warn(
            `[sitemap] ${staleWithoutHistory.length} changed file(s) kept their previous lastmod because git history is unavailable ` +
            `(shallow clone; unshallow skipped or failed). Run a full-history build to refresh: ${staleWithoutHistory.slice(0, 5).join(", ")}${staleWithoutHistory.length > 5 ? ", ..." : ""}`,
          );
        }

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
        fs.writeFileSync(
          manifestPath,
          `${JSON.stringify(Object.fromEntries(Object.entries({ ...manifest, ...nextManifest }).sort(([a], [b]) => a.localeCompare(b))), null, 2)}\n`,
          "utf-8",
        );
        console.log(`✅ Sitemap generated with ${articles.length} articles, ${categories.size} categories, ${topicHubs.length} topic hubs, and ${supportOffers.length} support pages`);
      } catch (err) {
        console.error("❌ Failed to generate sitemap:", err);
        throw err;
      }
    },
  };
}
