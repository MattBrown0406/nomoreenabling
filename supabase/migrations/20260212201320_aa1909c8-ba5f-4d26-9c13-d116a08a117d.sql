CREATE POLICY "Deny public select on subscribers"
ON public.subscribers
AS RESTRICTIVE FOR SELECT
TO anon
USING (false);