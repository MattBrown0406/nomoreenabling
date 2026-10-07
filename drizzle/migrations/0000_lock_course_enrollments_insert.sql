DROP POLICY IF EXISTS "Anyone can enroll in courses" ON public.course_enrollments;
REVOKE INSERT ON public.course_enrollments FROM anon, authenticated;
GRANT ALL ON public.course_enrollments TO service_role;