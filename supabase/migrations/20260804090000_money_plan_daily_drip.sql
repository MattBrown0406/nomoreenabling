-- The Money Plan — daily drip cron.
-- Day 1 ships instantly via course-enroll's welcome email; this schedule sends
-- Days 2-5 by invoking send-money-plan-email every day at 15:00 UTC (matches
-- the weekly digest hour). Mirrors the drain-spine-outbox cron pattern.
SELECT cron.schedule(
  'nme-send-money-plan',
  '0 15 * * *',
  $$
  SELECT net.http_post(
    url     := 'https://ctqbadyfhcoxhywrkorf.supabase.co/functions/v1/send-money-plan-email',
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
