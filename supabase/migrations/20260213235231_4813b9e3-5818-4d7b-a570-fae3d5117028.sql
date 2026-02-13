
-- Create articles_metadata table for OG tag serving
CREATE TABLE public.articles_metadata (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.articles_metadata ENABLE ROW LEVEL SECURITY;

-- Public read access (crawlers need this)
CREATE POLICY "Anyone can read article metadata"
ON public.articles_metadata FOR SELECT
USING (true);

-- Only admins can insert/update
CREATE POLICY "Admins can insert article metadata"
ON public.articles_metadata FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update article metadata"
ON public.articles_metadata FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete article metadata"
ON public.articles_metadata FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));
