DROP POLICY IF EXISTS "Anyone can insert article views" ON public.article_views;
CREATE POLICY "Anyone can insert article views" ON public.article_views FOR INSERT TO anon, authenticated
WITH CHECK (char_length(article_slug) BETWEEN 1 AND 200 AND article_slug ~ '^[a-z0-9-]+$' AND viewed_at > now() - interval '5 minutes' AND viewed_at < now() + interval '5 minutes');
DROP POLICY IF EXISTS "Anyone can track ad clicks" ON public.ad_clicks;
CREATE POLICY "Anyone can track ad clicks" ON public.ad_clicks FOR INSERT TO anon, authenticated
WITH CHECK (char_length(ad_name) BETWEEN 1 AND 200 AND (page_path IS NULL OR char_length(page_path) <= 500) AND (placement_key IS NULL OR char_length(placement_key) <= 100) AND clicked_at > now() - interval '5 minutes' AND clicked_at < now() + interval '5 minutes');