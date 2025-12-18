-- Remove any public INSERT policies on subscribers table
-- First check for policies that allow public inserts and drop them
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
DROP POLICY IF EXISTS "Public can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Allow public insert" ON public.subscribers;

-- Ensure only admins can insert (via dashboard) - edge function uses service role which bypasses RLS
CREATE POLICY "Service role and admins can insert subscribers" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));