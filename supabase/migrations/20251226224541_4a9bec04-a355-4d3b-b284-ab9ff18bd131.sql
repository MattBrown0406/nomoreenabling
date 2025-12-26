-- Ensure RLS is enabled on subscribers (idempotent)
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Remove duplicate/ambiguous SELECT policy if it exists
DROP POLICY IF EXISTS "Deny public select on subscribers" ON public.subscribers;

-- Recreate a single, explicit admin-only SELECT policy scoped to authenticated users
DROP POLICY IF EXISTS "Admins can view subscribers" ON public.subscribers;
CREATE POLICY "Admins can view subscribers"
ON public.subscribers
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Keep write policies admin-only and explicitly scoped to authenticated users
DROP POLICY IF EXISTS "Admins can update subscribers" ON public.subscribers;
CREATE POLICY "Admins can update subscribers"
ON public.subscribers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Admins can delete subscribers" ON public.subscribers;
CREATE POLICY "Admins can delete subscribers"
ON public.subscribers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Leave public INSERT open for newsletter signups (existing behavior)
-- (No change)