import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import test from 'node:test';
const read = path => process.env.CONTACT_BASELINE_REF
  ? execFileSync('git', ['show', `${process.env.CONTACT_BASELINE_REF}:${path}`], { encoding: 'utf8' })
  : readFileSync(path, 'utf8');
test('coaching has early call and request choices without changing intake', () => {
  const source = read('src/pages/CommercialIntentPage.tsx');
  const nav = source.slice(source.indexOf('<nav aria-label="Coaching contact options"'), source.indexOf('</nav>'));
  assert.match(nav, /PhoneCallButton source="coaching_mobile"/);
  assert.match(nav, /href="#consultation-form"/);
  assert.match(nav, /min-h-11/);
  assert.ok(source.indexOf('<nav aria-label="Coaching contact options"') < source.indexOf('{directAnswer &&'));
  assert.match(source, /id="consultation-form" className="[^"]*scroll-mt-24/);
  assert.match(source, /source={`commercial-intent:\$\{page.slug\}`}/);
});
test('header does not force wide desktop navigation at tablet widths', () => {
  const source = read('src/components/layout/Header.tsx');
  assert.match(source, /hidden 2xl:flex/);
  assert.doesNotMatch(source, /(?:\s|\")lg:flex/);
});
