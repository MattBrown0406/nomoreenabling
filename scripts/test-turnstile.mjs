import assert from 'node:assert/strict';
import { acceptsTurnstileResult } from '../supabase/functions/newsletter-signup/turnstile.ts';

const valid = { success: true, action: 'newsletter_signup', hostname: 'nomoreenabling.com' };
assert.equal(acceptsTurnstileResult(valid), true);
assert.equal(acceptsTurnstileResult({ ...valid, hostname: 'www.nomoreenabling.com' }), true);
assert.equal(acceptsTurnstileResult({ ...valid, success: false }), false);
assert.equal(acceptsTurnstileResult({ ...valid, success: 'true' }), false);
assert.equal(acceptsTurnstileResult({ ...valid, action: 'contact' }), false);
assert.equal(acceptsTurnstileResult({ ...valid, hostname: 'attacker.example' }), false);
assert.equal(acceptsTurnstileResult(valid, ''), false);
for (const hostname of ['localhost', '127.0.0.1']) {
  assert.equal(acceptsTurnstileResult({ ...valid, hostname }, `nomoreenabling.com,${hostname}`), false);
}
console.log('PASS: Turnstile requires true success, newsletter action, and an approved non-local hostname.');