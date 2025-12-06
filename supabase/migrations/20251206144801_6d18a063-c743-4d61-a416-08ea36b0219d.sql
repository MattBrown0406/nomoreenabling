-- Force RLS on subscribers table to ensure policies are enforced for ALL users including table owners
ALTER TABLE public.subscribers FORCE ROW LEVEL SECURITY;