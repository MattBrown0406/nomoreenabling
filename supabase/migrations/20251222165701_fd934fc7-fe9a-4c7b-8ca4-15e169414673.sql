-- Drop the existing restrictive INSERT policy
DROP POLICY IF EXISTS "Service role and admins can insert subscribers" ON public.subscribers;

-- Create a new policy that allows anyone to subscribe (for newsletter signup)
CREATE POLICY "Anyone can subscribe" 
ON public.subscribers 
FOR INSERT 
WITH CHECK (true);