import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeString = (str: string | null | undefined, maxLength: number): string | null => {
  if (!str) return null;
  return str.trim().slice(0, maxLength);
};

const COURSE_INFO = {
  boundaries: {
    name: "Boundaries: Removing the Oxygen from the Fire of Addiction",
    totalLessons: 4,
    welcomeSubject: "Welcome to Your Boundaries Course",
    welcomeHtml: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 10px;">No More Enabling</h1>
        </div>
        
        <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 20px;">
          ${firstName ? `Welcome, ${firstName}!` : 'Welcome!'}
        </h2>
        
        <p>You've just taken an important step.</p>
        
        <p>Over the next four weeks, you'll receive one lesson each week from our course:</p>
        
        <p style="font-weight: bold; font-size: 18px; color: #7c3aed; text-align: center; padding: 20px; background: #f8f5ff; border-radius: 8px;">
          Boundaries: Removing the Oxygen from the Fire of Addiction
        </p>
        
        <p>Each lesson is designed to help you understand not just <em>what</em> boundaries are, but <em>why</em> they matter—and how to set them without cruelty or guilt.</p>
        
        <h3 style="margin-top: 30px;">What to expect:</h3>
        <ul style="padding-left: 20px;">
          <li><strong>Lesson 1:</strong> Why Boundaries Feel Like Abandonment (But Aren't)</li>
          <li><strong>Lesson 2:</strong> The Difference Between Boundaries and Ultimatums</li>
          <li><strong>Lesson 3:</strong> What Boundaries Actually Protect</li>
          <li><strong>Lesson 4:</strong> Holding Boundaries When It Hurts</li>
        </ul>
        
        <p style="margin-top: 30px;">Your first lesson will arrive in about a week. Until then, remember:</p>
        
        <p style="font-style: italic; color: #666; padding: 15px; border-left: 3px solid #7c3aed;">
          "You didn't cause it. You can't cure it. But you can stop participating in cycles that keep everyone stuck."
        </p>
        
        <p>With care,<br>
        <strong>The No More Enabling Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          You're receiving this because you signed up for our email course.<br>
          <a href="https://nomoreenabling.com" style="color: #7c3aed;">Visit our website</a>
        </p>
      </body>
      </html>
    `,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, first_name, course_name = 'boundaries' } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedEmail = email.trim().toLowerCase();
    
    if (!isValidEmail(sanitizedEmail)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const sanitizedFirstName = sanitizeString(first_name, 100);
    const courseInfo = COURSE_INFO[course_name as keyof typeof COURSE_INFO];

    if (!courseInfo) {
      return new Response(
        JSON.stringify({ error: 'Invalid course' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Processing course enrollment for: ${sanitizedEmail}, course: ${course_name}`);

    // Calculate next email date (1 week from now)
    const nextEmailAt = new Date();
    nextEmailAt.setDate(nextEmailAt.getDate() + 7);

    const { error } = await supabase
      .from('course_enrollments')
      .insert({ 
        email: sanitizedEmail, 
        first_name: sanitizedFirstName,
        course_name,
        current_lesson: 0,
        next_email_at: nextEmailAt.toISOString(),
      });

    if (error) {
      if (error.code === '23505') {
        console.log('Already enrolled:', sanitizedEmail);
        return new Response(
          JSON.stringify({ error: 'already_enrolled' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('Database error:', error.message);
      throw error;
    }

    // Send welcome email
    try {
      const emailResponse = await resend.emails.send({
        from: "No More Enabling <onboarding@resend.dev>",
        to: [sanitizedEmail],
        subject: courseInfo.welcomeSubject,
        html: courseInfo.welcomeHtml(sanitizedFirstName),
      });
      console.log('Welcome email sent:', emailResponse);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the enrollment if email fails
    }

    console.log('Successfully enrolled:', sanitizedEmail);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in course-enroll function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
