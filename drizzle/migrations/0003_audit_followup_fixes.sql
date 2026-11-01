-- 2026-11-01 bug-audit follow-ups. Every statement is idempotent, so this is
-- safe whether or not 20260904230000_security_audit_fixes.sql applied cleanly.

-- 1. Re-assert the 2026-09-05 CHECK constraints as NOT VALID. A plain
--    ADD CONSTRAINT scans existing rows, and article_views/articles_metadata
--    accepted arbitrary public inserts for months; one legacy row (e.g. an
--    uppercase slug) would abort that whole migration, including the cron
--    jobs below. NOT VALID enforces the rule for new rows without the scan.
DO $$
BEGIN
  IF to_regclass('public.article_views') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'article_views_slug_format') THEN
    ALTER TABLE public.article_views
      ADD CONSTRAINT article_views_slug_format CHECK (article_slug ~ '^[a-z0-9-]{1,160}$') NOT VALID;
  END IF;

  IF to_regclass('public.ad_clicks') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ad_clicks_length_limits') THEN
    ALTER TABLE public.ad_clicks
      ADD CONSTRAINT ad_clicks_length_limits
      CHECK (length(ad_name) <= 120 AND length(coalesce(page_path, '')) <= 500) NOT VALID;
  END IF;

  IF to_regclass('public.funnel_events') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'funnel_events_metadata_size') THEN
    ALTER TABLE public.funnel_events
      ADD CONSTRAINT funnel_events_metadata_size CHECK (pg_column_size(metadata) <= 8192) NOT VALID;
  END IF;

  IF to_regclass('public.articles_metadata') IS NOT NULL
     AND NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'articles_metadata_slug_format') THEN
    ALTER TABLE public.articles_metadata
      ADD CONSTRAINT articles_metadata_slug_format CHECK (slug ~ '^[a-z0-9-]{1,160}$') NOT VALID;
  END IF;

  -- Column-limited public inserts (re-asserted; harmless if already applied).
  IF to_regclass('public.article_views') IS NOT NULL THEN
    REVOKE INSERT ON public.article_views FROM anon, authenticated;
    GRANT INSERT (article_slug) ON public.article_views TO anon, authenticated;
  END IF;
  IF to_regclass('public.ad_clicks') IS NOT NULL THEN
    REVOKE INSERT ON public.ad_clicks FROM anon, authenticated;
    GRANT INSERT (ad_name, page_path, sponsor_campaign_id, placement_key) ON public.ad_clicks TO anon, authenticated;
  END IF;

  -- 2. sponsor_impressions was left fully anon-insertable (including
  --    viewed_at). The site records impressions in funnel_events and never
  --    writes this table, so close it to public clients entirely.
  IF to_regclass('public.sponsor_impressions') IS NOT NULL THEN
    DROP POLICY IF EXISTS "Anyone can track sponsor impressions" ON public.sponsor_impressions;
    REVOKE INSERT ON public.sponsor_impressions FROM anon, authenticated;
  END IF;
END $$;

-- 4. finalize_confirmed_newsletter_optin fixes:
--    a) The spine idempotency key was 'mailchimp:<member>:subscribe', which
--       is identical for every later signup by the same subscriber, so their
--       second lead magnet / assessment lead_captured event was silently
--       dropped. Key on the opt-in attempt instead (its created_at is reset
--       on every new signup).
--    c) Family-assessment signups are enrolled in the Boundaries course
--       here, after double opt-in, instead of from the browser.
--    b) An existing subscriber can be "finalized" without clicking a
--       confirmation link (they are already confirmed in Mailchimp), so a
--       third party submitting their address could rename them. Keep an
--       existing subscriber's first_name.
CREATE OR REPLACE FUNCTION public.finalize_confirmed_newsletter_optin(
  p_email text,
  p_first_name text,
  p_mailchimp_member_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt public.newsletter_optin_attempts%ROWTYPE;
  v_context jsonb;
  v_source text;
  v_now timestamptz := now();
  v_idempotency_key text;
BEGIN
  SELECT *
  INTO v_attempt
  FROM public.newsletter_optin_attempts
  WHERE email = lower(trim(p_email))
    AND confirmed_at IS NULL
    AND expires_at > v_now
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('finalized', false, 'reason', 'no_pending_attempt');
  END IF;

  v_context := COALESCE(v_attempt.context, '{}'::jsonb);
  v_source := NULLIF(v_context->>'source', '');
  v_idempotency_key := 'optin:' || v_attempt.id::text || ':'
    || floor(extract(epoch FROM v_attempt.created_at) * 1000)::bigint::text;

  INSERT INTO public.subscribers (email, first_name, is_active, subscribed_at)
  VALUES (
    lower(trim(p_email)),
    COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
    true,
    v_now
  )
  ON CONFLICT (email) DO UPDATE
  SET first_name = COALESCE(public.subscribers.first_name, EXCLUDED.first_name),
      is_active = true;

  IF v_source = 'family_situation_assessment'
     AND NULLIF(v_context->>'assessment_result', '') IS NOT NULL THEN
    INSERT INTO public.assessment_leads (
      email,
      first_name,
      source,
      assessment_result,
      recommended_offer,
      answers,
      subscribed_at,
      last_result_at,
      updated_at
    )
    VALUES (
      lower(trim(p_email)),
      COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
      v_source,
      v_context->>'assessment_result',
      NULLIF(v_context->>'recommended_offer', ''),
      CASE
        WHEN jsonb_typeof(v_context->'answers') = 'object' THEN v_context->'answers'
        ELSE '{}'::jsonb
      END,
      v_now,
      v_now,
      v_now
    )
    ON CONFLICT (email) DO UPDATE
    SET first_name = COALESCE(public.assessment_leads.first_name, EXCLUDED.first_name),
        assessment_result = EXCLUDED.assessment_result,
        recommended_offer = EXCLUDED.recommended_offer,
        answers = EXCLUDED.answers,
        last_result_at = EXCLUDED.last_result_at,
        updated_at = EXCLUDED.updated_at;
  END IF;

  -- The family assessment promises "a preset opt-in to the free Boundaries
  -- email course", and homepage newsletter variant B ("Send me lesson 1")
  -- enrolls in it too. Start/restart it now that the address is confirmed:
  -- first lesson at tomorrow's 15:00 UTC drip run (due from 14:00). An
  -- enrollment the reader stopped (inactive, not completed) restarts; an
  -- active one (variant B enrolls immediately as well) is left alone.
  IF v_source IN ('family_situation_assessment', 'newsletter_hero_B') THEN
    INSERT INTO public.course_enrollments (email, first_name, course_name, current_lesson, next_email_at)
    VALUES (
      lower(trim(p_email)),
      COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
      'boundaries',
      0,
      (date_trunc('day', v_now AT TIME ZONE 'UTC') + interval '38 hours') AT TIME ZONE 'UTC'
    )
    ON CONFLICT (email, course_name) DO UPDATE
    SET is_active = true,
        current_lesson = 0,
        last_email_sent_at = NULL,
        next_email_at = EXCLUDED.next_email_at
    WHERE public.course_enrollments.is_active = false
      AND public.course_enrollments.completed_at IS NULL;
  END IF;

  IF v_source = 'lead_magnet'
     AND NULLIF(v_context->>'lead_magnet', '') IS NOT NULL THEN
    INSERT INTO public.lead_magnet_downloads (
      email,
      first_name,
      lead_magnet_slug,
      lead_magnet_source,
      article_slug,
      hub_slug,
      page_path,
      metadata,
      downloaded_at,
      updated_at
    )
    VALUES (
      lower(trim(p_email)),
      COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
      v_context->>'lead_magnet',
      NULLIF(v_context->>'lead_magnet_source', ''),
      NULLIF(v_context->>'article_slug', ''),
      NULLIF(v_context->>'hub_slug', ''),
      NULLIF(v_context->>'page_path', ''),
      jsonb_build_object(
        'source', v_source,
        'lead_magnet_source', NULLIF(v_context->>'lead_magnet_source', ''),
        'mailchimp_tag', NULLIF(v_context->>'lead_magnet_tag', '')
      ),
      v_now,
      v_now
    )
    ON CONFLICT (email, lead_magnet_slug) DO UPDATE
    SET first_name = COALESCE(public.lead_magnet_downloads.first_name, EXCLUDED.first_name),
        lead_magnet_source = EXCLUDED.lead_magnet_source,
        article_slug = EXCLUDED.article_slug,
        hub_slug = EXCLUDED.hub_slug,
        page_path = EXCLUDED.page_path,
        metadata = EXCLUDED.metadata,
        downloaded_at = EXCLUDED.downloaded_at,
        updated_at = EXCLUDED.updated_at;
  END IF;

  INSERT INTO public.spine_outbox (event_name, payload, idempotency_key)
  VALUES (
    'lead_captured',
    jsonb_build_object(
      'property', 'nomoreenabling',
      'email', lower(trim(p_email)),
      'name', COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
      'props', jsonb_build_object(
        'source', 'mailchimp_confirmed_opt_in',
        'signup_source', v_source,
        'confirmed_at', v_now
      )
    ),
    v_idempotency_key
  )
  ON CONFLICT (idempotency_key) WHERE idempotency_key IS NOT NULL DO NOTHING;

  UPDATE public.newsletter_optin_attempts
  SET confirmed_at = v_now,
      mailchimp_member_id = p_mailchimp_member_id
  WHERE id = v_attempt.id;

  RETURN jsonb_build_object('finalized', true);
END;
$$;

REVOKE ALL ON FUNCTION public.finalize_confirmed_newsletter_optin(text, text, text) FROM PUBLIC, anon, authenticated;

-- 5. get_article_view_counts is callable by anon and aggregates the whole
--    article_views table; cap the result size (the site asks for 6).
CREATE OR REPLACE FUNCTION public.get_article_view_counts(limit_count integer DEFAULT 3)
RETURNS TABLE(article_slug text, view_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT av.article_slug::text, count(*)::bigint AS view_count
  FROM public.article_views av
  GROUP BY av.article_slug
  ORDER BY count(*) DESC, max(av.viewed_at) DESC
  LIMIT least(greatest(limit_count, 1), 20);
$$;