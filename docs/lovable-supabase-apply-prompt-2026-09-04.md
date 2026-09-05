Use this prompt in Lovable after the 2026-09-04 audit commit is visible on GitHub:

```text
Please apply and verify the No More Enabling backend changes from the 2026-09-04 security audit commit.

Context:
- Supabase is managed inside Lovable for this project.
- The commit fixes several Edge Function security holes (unauthenticated writes, PII leaks, spammable endpoints), a broken drip-email cadence, missing schedulers, and analytics that silently truncated at 1,000 rows.

Please do the following:

1. Apply the migration:
   - supabase/migrations/20260904230000_security_audit_fixes.sql

2. Confirm the migration took effect:
   - public.course_enrollments no longer has the "Anyone can enroll in courses" policy and anon cannot INSERT into it
   - public.lead_magnet_downloads has three RESTRICTIVE write-blocking policies (insert/update/delete) and an admin session can SELECT from it
   - public.article_views and public.ad_clicks only allow anon INSERT on the listed columns
   - two new pg_cron jobs exist: nme-send-boundaries-course (daily 15:00 UTC) and nme-process-consultation-followups (hourly at :15)

3. Verify the Vault secret the cron jobs depend on exists (no migration creates it):
   SELECT name FROM vault.decrypted_secrets WHERE name = 'SUPABASE_SERVICE_ROLE_KEY';
   If it is missing, create it with the project's service-role key. Then check
   SELECT status_code FROM net._http_response ORDER BY created DESC LIMIT 10;
   for any 401 responses from the existing crons (drain-spine-outbox, send-money-plan-email, send-weekly-digest, refresh-press-feed).

4. Delete these Edge Functions (removed from the repo; both were abusable with no caller):
   - mailchimp-subscribe
   - send-test-event-email

5. Redeploy these Edge Functions from the repo:
   - record-article-metadata (now only accepts a slug and reads title/description/image from https://nomoreenabling.com/blog-feed.json)
   - sync-mailchimp (now admin-only, verify_jwt = true)
   - drain-spine-outbox (now requires the service-role bearer; claims rows before sending)
   - process-consultation-followups (accepts the service-role bearer for cron; marks paused leads as skipped; detects Resend errors)
   - send-admin-email (detects Resend errors)
   - send-money-plan-email and send-course-email (fixed daily/weekly cadence; send-course-email accepts the service-role bearer)
   - newsletter-signup (finalizes already-confirmed Mailchimp members so lead magnets and assessments are recorded)
   - send-contact-form (server-side honeypot, dwell-time check, per-IP rate limit, server-side lead scoring)
   - course-enroll (already-enrolled now returns HTTP 200 with already_enrolled: true; attempt table pruning actually runs)
   - track-funnel-event (rejects metadata over 4 KB and malformed JSON)
   - nme-revenue-report and send-weekly-owner-summary (page through funnel_events instead of stopping at 1,000 rows)
   - send-newsletter (default sender is contact@nomoreenabling.com)
   - personalized-suggestions (input validation, no internal error text returned)
   - sharepreview (slug validation)

6. Apply the config.toml changes: verify_jwt = true for sync-mailchimp, drain-spine-outbox, send-money-plan-email, refresh-press-feed, send-admin-email.

7. Test from the deployed site:
   - Load any article; confirm a row for it exists in public.articles_metadata with the correct title/image.
   - Submit the consultation form on /family-addiction-consultation; confirm the lead is stored with a server-computed lead_score/lead_tier and two follow-up rows are queued.
   - Enroll a test address in the Boundaries course twice; the second attempt should show "already enrolled" rather than an error.
   - Enroll a test address in the Money Plan on /enabling-cost-calculator; confirm Day 2 arrives the next day at 15:00 UTC (not two days later).
   - Sign up an address that is ALREADY confirmed in Mailchimp via a lead magnet card; confirm a lead_magnet_downloads row is created.
   - Wait for the hourly cron; confirm a due consultation follow-up is sent and sent_at is set.
   - Delete the test rows after verification.
```
