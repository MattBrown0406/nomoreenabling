import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Vite sometimes logs "✘ [ERROR] The build was canceled" on clean shutdown in constrained
// environments (even when prerender succeeds). It is noise for this script, so silence it.
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = String(args[0] ?? "");
  if (message.includes("The build was canceled")) return;
  originalConsoleError(...args);
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

const replaceAssetPaths = (content, manifest) => {
  return content.replace(/(https:\/\/nomoreenabling\.com)?\/src\/assets\/([^"')>\s]+)/g, (match, origin, assetName) => {
    const manifestKey = Object.keys(manifest).find((key) => key.endsWith(`/src/assets/${assetName}`) || key.endsWith(`/assets/${assetName}`) || key === `src/assets/${assetName}` || key === `assets/${assetName}`);

    if (!manifestKey) return match;

    const assetPath = `/${manifest[manifestKey].file}`;
    return origin ? `${origin}${assetPath}` : assetPath;
  });
};

const toOutputPaths = (route) => {
  if (route === "/") return [path.join(distDir, "index.html")];

  const cleanRoute = route.replace(/^\//, "").replace(/\/+$/, "");

  return [path.join(distDir, cleanRoute, "index.html")];
};

const stripDefaultSeoTags = (template) => {
  return template
    .replace(/\s*<!-- Default meta[^]*?-->\s*/i, "\n")
    .replace(/\s*<title>[^<]*<\/title>\s*/i, "\n")
    .replace(/\s*<meta\s+name=["']description["'][^>]*>\s*/i, "\n");
};

const injectPrerenderedHtml = (template, { html, head }, manifest) => {
  const renderedHtml = replaceAssetPaths(html, manifest);
  const renderedHead = replaceAssetPaths(head, manifest);
  const cleanedTemplate = stripDefaultSeoTags(template);

  return cleanedTemplate
    .replace("<div id=\"root\"></div>", `<div id=\"root\">${renderedHtml}</div>`)
    .replace("</head>", `${renderedHead}\n</head>`);
};

const vite = await createServer({
  root,
  logLevel: "error",
  appType: "custom",
  optimizeDeps: { disabled: true },
  server: {
    middlewareMode: true,
    hmr: false,
    ws: false,
    host: "127.0.0.1",
  },
});

try {
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");
  const manifest = JSON.parse(await fs.readFile(path.join(distDir, ".vite", "manifest.json"), "utf8"));
  const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const { prerenderRoutes, prerenderAliases } = await vite.ssrLoadModule("/src/prerender-routes.ts");

  for (const route of prerenderRoutes) {
    const result = await render(route);
    const html = injectPrerenderedHtml(template, result, manifest);
    const outputPaths = toOutputPaths(route);

    for (const outputPath of outputPaths) {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, html, "utf8");
    }
  }

  console.log(`✅ Prerendered ${prerenderRoutes.length} routes`);

  const notFoundHtml = await fs.readFile(path.join(distDir, "404", "index.html"), "utf8");
  await fs.writeFile(path.join(distDir, "404.html"), notFoundHtml, "utf8");

  let aliasCount = 0;
  for (const [alias, target] of Object.entries(prerenderAliases)) {
    const targetPath = toOutputPaths(target)[0];
    try {
      const targetHtml = await fs.readFile(targetPath, "utf8");
      for (const outputPath of toOutputPaths(alias)) {
        await fs.mkdir(path.dirname(outputPath), { recursive: true });
        await fs.writeFile(outputPath, targetHtml, "utf8");
      }
      aliasCount += 1;
    } catch {
      throw new Error(`Cannot prerender alias ${alias}: canonical target ${target} was not generated.`);
    }
  }
  console.log(`✅ Prerendered ${aliasCount} canonical aliases`);

  // Emit a machine-readable blog feed used by the weekly digest email function.
  const { blogPostsMeta } = await vite.ssrLoadModule("/src/data/blogPostMeta.ts");
  const feed = blogPostsMeta.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.category,
    readTime: post.readTime,
    date: post.date,
    url: `https://nomoreenabling.com/articles/${post.slug}`,
    // Some posts use an absolute (external) image URL; only prefix site-relative paths.
    image: /^https?:\/\//i.test(String(post.image))
      ? String(post.image)
      : replaceAssetPaths(`https://nomoreenabling.com${String(post.image)}`, manifest),
  }));
  await fs.writeFile(
    path.join(distDir, "blog-feed.json"),
    JSON.stringify({ generated_at: new Date().toISOString(), posts: feed }, null, 2),
    "utf8",
  );
  console.log(`✅ Wrote blog-feed.json (${feed.length} posts)`);
} finally {
  await vite.close();
}
