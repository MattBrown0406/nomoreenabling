import assert from 'node:assert/strict';
import fs from 'node:fs';
import { build } from 'esbuild';

// Exercise the real TS generator without adding a runtime dependency.
const { outputFiles } = await build({
  entryPoints: ['scripts/generate-sitemap.ts'], bundle: true,
  platform: 'node', format: 'esm', write: false,
});
const { generateSitemapXml } = await import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`);
const special = `guilt-&-shame`;
const xml = generateSitemapXml({
  categories: [special], articles: [{ slug: 'ordinary', date: '2026-09-01' }],
  topicHubs: ['family&friends'], supportOffers: ['care&support'],
});
assert.ok(xml.includes('<loc>https://nomoreenabling.com/category/guilt-&amp;-shame</loc>'));
assert.ok(xml.includes('/topic-hubs/family&amp;friends</loc>'));
assert.ok(xml.includes('/support/care&amp;support</loc>'));
assert.ok(xml.includes('/articles/ordinary</loc>'));
assert.ok(!/&(?!(?:amp|lt|gt|quot|apos);)/.test(xml), 'XML contains an unescaped ampersand');
assert.ok(xml.includes('<lastmod>2026-09-01</lastmod>'));
const hostile = generateSitemapXml({articles: [{slug: `a<b>c"d'e&f`} ]});
assert.ok(hostile.includes('a&lt;b&gt;c&quot;d&apos;e&amp;f</loc>'));
if (fs.existsSync('dist/sitemap.xml')) {
  const built = fs.readFileSync('dist/sitemap.xml', 'utf8');
  assert.ok(!/&(?!(?:amp|lt|gt|quot|apos);)/.test(built), 'Built sitemap contains unescaped ampersand');
  assert.ok(built.includes('/category/guilt-&amp;-shame</loc>'));
}
console.log('PASS: XML escaping across generated route classes, special characters, date preservation, and built artifact when present');
