import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = process.env.NME_TEST_URL || 'http://127.0.0.1:4175';
const browser = await chromium.launch({ headless: true });
const paths = [
  ['Understanding my options', ['Support for me', 'Treatment and professional guidance'], ['Make room for support for you', 'Explore professional support without committing today']],
  ['Preparing a family conversation', ['Finding the words', 'Setting a boundary'], ['Prepare a calmer opening', 'Prepare one boundary you can hold']],
  ['An immediate concern', ['See immediate safety steps', 'Plan after urgent help is in place'], ['Put immediate safety before planning', 'Make a plan after urgent help is in place']],
];
let cases = 0;
try {
  for (const width of [1280, 320]) {
    for (const [path, choices, titles] of paths) {
      for (const [i, choice] of choices.entries()) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true });
        const page = await context.newPage();
        const requests = [], external = [], errors = [];
        page.on('request', r => { requests.push(r.url()); if (new URL(r.url()).origin !== base) external.push(r.url()); });
        page.on('pageerror', e => errors.push(e.message));
        await page.goto(`${base}/next-step`, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://nomoreenabling.com/next-step');
        assert.equal(await page.locator('input,textarea,iframe').count(), 0);
        assert.equal(await page.locator('script[src*="google"],script[src*="clarity"],script[src*="hotjar"]').count(), 0);
        assert.equal(await page.getByRole('button', { name: 'Open contact form' }).count(), 0);
        assert.equal(await page.locator('a[href="tel:911"]').count(), 1);
        assert.equal(await page.locator('a[href="tel:988"]').count(), 1);
        const before = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage, location.href]));
        const initialRequests = requests.length;
        const button = page.getByRole('button', { name: path, exact: false });
        await button.focus();
        await page.keyboard.press('Enter');
        assert.equal(await page.locator('#guide-heading').evaluate(e => e === document.activeElement), true);
        await page.getByRole('button', { name: choice, exact: false }).click();
        assert.equal(await page.locator('#guide-heading').innerText(), titles[i]);
        assert.equal(await page.locator('article ol li').count(), 4);
        assert.equal(await page.locator('input,textarea').count(), 0);
        assert.ok((await page.locator('article').innerText()).length > 1400);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
        assert.equal(overflow, false, `horizontal overflow at ${width}`);
        const downloadPromise = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download text guide' }).click();
        const download = await downloadPromise;
        assert.equal(download.suggestedFilename(), 'my-next-step-guide.txt');
        const downloadedText = await fs.readFile(await download.path(), 'utf8');
        assert.ok(downloadedText.includes(titles[i]) && downloadedText.includes('911') && downloadedText.includes('988'));
        assert.equal(await page.getByRole('link', { name: 'Open Freedom Interventions contact form (optional)' }).getAttribute('href'), 'https://freedominterventions.com/contact');
        assert.equal(await page.locator('a[href="https://freedominterventions.com/contact"]').getAttribute('rel'), 'noreferrer');
        await page.evaluate(() => { window.print = () => { window.__printed = true; }; });
        await page.getByRole('button', { name: 'Print guide' }).click();
        assert.equal(await page.evaluate(() => window.__printed), true);
        await page.getByRole('button', { name: 'Back', exact: true }).click();
        assert.equal(await page.getByRole('button', { name: choice, exact: false }).count(), 1);
        await page.getByRole('button', { name: choice, exact: false }).click();
        await page.getByRole('button', { name: 'Reset guide' }).click();
        assert.equal(await page.locator('#guide-heading').innerText(), 'What would help right now?');
        assert.equal(await page.locator('#guide-heading').evaluate(e => e === document.activeElement), true);
        assert.equal(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage, location.href])), before);
        assert.equal(requests.length, initialRequests, 'choices/download/back/reset must not make network requests');
        assert.deepEqual(external, [], 'private entry must not load third parties');
        assert.deepEqual(errors, []);
        for (const event of ['pagehide', 'pageshow']) {
          await page.getByRole('button', { name: path, exact: false }).click();
          await page.getByRole('button', { name: choice, exact: false }).click();
          assert.equal(await page.locator('#guide-heading').innerText(), titles[i]);
          await page.evaluate(type => window.dispatchEvent(new PageTransitionEvent(type, { persisted: true })), event);
          await page.waitForFunction(() => document.querySelector('#guide-heading')?.textContent === 'What would help right now?');
          assert.equal(await page.locator('article').count(), 0);
          assert.equal(await page.getByText('Download requested.', { exact: false }).count(), 0);
          await page.getByRole('button', { name: path, exact: false }).click();
          assert.equal(await page.locator('article').count(), 0, 'restored path must not reuse the old choice');
          await page.getByRole('button', { name: 'Reset guide' }).click();
        }
        await page.getByRole('button', { name: path, exact: false }).click();
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await page.locator('#guide-heading').innerText(), 'What would help right now?');
        await context.close();
        console.log(`PASS ${width}px: ${path} / ${choice}; keyboard, focus, guide, download, print, back, reset, reload, no answer network/storage`);
        cases++;
      }
    }
  }
  const context = await browser.newContext();
  // Keep the public homepage test deterministic; do not send production telemetry.
  await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
  const page = await context.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.evaluate(() => { window.__oldDocument = true; });
  await page.getByRole('link', { name: 'Not ready to call? Make a plan for your next step' }).click();
  await page.waitForURL('**/next-step');
  await page.waitForLoadState('networkidle');
  assert.equal(await page.evaluate(() => window.__oldDocument), undefined);
  assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined');
  assert.equal(await page.locator('#guide-heading').innerText(), 'What would help right now?');
  await page.goto(`${base}/next-step/`, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => typeof window.gtag), 'undefined');
  assert.equal(await page.locator('#guide-heading').innerText(), 'What would help right now?');
  await context.close();
  console.log(`PASS homepage full-document privacy boundary and trailing slash; ${cases} guide cases passed`);
} finally {
  await browser.close();
}
