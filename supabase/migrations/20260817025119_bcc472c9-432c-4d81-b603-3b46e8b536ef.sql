REVOKE ALL ON public.lead_magnet_downloads FROM anon;
REVOKE ALL ON public.lead_magnet_downloads FROM authenticated;
GRANT SELECT ON public.lead_magnet_downloads TO authenticated;
GRANT ALL ON public.lead_magnet_downloads TO service_role;

DROP POLICY IF EXISTS "No client writes to lead magnet downloads" ON public.lead_magnet_downloads;
CREATE POLICY "No client writes to lead magnet downloads"
ON public.lead_magnet_downloads
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Admins can view lead magnet downloads" ON public.lead_magnet_downloads;
CREATE POLICY "Admins can view lead magnet downloads"
ON public.lead_magnet_downloads
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

REVOKE ALL ON public.newsletter_optin_attempts FROM anon;
REVOKE ALL ON public.newsletter_optin_attempts FROM authenticated;
GRANT ALL ON public.newsletter_optin_attempts TO service_role;

DROP POLICY IF EXISTS "No client access to newsletter optin attempts" ON public.newsletter_optin_attempts;
CREATE POLICY "No client access to newsletter optin attempts"
ON public.newsletter_optin_attempts
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);