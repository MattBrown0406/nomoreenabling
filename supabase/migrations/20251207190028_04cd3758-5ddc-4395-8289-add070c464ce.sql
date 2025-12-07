-- Drop the overly permissive INSERT policy that allows anyone to insert
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.subscribers;

-- Create a restrictive INSERT policy that only allows admins to insert directly
-- (newsletter signups go through the edge function which uses service role key)
CREATE POLICY "Only admins can insert subscribers" 
ON public.subscribers 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));