-- Create course_enrollments table to track email course signups and progress
CREATE TABLE public.course_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  first_name TEXT,
  course_name TEXT NOT NULL DEFAULT 'boundaries',
  current_lesson INTEGER NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_email_sent_at TIMESTAMP WITH TIME ZONE,
  next_email_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE (email, course_name)
);

-- Enable Row Level Security
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Public can enroll in courses
CREATE POLICY "Anyone can enroll in courses"
ON public.course_enrollments
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can view enrollments
CREATE POLICY "Admins can view course enrollments"
ON public.course_enrollments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update enrollments (for sending emails)
CREATE POLICY "Admins can update course enrollments"
ON public.course_enrollments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete enrollments
CREATE POLICY "Admins can delete course enrollments"
ON public.course_enrollments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));