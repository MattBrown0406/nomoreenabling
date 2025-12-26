-- Drop existing policies on subscribers table
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

-- Recreate policies as PERMISSIVE (the default, which grants access when conditions are met)
-- Only admins can view subscriber data
CREATE POLICY "Admins can view subscribers" 
ON public.subscribers 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update subscriber data
CREATE POLICY "Admins can update subscribers" 
ON public.subscribers 
FOR UPDATE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete subscriber data
CREATE POLICY "Admins can delete subscribers" 
ON public.subscribers 
FOR DELETE 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Anyone can subscribe (INSERT only) - but they cannot read back data
CREATE POLICY "Anyone can subscribe" 
ON public.subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);