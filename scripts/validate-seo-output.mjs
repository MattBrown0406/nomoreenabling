import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://nomoreenabling.com";
const root = process.cwd();
const distDir = path.join(root, "dist");
const publicSitemap = fs.readFileSync(path.join(root, "public/sitemap.xml"), "utf8");
const distSitemap = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
const robotsTxt = fs.readFileSync(path.join(root, "public/robots.txt"), "utf8");
const redirects = fs.readFileSync(path.join(root, "public/_redirects"), "utf8");
const issues = [];

const urls = [...publicSitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const lastmods = [...publicSitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((match) => match[1]);
const extractAll = (html, regex) => [...html.matchAll(regex)].map((match) => match[1]?.trim() ?? "");
const decodeHtml = (value) => value.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'");
const outputPath = (route) => route === "/" ? path.join(distDir, "index.html") : path.join(distDir, route.replace(/^\//, ""), "index.html");

if (publicSitemap !== distSitemap) issues.push("public/sitemap.xml and dist/sitemap.xml differ.");
if (urls.length !== new Set(urls).size) issues.push("Sitemap contains duplicate URLs.");
if (urls.length !== lastmods.length) issues.push(`Sitemap has ${urls.length} URLs but ${lastmods.length} lastmod values.`);
if (urls.some((url) => !url.startsWith(`${SITE_URL}/`))) issues.push("Sitemap contains a noncanonical host or protocol.");
if (lastmods.some((date) => !/^\d{4}-\d{2}-\d{2}$/.test(date))) issues.push("Sitemap contains invalid lastmod dates.");
if (lastmods.some((date) => date > new Date().toISOString().slice(0, 10))) issues.push("Sitemap contains a future lastmod date.");
if (!robotsTxt.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) issues.push("robots.txt does not advertise the canonical sitemap.");
if (!fs.existsSync(path.join(distDir, "404.html"))) issues.push("Build does not emit the top-level Cloudflare Pages 404.html file.");
if (!redirects.includes("/article/:slug /articles/:slug 301") || !redirects.includes("/blog/:slug /articles/:slug 301")) issues.push("_redirects lacks canonical article alias redirects.");

for (const required of ["/trusted-tools", "/enabling-cost-calculator", "/tools", "/press"]) {
  if (!urls.includes(`${SITE_URL}${required}`)) issues.push(`Sitemap is missing ${required}.`);
}
for (const excluded of ["/admin", "/the-mirror/embed", "/split-house", "/divorced-parents"]) {
  if (urls.includes(`${SITE_URL}${excluded}`)) issues.push(`Sitemap includes excluded route ${excluded}.`);
}

const titleMap = new Map();
const descriptionMap = new Map();
for (const url of urls) {
  const route = new URL(url).pathname;
  const file = outputPath(route);
  if (!fs.existsSync(file)) {
    issues.push(`${route}: missing prerendered HTML.`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const titles = extractAll(html, /<title[^>]*>([\s\S]*?)<\/title>/g);
  const descriptions = extractAll(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"[^>]*>/g);
  const canonicals = extractAll(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"[^>]*>/g);
  const ogUrls = extractAll(html, /<meta[^>]+property="og:url"[^>]+content="([^"]*)"[^>]*>/g);
  const robots = extractAll(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"[^>]*>/g);
  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g).map((value) => value.replace(/<[^>]+>/g, "").trim());

  if (titles.length !== 1 || !titles[0]) issues.push(`${route}: expected one nonempty title, found ${titles.length}.`);
  if (descriptions.length !== 1 || !descriptions[0]) issues.push(`${route}: expected one nonempty description, found ${descriptions.length}.`);
  if (canonicals.length !== 1 || canonicals[0] !== url) issues.push(`${route}: canonical mismatch (${canonicals.join(", ") || "missing"}).`);
  if (ogUrls.length !== 1 || ogUrls[0] !== canonicals[0]) issues.push(`${route}: og:url mismatch.`);
  if (robots.length !== 1 || robots[0].toLowerCase().includes("noindex")) issues.push(`${route}: sitemap route lacks one indexable robots tag.`);
  if (!h1s.length || !h1s[0]) issues.push(`${route}: missing nonempty H1.`);
  if (!route.startsWith("/articles/") && titles[0] && decodeHtml(titles[0]).length > 60) issues.push(`${route}: title exceeds 60 characters.`);
  if (descriptions[0] && decodeHtml(descriptions[0]).length > 160) issues.push(`${route}: description exceeds 160 characters.`);

  if (titles[0]) titleMap.set(titles[0], [...(titleMap.get(titles[0]) || []), route]);
  if (descriptions[0]) descriptionMap.set(descriptions[0], [...(descriptionMap.get(descriptions[0]) || []), route]);

  const schemaTypes = [];
  for (const [, raw] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const value = JSON.parse(raw);
      const walk = (entry) => {
        if (Array.isArray(entry)) return entry.forEach(walk);
        if (!entry || typeof entry !== "object") return;
        if (entry["@type"]) schemaTypes.push(...(Array.isArray(entry["@type"]) ? entry["@type"] : [entry["@type"]]));
        if (entry["@graph"]) walk(entry["@graph"]);
      };
      walk(value);
    } catch (error) {
      issues.push(`${route}: invalid JSON-LD (${error.message}).`);
    }
  }
  if (route.startsWith("/articles/") && !schemaTypes.includes("BlogPosting")) issues.push(`${route}: article lacks BlogPosting schema.`);
  if (route.startsWith("/articles/") && !html.includes("window.__ARTICLE_CONTENT__")) issues.push(`${route}: article body was not included in prerendered HTML.`);
  if (route.startsWith("/answers/") && schemaTypes.includes("QAPage")) issues.push(`${route}: editorial answer still uses QAPage schema.`);
}

// Every indexable prerendered page that is its own canonical must be in the
// sitemap (catches routes added to the router/prerender list but not here).
const walkHtml = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walkHtml(full) : entry.name === "index.html" ? [full] : [];
});
const sitemapSet = new Set(urls);
for (const file of walkHtml(distDir)) {
  const route = "/" + path.relative(distDir, path.dirname(file)).split(path.sep).filter(Boolean).join("/");
  const html = fs.readFileSync(file, "utf8");
  const robots = extractAll(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"[^>]*>/g);
  const canonicals = extractAll(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"[^>]*>/g);
  const selfUrl = route === "/" ? `${SITE_URL}/` : `${SITE_URL}${route}`;
  const isCanonicalSelf = canonicals.length === 1 && canonicals[0].replace(/\/$/, "") === selfUrl.replace(/\/$/, "");
  const isIndexable = robots.length === 1 && !robots[0].toLowerCase().includes("noindex");
  if (isIndexable && isCanonicalSelf && !sitemapSet.has(selfUrl) && !sitemapSet.has(selfUrl.replace(/\/$/, ""))) {
    issues.push(`${route}: indexable prerendered page is missing from the sitemap.`);
  }
}

for (const [title, routes] of titleMap) if (routes.length > 1) issues.push(`Duplicate title on ${routes.join(", ")}: ${title}`);
for (const [description, routes] of descriptionMap) if (routes.length > 1) issues.push(`Duplicate description on ${routes.join(", ")}.`);

const unexpectedFlatHtml = fs.readdirSync(distDir)
  .filter((name) => name.endsWith(".html") && !["index.html", "404.html"].includes(name));
if (unexpectedFlatHtml.length) issues.push(`Build emitted duplicate flat HTML routes: ${unexpectedFlatHtml.slice(0, 10).join(", ")}`);

for (const route of ["/admin", "/the-mirror/embed", "/404"]) {
  const file = outputPath(route);
  if (!fs.existsSync(file)) {
    issues.push(`${route}: missing noindex prerender.`);
    continue;
  }
  const robots = extractAll(fs.readFileSync(file, "utf8"), /<meta[^>]+name="robots"[^>]+content="([^"]*)"[^>]*>/g);
  if (robots.length !== 1 || !robots[0].toLowerCase().includes("noindex")) issues.push(`${route}: expected one noindex tag.`);
}

const result = {
  sitemapUrls: urls.length,
  articleUrls: urls.filter((url) => url.includes("/articles/")).length,
  answerUrls: urls.filter((url) => url.includes("/answers/")).length,
  uniqueLastmodDates: new Set(lastmods).size,
  titleCount: titleMap.size,
  descriptionCount: descriptionMap.size,
  issues,
};
console.log(JSON.stringify(result, null, 2));
if (issues.length) process.exit(1);
