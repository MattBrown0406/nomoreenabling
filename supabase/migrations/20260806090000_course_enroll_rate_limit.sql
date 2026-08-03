-- Anti-abuse for the public course-enroll endpoint.
-- course_enroll_attempts records one row per enrollment attempt per IP; the
-- function rejects an IP that exceeds 5 attempts in 10 minutes and prunes
-- rows older than an hour opportunistically. Service-role only — no client
-- ever reads or writes this table directly.

CREATE TABLE IF NOT EXISTS public.course_enroll_attempts (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip         text        NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS course_enroll_attempts_ip_time_idx
  ON public.course_enroll_attempts (ip, created_at DESC);

ALTER TABLE public.course_enroll_attempts ENABLE ROW LEVEL SECURITY;
-- No policies: only the service role (which bypasses RLS) touches this table.

GRANT ALL ON public.course_enroll_attempts TO service_role;
