DROP POLICY IF EXISTS "Anyone can insert article metadata" ON public.articles_metadata;
DROP POLICY IF EXISTS "Anyone can update article metadata" ON public.articles_metadata;

CREATE POLICY "Admins can insert article metadata"
ON public.articles_metadata FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update article metadata"
ON public.articles_metadata FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));