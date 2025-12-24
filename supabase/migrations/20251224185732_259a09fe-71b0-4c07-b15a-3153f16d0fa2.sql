-- Ensure RLS is enabled on subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypass)
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;