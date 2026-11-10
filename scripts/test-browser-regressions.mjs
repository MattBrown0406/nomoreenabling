// Read-only production-build checks. No forms, media playback or backend calls.
// BROWSER_EXECUTABLE optionally selects an installed Chromium; BUILD_DIR can
// point at the immutable baseline to prove the regression fails before the fix.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import assert from 'node:assert/strict';
const config = JSON.parse(await readFile(new URL('./fixtures/browser-regressions.json', import.meta.url), 'utf8'));
const root = resolve(process.env.BUILD_DIR || 'dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const server = createServer(async (req, res) => {
  try {
    assert.equal(req.method, 'GET');
    const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const requested = resolve(root, '.' + path);
    assert.ok(requested === root || requested.startsWith(root + sep));
    const choices = [requested, requested + '.html', resolve(requested, 'index.html')];
    let file;
    for (const candidate of choices) if (await stat(candidate).then(s => s.isFile()).catch(() => false)) { file = candidate; break; }
    if (!file) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', mime[extname(file)] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(400).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE || undefined, args: ['--no-sandbox'] });
const failures = [];
let checked = 0;
const snapshot = () => {
  const norm = s => s.replace(/\s+/g, ' ').trim();
  return {
    title: document.title,
    description: [...document.querySelectorAll('meta[name="description"]')].map(x => x.content),
    canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(x => x.getAttribute('href')),
    schemas: [...document.querySelectorAll('script[type="application/ld+json"]')].map(x => JSON.parse(x.textContent)),
    h1: [...document.querySelectorAll('h1')].map(x => norm(x.textContent)),
    text: norm(document.querySelector('main')?.textContent || ''),
    links: [...document.querySelectorAll('main a[href]')].map(x => [norm(x.textContent), x.getAttribute('href')]),
    overflow: document.documentElement.scrollWidth - innerWidth,
  };
};
try {
  for (const width of config.widths) for (const route of config.routes) {
    let raw;
    for (const javaScriptEnabled of [false, true]) {
      const context = await browser.newContext({ javaScriptEnabled, viewport: { width, height: 900 }, serviceWorkers: 'block' });
      // These two variants are checked independently; this is NOT publication
      // approval for the randomized homepage experiment.
      if (config.storage) await context.addInitScript(storage => {
        for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value);
      }, config.storage);
      await context.route('**/*', r => {
        const req = r.request();
        if (req.method() !== 'GET' || new URL(req.url()).origin !== origin || ['fetch', 'xhr', 'media', 'websocket', 'eventsource'].includes(req.resourceType())) return r.abort();
        return r.continue();
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      try {
        const response = await page.goto(origin + route, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const actual = await page.evaluate(snapshot);
        assert.deepEqual(errors, [], 'browser runtime errors');
        assert.ok(actual.overflow <= 1, `horizontal overflow: ${actual.overflow}`);
        assert.equal(actual.h1.length, 1);
        assert.deepEqual(actual.canonical, [config.origin + (route === '/' ? '/' : route)]);
        assert.ok(actual.text.length > 100, 'substantive main content');
        if (!javaScriptEnabled) raw = actual;
        else if (config.requireRawParity) {
          for (const key of ['title', 'description', 'canonical', 'schemas', 'h1', 'text', 'links']) assert.deepEqual(actual[key], raw[key], `raw/hydrated ${key}`);
        }
      } catch (e) { failures.push({ route, width, javaScriptEnabled, message: e.message }); }
      finally { await context.close(); }
      checked++;
    }
  }
} finally { await browser.close(); await new Promise(r => server.close(r)); }
console.log(JSON.stringify({ checked, routeCount: config.routes.length, failures }, null, 2));
assert.equal(failures.length, 0, 'browser regression failures');
