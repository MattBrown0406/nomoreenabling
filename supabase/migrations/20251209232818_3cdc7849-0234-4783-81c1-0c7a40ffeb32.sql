-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Only admins can delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can view subscribers" ON public.subscribers;

-- Ensure RLS is enabled
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner too
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;

-- Recreate as PERMISSIVE policies (default) that only allow admin access
CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert subscribers"
ON public.subscribers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));