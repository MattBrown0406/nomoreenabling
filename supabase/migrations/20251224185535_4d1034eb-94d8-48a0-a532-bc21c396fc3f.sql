-- Ensure RLS is enabled on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Force RLS for table owner as well (prevents bypass)
ALTER TABLE public.user_roles FORCE ROW LEVEL SECURITY;