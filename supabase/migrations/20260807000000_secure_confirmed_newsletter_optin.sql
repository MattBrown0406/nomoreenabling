-- Trusted newsletter records are created only after Mailchimp confirms double opt-in.

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
REVOKE INSERT ON TABLE public.subscribers FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.newsletter_optin_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  mailchimp_member_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  confirmed_at timestamptz
);

CREATE INDEX IF NOT EXISTS newsletter_optin_attempts_expiry_idx
  ON public.newsletter_optin_attempts (expires_at)
  WHERE confirmed_at IS NULL;

ALTER TABLE public.newsletter_optin_attempts ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.newsletter_optin_attempts FROM anon, authenticated;
GRANT ALL ON TABLE public.newsletter_optin_attempts TO service_role;

ALTER TABLE public.spine_outbox
  ADD COLUMN IF NOT EXISTS idempotency_key text;

CREATE UNIQUE INDEX IF NOT EXISTS spine_outbox_idempotency_key_idx
  ON public.spine_outbox (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

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
  v_idempotency_key := 'mailchimp:' || p_mailchimp_member_id || ':subscribe';

  INSERT INTO public.subscribers (email, first_name, is_active, subscribed_at)
  VALUES (
    lower(trim(p_email)),
    COALESCE(NULLIF(trim(p_first_name), ''), v_attempt.first_name),
    true,
    v_now
  )
  ON CONFLICT (email) DO UPDATE
  SET first_name = COALESCE(EXCLUDED.first_name, public.subscribers.first_name),
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
    SET first_name = COALESCE(EXCLUDED.first_name, public.assessment_leads.first_name),
        assessment_result = EXCLUDED.assessment_result,
        recommended_offer = EXCLUDED.recommended_offer,
        answers = EXCLUDED.answers,
        last_result_at = EXCLUDED.last_result_at,
        updated_at = EXCLUDED.updated_at;
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
    SET first_name = COALESCE(EXCLUDED.first_name, public.lead_magnet_downloads.first_name),
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
GRANT EXECUTE ON FUNCTION public.finalize_confirmed_newsletter_optin(text, text, text) TO service_role;
