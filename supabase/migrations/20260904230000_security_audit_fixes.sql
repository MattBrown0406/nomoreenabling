-- 2026-09-05 security / correctness audit fixes.
-- Apply through Lovable (Supabase is Lovable-managed for this project).

-- 1. course_enrollments: anon could INSERT any email directly (bypassing the
--    course-enroll function's rate limit and validation) and the daily drip
--    crons would then email that address. Only the service role enrolls.
DROP POLICY IF EXISTS "Anyone can enroll in courses" ON public.course_enrollments;
REVOKE INSERT ON public.course_enrollments FROM anon, authenticated;

-- 2. lead_magnet_downloads: the RESTRICTIVE "FOR ALL USING (false)" policy is
--    AND-ed with every command, including SELECT, so the admin SELECT policy
--    next to it could never match. Restrict writes only.
DROP POLICY IF EXISTS "No client writes to lead magnet downloads" ON public.lead_magnet_downloads;
DROP POLICY IF EXISTS "No client inserts to lead magnet downloads" ON public.lead_magnet_downloads;
DROP POLICY IF EXISTS "No client updates to lead magnet downloads" ON public.lead_magnet_downloads;
DROP POLICY IF EXISTS "No client deletes to lead magnet downloads" ON public.lead_magnet_downloads;
CREATE POLICY "No client inserts to lead magnet downloads"
  ON public.lead_magnet_downloads AS RESTRICTIVE FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No client updates to lead magnet downloads"
  ON public.lead_magnet_downloads AS RESTRICTIVE FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "No client deletes to lead magnet downloads"
  ON public.lead_magnet_downloads AS RESTRICTIVE FOR DELETE TO anon, authenticated USING (false);

-- 3. Public analytics inserts: anon could set id / viewed_at / clicked_at to
--    arbitrary values and skew the admin dashboard's time-ranged counts.
--    Limit anon/authenticated to the columns the site actually sends.
REVOKE INSERT ON public.article_views FROM anon, authenticated;
GRANT INSERT (article_slug) ON public.article_views TO anon, authenticated;
ALTER TABLE public.article_views DROP CONSTRAINT IF EXISTS article_views_slug_format;
ALTER TABLE public.article_views
  ADD CONSTRAINT article_views_slug_format CHECK (article_slug ~ '^[a-z0-9-]{1,160}$');

REVOKE INSERT ON public.ad_clicks FROM anon, authenticated;
GRANT INSERT (ad_name, page_path, sponsor_campaign_id, placement_key) ON public.ad_clicks TO anon, authenticated;
ALTER TABLE public.ad_clicks DROP CONSTRAINT IF EXISTS ad_clicks_length_limits;
ALTER TABLE public.ad_clicks
  ADD CONSTRAINT ad_clicks_length_limits
  CHECK (length(ad_name) <= 120 AND length(coalesce(page_path, '')) <= 500);

-- 4. funnel_events.metadata: hard cap so a public caller cannot store
--    multi-megabyte payloads (track-funnel-event also rejects > 4 KB).
ALTER TABLE public.funnel_events DROP CONSTRAINT IF EXISTS funnel_events_metadata_size;
ALTER TABLE public.funnel_events
  ADD CONSTRAINT funnel_events_metadata_size CHECK (pg_column_size(metadata) <= 8192);

-- 5. articles_metadata: DB-side backstop for the slug format the share
--    preview function expects.
ALTER TABLE public.articles_metadata DROP CONSTRAINT IF EXISTS articles_metadata_slug_format;
ALTER TABLE public.articles_metadata
  ADD CONSTRAINT articles_metadata_slug_format CHECK (slug ~ '^[a-z0-9-]{1,160}$');

-- 6. Boundaries course drip had no scheduler at all: enrollees got the
--    welcome email and then nothing. send-course-email now accepts the
--    service-role bearer, so schedule it like the Money Plan drip.
SELECT cron.schedule(
  'nme-send-boundaries-course',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://ctqbadyfhcoxhywrkorf.supabase.co/functions/v1/send-course-email',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1
      )
    ),
    body    := jsonb_build_object('source', 'pg_cron')
  );
  $$
);

-- 7. Consultation follow-ups (day 1 / day 3) only went out when an admin
--    pressed the button in the dashboard. Run hourly.
SELECT cron.schedule(
  'nme-process-consultation-followups',
  '15 * * * *',
  $$
  SELECT net.http_post(
    url     := 'https://ctqbadyfhcoxhywrkorf.supabase.co/functions/v1/process-consultation-followups',
    headers := jsonb_build_object(
      'Content-Type',  'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'SUPABASE_SERVICE_ROLE_KEY' LIMIT 1
      )
    ),
    body    := jsonb_build_object('source', 'pg_cron')
  );
  $$
);
