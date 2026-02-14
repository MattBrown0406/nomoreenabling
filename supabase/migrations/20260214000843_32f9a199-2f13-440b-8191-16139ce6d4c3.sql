
-- Allow anyone to upsert article metadata (it's public data, not sensitive)
DROP POLICY "Admins can insert article metadata" ON public.articles_metadata;
DROP POLICY "Admins can update article metadata" ON public.articles_metadata;

CREATE POLICY "Anyone can insert article metadata"
ON public.articles_metadata FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update article metadata"
ON public.articles_metadata FOR UPDATE
USING (true);
