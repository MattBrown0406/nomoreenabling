import assert from 'node:assert/strict';
import fs from 'node:fs';
import { chromium } from '@playwright/test';

const origin = process.env.ORIGIN || 'http://127.0.0.1:4188';
const evidenceDir = process.env.EVIDENCE_DIR;
const targets = [
  '/articles/paying-rent-for-addicted-adult-child',
  '/articles/should-i-give-money-to-someone-with-addiction',
];
const heading = 'See this pattern in real decisions';
const results = [];
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
try {
  for (const width of [320, 390, 1280]) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    // Do not send analytics, ads, form submissions or backend traffic during QA.
    await context.route('**/*', route => {
      const request = route.request();
      return request.url().startsWith(origin) && request.method() === 'GET'
        ? route.continue() : route.abort();
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const path of ['/glossary/enabling', '/glossary/boundary', ...targets]) {
      const response = await page.goto(origin + path, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200);
      const raw = await response.text();
      const data = await page.evaluate(() => ({
        title: document.title,
        h1: [...document.querySelectorAll('h1')].map(el => el.textContent.trim()),
        width: innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        canonical: [...document.querySelectorAll('link[rel="canonical"]')].map(el => el.href),
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent)),
      }));
      const parity = await page.evaluate(rawHtml => {
        const parsed = new DOMParser().parseFromString(rawHtml, 'text/html');
        // Article prose excludes existing client-only share/ad chrome.
        const words = doc => {
          const content = (doc.querySelector('article .prose') || doc.querySelector('main')).cloneNode(true);
          content.querySelectorAll('.not-prose').forEach(el => el.remove());
          return content.textContent.replace(/\s+/g, ' ').trim();
        };
        const schema = doc => [...doc.querySelectorAll('script[type="application/ld+json"]')].map(el => JSON.parse(el.textContent));
        return { sameWords: words(parsed) === words(document), rawSchema: schema(parsed), hydratedSchema: schema(document) };
      }, raw);
      assert.ok(parity.sameWords, `${path} raw/hydrated words differ`);
      assert.deepEqual(parity.rawSchema, parity.hydratedSchema);
      assert.equal(data.h1.length, 1);
      assert.ok(data.scrollWidth <= width, `${path} overflow at ${width}`);
      assert.deepEqual(data.canonical, [`https://nomoreenabling.com${path}`]);
      if (path === '/glossary/enabling') {
        const section = page.getByRole('region', { name: heading });
        assert.equal(await section.count(), 1);
        assert.equal(await section.locator('li a[href]').count(), 2);
        assert.ok(raw.includes(heading));
        for (const target of targets) {
          assert.equal((raw.match(new RegExp(`href="${target}"`, 'g')) || []).length, 1);
          const link = section.locator(`a[href="${target}"]`);
          assert.ok((await link.innerText()).trim().length > 10);
          await link.focus();
          assert.equal(await link.evaluate(el => el === document.activeElement), true);
          assert.notEqual(await link.evaluate(el => getComputedStyle(el).outlineStyle), 'none');
        }
      } else if (path.startsWith('/glossary/')) {
        assert.ok(!raw.includes(heading));
        assert.equal(await page.getByRole('heading', { name: heading }).count(), 0);
      }
      results.push({ path, width, status: response.status(), ...data });
    }
    for (const target of targets) {
      await page.goto(origin + '/glossary/enabling', { waitUntil: 'networkidle' });
      await page.locator(`section[aria-labelledby="enabling-examples-heading"] a[href="${target}"]`).focus();
      await page.keyboard.press('Enter');
      await page.waitForURL(origin + target);
      await page.waitForLoadState('networkidle');
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(!(await page.locator('main').innerText()).includes('Article not found'));
    }
    assert.deepEqual(errors, []);
    await context.close();
  }
} finally {
  await browser.close();
  if (evidenceDir) fs.writeFileSync(`${evidenceDir}/browser-tests.json`, JSON.stringify(results, null, 2));
}
console.log(`Passed ${results.length} route/viewport cases, raw anchors, scoped block, keyboard navigation and focus checks.`);
