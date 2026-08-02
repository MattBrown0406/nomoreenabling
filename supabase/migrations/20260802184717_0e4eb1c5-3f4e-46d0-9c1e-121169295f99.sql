SELECT cron.schedule(
  'nme-send-weekly-digest',
  '0 15 * * 1',
  $$
  SELECT net.http_post(
    url     := 'https://ctqbadyfhcoxhywrkorf.supabase.co/functions/v1/send-weekly-digest',
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