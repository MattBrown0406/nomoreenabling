-- Drop existing policies that only cover authenticated users
DROP POLICY IF EXISTS "Admins can view user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;

-- Create new policies that apply to ALL roles (including anon)
CREATE POLICY "Admins can view user_roles"
ON public.user_roles
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage user_roles"
ON public.user_roles
FOR ALL
TO public
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));