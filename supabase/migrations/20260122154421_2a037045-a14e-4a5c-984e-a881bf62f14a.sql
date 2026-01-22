-- Drop existing RESTRICTIVE policies and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.subscribers;

-- Create PERMISSIVE policies (default behavior, grants access when condition is met)
-- Public can insert (subscribe to newsletter)
CREATE POLICY "Anyone can subscribe"
ON public.subscribers
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view subscribers (protects email harvesting)
CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update subscribers
CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete subscribers
CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));