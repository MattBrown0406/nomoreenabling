import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

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

const toOutputPath = (route) => {
  if (route === "/") return path.join(distDir, "index.html");
  const cleanRoute = route.replace(/^\//, "").replace(/\/+$/, "");
  return path.join(distDir, cleanRoute, "index.html");
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
  server: { middlewareMode: true, hmr: false },
});

try {
  const template = await fs.readFile(path.join(distDir, "index.html"), "utf8");
  const manifest = JSON.parse(await fs.readFile(path.join(distDir, ".vite", "manifest.json"), "utf8"));
  const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const { prerenderRoutes } = await vite.ssrLoadModule("/src/prerender-routes.ts");

  for (const route of prerenderRoutes) {
    const result = await render(route);
    const html = injectPrerenderedHtml(template, result, manifest);
    const outputPath = toOutputPath(route);

    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, html, "utf8");
  }

  console.log(`✅ Prerendered ${prerenderRoutes.length} routes`);
} finally {
  await vite.close();
}
