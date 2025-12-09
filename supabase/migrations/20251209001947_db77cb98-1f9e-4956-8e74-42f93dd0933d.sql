-- Create a table to track article views
CREATE TABLE public.article_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create an index for efficient querying by slug
CREATE INDEX idx_article_views_slug ON public.article_views(article_slug);

-- Create an index for time-based queries
CREATE INDEX idx_article_views_viewed_at ON public.article_views(viewed_at);

-- Enable Row Level Security
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert views (public tracking)
CREATE POLICY "Anyone can insert article views"
ON public.article_views
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read view counts (for displaying popular posts)
CREATE POLICY "Anyone can read article views"
ON public.article_views
FOR SELECT
USING (true);