-- Remove duplicate INSERT policy (keeping the more clearly named one)
DROP POLICY IF EXISTS "Admins can insert subscribers" ON public.subscribers;

-- The remaining policies are correct:
-- "Admins can view subscribers" - SELECT only for admins
-- "Service role and admins can insert subscribers" - INSERT only for admins (edge function uses service role)
-- "Admins can update subscribers" - UPDATE only for admins
-- "Admins can delete subscribers" - DELETE only for admins