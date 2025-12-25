-- Drop existing policies on subscribers table
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

-- Ensure RLS is enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (extra security)
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;

-- Create PERMISSIVE policies with proper access control

-- Only admins can view subscriber data
CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update subscribers
CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow anyone (including anonymous) to subscribe via INSERT only
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);