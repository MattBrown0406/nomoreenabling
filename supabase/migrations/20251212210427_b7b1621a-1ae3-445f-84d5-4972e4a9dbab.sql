-- Drop the permissive public read policy
DROP POLICY IF EXISTS "Anyone can read article views" ON public.article_views;

-- Create admin-only read policy
CREATE POLICY "Admins can view article views"
ON public.article_views
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));