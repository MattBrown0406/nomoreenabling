-- Drop existing policies that only cover authenticated users
DROP POLICY IF EXISTS "Only admins can view subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can insert subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can update subscribers" ON public.subscribers;
DROP POLICY IF EXISTS "Only admins can delete subscribers" ON public.subscribers;

-- Create new policies that apply to ALL roles (including anon)
-- These will block anon access since auth.uid() returns null for unauthenticated users

CREATE POLICY "Only admins can view subscribers"
ON public.subscribers
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can insert subscribers"
ON public.subscribers
FOR INSERT
TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update subscribers"
ON public.subscribers
FOR UPDATE
TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

-- Also need to allow the service role to insert (for the newsletter signup edge function)
-- The service role bypasses RLS, so no additional policy needed for it