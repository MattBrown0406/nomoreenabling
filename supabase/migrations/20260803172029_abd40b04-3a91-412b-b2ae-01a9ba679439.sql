-- Ensure no client-facing role holds table privileges on these internal queues
REVOKE ALL ON public.consultation_followup_queue FROM anon, authenticated;
REVOKE ALL ON public.spine_outbox FROM anon, authenticated;

-- Admin read/update flows are driven through authenticated role policies
GRANT SELECT, UPDATE ON public.consultation_followup_queue TO authenticated;
GRANT SELECT ON public.spine_outbox TO authenticated;
GRANT ALL ON public.consultation_followup_queue TO service_role;
GRANT ALL ON public.spine_outbox TO service_role;

-- Explicitly deny all client-side writes (service_role bypasses RLS)
DROP POLICY IF EXISTS "No client inserts into consultation followups" ON public.consultation_followup_queue;
CREATE POLICY "No client inserts into consultation followups"
ON public.consultation_followup_queue
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes from consultation followups" ON public.consultation_followup_queue;
CREATE POLICY "No client deletes from consultation followups"
ON public.consultation_followup_queue
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "No client inserts into spine outbox" ON public.spine_outbox;
CREATE POLICY "No client inserts into spine outbox"
ON public.spine_outbox
AS RESTRICTIVE
FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "No client updates to spine outbox" ON public.spine_outbox;
CREATE POLICY "No client updates to spine outbox"
ON public.spine_outbox
AS RESTRICTIVE
FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "No client deletes from spine outbox" ON public.spine_outbox;
CREATE POLICY "No client deletes from spine outbox"
ON public.spine_outbox
AS RESTRICTIVE
FOR DELETE
TO anon, authenticated
USING (false);