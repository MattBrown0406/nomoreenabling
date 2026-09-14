// Run against a freshly built local preview. External requests never leave the browser.
// BASELINE_OUT captures pre-fix contracts; BASELINE compares them after the repair.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const base = process.env.BASE_URL || 'http://127.0.0.1:4387';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local preview required');
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const slugs = ['paying-rent-for-addicted-adult-child', 'should-i-give-money-to-someone-with-addiction', 'enabling-siblings-addiction'];
const widths = [320, 360, 390, 430, 768, 1280];
const rows = [];
try {
for (const slug of slugs) for (const width of widths) {
 const context = await browser.newContext({ viewport: { width, height: 900 }, serviceWorkers: 'block' });
 await context.route('**/*', route => new URL(route.request().url()).origin === new URL(base).origin && route.request().method() === 'GET' ? route.continue() : route.abort());
 const page = await context.newPage();
 await page.goto(`${base}/articles/${slug}`);
 await page.locator('article .prose h2').first().waitFor();
 await page.waitForTimeout(350);
 // Exercise lazy images and sticky CTAs without clicking conversion controls.
 await page.evaluate(async () => {
  for (let y=0; y<document.body.scrollHeight; y+=700) {
   window.scrollTo(0,y);
   await new Promise(resolve=>requestAnimationFrame(resolve));
  }
  window.scrollTo(0,0);
 });
 const result = await page.evaluate(() => {
  const article = document.querySelector('article');
  const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[aria-hidden="true"]');
  const bounds = e => { const r=e.getBoundingClientRect(); return {tag:e.tagName, cls:e.className, text:e.textContent.slice(0,100), x:r.x, right:r.right, width:r.width, scroll:e.scrollWidth, client:e.clientWidth}; };
  const vw=document.documentElement.clientWidth;
  return { client:vw, scroll:document.documentElement.scrollWidth, articleWidth:article.getBoundingClientRect().width, wrapper:bounds(article.parentElement), overflow:[...document.querySelectorAll('body *')].filter(visible).filter(e=>{const r=e.getBoundingClientRect();return r.left < -1 || r.right > vw+1;}).map(bounds), controls:[...document.querySelectorAll('a,button,input,select,textarea')].filter(visible).filter(e=> e.scrollWidth > e.clientWidth+1 && getComputedStyle(e).display !== 'inline').map(bounds), contract:{title:document.title, description:document.querySelector('meta[name=description]')?.content, canonical:[...document.querySelectorAll('link[rel=canonical]')].map(e=>e.href), robots:[...document.querySelectorAll('meta[name=robots]')].map(e=>e.content), h1:[...document.querySelectorAll('h1')].map(e=>e.textContent), prose:window.__ARTICLE_CONTENT__?.content, schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>e.textContent), links:[...article.querySelectorAll('a')].map(e=>e.getAttribute('href')), adSlots:[...document.querySelectorAll('ins.adsbygoogle')].map(e=>e.getAttribute('data-ad-slot'))} };
 });
 // Slot IDs are currently empty in production config. Exercise a local-only
 // responsive creative without changing publisher configuration or serving ads.
 result.mockAd = await page.evaluate(() => {
  const slot = document.createElement('div');
  slot.className = 'adsense-slot';
  slot.style.minHeight = '250px';
  const creative = document.createElement('iframe');
  creative.title = 'Local responsive ad fixture';
  creative.srcdoc = '<p>Local responsive creative</p>';
  creative.style.cssText = 'display:block;width:100%;height:250px;border:0';
  slot.append(creative);
  document.querySelector('article .prose').append(slot);
  const rect = creative.getBoundingClientRect();
  const result = { width: rect.width, right: rect.right, viewport: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth };
  slot.remove();
  return result;
 });
 result.contract.proseHash=createHash('sha256').update(result.contract.prose || '').digest('hex'); delete result.contract.prose;
 rows.push({slug,width,...result});
 await context.close();
}
} finally { await browser.close(); }
const baseline=process.env.BASELINE ? JSON.parse(fs.readFileSync(process.env.BASELINE,'utf8')) : null;
for (const row of rows) {
 row.failures=[];
 if(row.mockAd.right>row.client+1 || row.mockAd.scroll>row.client || row.mockAd.width<=0) row.failures.push('responsive mock ad');
 if(row.scroll>row.client || row.overflow.length || row.controls.length) row.failures.push('horizontal overflow / clipped control');
 if(row.articleWidth>768 || row.articleWidth>row.client-32) row.failures.push('article width');
 if(row.contract.h1.length!==1 || row.contract.canonical.join()!==`https://nomoreenabling.com/articles/${row.slug}` || row.contract.robots.join()!=='index, follow') row.failures.push('SEO contract');
 if(baseline && JSON.stringify(row.contract)!==JSON.stringify(baseline.find(b=>b.slug===row.slug && b.width===row.width).contract)) row.failures.push('changed content/SEO/links/ads');
}
fs.writeFileSync(process.env.BASELINE_OUT || process.env.OUT || '/tmp/article-mobile.json',JSON.stringify(rows,null,2));
console.log(JSON.stringify(rows.map(({slug,width,client,scroll,articleWidth,failures})=>({slug,width,client,scroll,articleWidth,failures})),null,2));
if(!process.env.BASELINE_OUT && rows.some(r=>r.failures.length)) process.exitCode=1;
