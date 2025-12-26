-- Add explicit restrictive policy to deny SELECT for non-admin users on subscribers table
-- This ensures that even if other permissive policies exist, only admins can read subscriber data

CREATE POLICY "Deny public select on subscribers"
ON public.subscribers
AS RESTRICTIVE
FOR SELECT
TO anon, authenticated
USING (public.has_role(auth.uid(), 'admin'));