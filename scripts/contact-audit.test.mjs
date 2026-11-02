import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { ESLint } from 'eslint';
import ts from 'typescript';
const read = path => process.env.CONTACT_BASELINE_REF ? execFileSync('git', ['show', `${process.env.CONTACT_BASELINE_REF}:${path}`], { encoding: 'utf8' }) : readFileSync(path, 'utf8');
test('expanded navigation is viewport-bounded and exposes its state', () => {
  const source=read('src/components/layout/Header.tsx');
  assert.match(source, /aria-expanded=\{isMenuOpen\}/);
  assert.match(source, /aria-controls="mobile-navigation"/);
  assert.match(source, /id="mobile-navigation"/);
  assert.match(source, /max-h-\[calc\(100dvh-4rem-1px\)\]/);
  assert.match(source, /overflow-y-auto/);
  assert.match(source, /Escape/);
});
test('shared contact CTA wraps; homepage grid can shrink below intrinsic widths', () => {
  assert.match(read('src/components/CoachingInterventionCTA.tsx'), /sm:flex-row flex-wrap/);
  assert.match(read('src/pages/Index.tsx'), /min-w-0 lg:col-span-2/);
  assert.equal((read('src/components/suggestions/PersonalizedSuggestions.tsx').match(/flex flex-wrap gap-2/g) || []).length, 2);
});
test('phone and WhatsApp buttons retain 44px minimum targets for small sizes', () => {
  assert.match(read('src/pages/ArticlePage.css'), /min-height: 44px/);
  for (const path of ['src/components/PhoneCallButton.tsx','src/components/WhatsAppButton.tsx']) assert.match(read(path), /min-h-\[44px\] min-w-\[44px\]/);
});
for(const path of ['src/components/ui/command.tsx','src/components/ui/textarea.tsx','supabase/functions/send-newsletter/index.ts','tailwind.config.ts']) {
  test(`existing lint error resolved: ${path}`,async () => {
    const source=read(path);
    const results=await new ESLint().lintText(source,{filePath:path});
    assert.equal(results[0].errorCount,0,JSON.stringify(results[0].messages));
    if(path.includes('send-newsletter')) {
      const old=execFileSync('git',['show',`9a931c725c95328ed49b8de3f53ab5a4450f413b:${path}`],{encoding:'utf8'});
      const emit=s=>ts.transpileModule(s,{compilerOptions:{target:ts.ScriptTarget.ESNext}}).outputText;
      assert.equal(emit(source),emit(old),'type-only catch edit must preserve executable JavaScript');
    }
  });
}
