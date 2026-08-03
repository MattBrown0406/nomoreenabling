CREATE TABLE IF NOT EXISTS public.press_feed (
  id         int         PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  episodes   jsonb       NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.press_feed (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.press_feed ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "press_feed: public read" ON public.press_feed;
CREATE POLICY "press_feed: public read" ON public.press_feed FOR SELECT USING (true);

GRANT SELECT ON public.press_feed TO anon, authenticated;
GRANT ALL ON public.press_feed TO service_role;

SELECT cron.schedule(
  'nme-refresh-press-feed',
  '0 14 * * 1',
  $$
  SELECT net.http_post(
    url     := 'https://ctqbadyfhcoxhywrkorf.supabase.co/functions/v1/refresh-press-feed',
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