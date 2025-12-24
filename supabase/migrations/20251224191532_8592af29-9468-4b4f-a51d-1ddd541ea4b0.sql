-- Drop existing RESTRICTIVE policies on subscribers
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

-- Create PERMISSIVE policies (default type, explicitly secure)
-- Only admins can SELECT subscriber data
CREATE POLICY "Admins can view subscribers" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can UPDATE subscriber data
CREATE POLICY "Admins can update subscribers" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can DELETE subscriber data
CREATE POLICY "Admins can delete subscribers" 
ON public.subscribers 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Anyone can INSERT (subscribe) - this is intentional for newsletter signup
CREATE POLICY "Anyone can subscribe" 
ON public.subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);