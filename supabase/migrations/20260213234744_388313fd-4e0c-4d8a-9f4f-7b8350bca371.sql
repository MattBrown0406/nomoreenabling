
-- Create ad_clicks table for tracking ad engagement
CREATE TABLE public.ad_clicks (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ad_name text NOT NULL,
  clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  page_path text
);

-- Enable RLS
ALTER TABLE public.ad_clicks ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (track clicks)
CREATE POLICY "Anyone can track ad clicks"
ON public.ad_clicks
FOR INSERT
WITH CHECK (true);

-- Only admins can view
CREATE POLICY "Admins can view ad clicks"
ON public.ad_clicks
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
