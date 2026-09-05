import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { enqueueSpineEvent } from "../_shared/spine.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

// Disposable email domains commonly used by bots
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.de', 'grr.la', 'guerrillamailblock.com',
  'tempmail.com', 'temp-mail.org', 'throwaway.email', 'fakeinbox.com', 'sharklasers.com',
  'guerrillamail.info', 'guerrillamail.biz', 'guerrillamail.net', 'yopmail.com', 'yopmail.fr',
  'trashmail.com', 'trashmail.me', 'trashmail.net', 'dispostable.com', 'maildrop.cc',
  'mailnesia.com', 'tempail.com', 'tempr.email', 'discard.email', 'discardmail.com',
  'getnada.com', 'getairmail.com', 'mailcatch.com', 'mailexpire.com', 'mailnull.com',
  'mintemail.com', 'mohmal.com', 'mytemp.email', 'spambox.us', 'spamfree24.org',
  'tempomail.fr', 'temporaryemail.net', 'temporaryinbox.com', 'throwawayemailaddress.com',
  'tmpmail.net', 'tmpmail.org', 'trash-mail.at', 'trashymail.com', 'wegwerfmail.de',
  '10minutemail.com', '20minutemail.com', 'dodgeit.com', 'dodgit.com', 'devnullmail.com',
]);

const isDisposableEmail = (email: string): boolean => {
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
};

const sanitizeString = (str: string | null | undefined, maxLength: number): string | null => {
  if (!str) return null;
  return str.trim().slice(0, maxLength);
};

// ── Anti-abuse guards ─────────────────────────────────────────────────────────
// Layer 1: per-IP rate limit (hard 429 — stops volume).
// Layer 2: honeypot field `website` (bots fill it; humans never see it).
// Layer 3: time trap `form_ms` (a real person takes >3s to type an email).
// Honeypot/time-trap failures return a FAKE success so bots learn nothing.
// form_ms is only enforced when present so pre-guard cached bundles keep
// working; once all clients ship the field, this can be made strict.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MIN_FORM_MS = 3000;

const clientIp = (req: Request): string =>
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  req.headers.get('cf-connecting-ip') ||
  'unknown';

const fakeSuccess = () =>
  new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );

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
          ${firstName ? `Welcome, ${escapeHtml(firstName)}!` : 'Welcome!'}
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
    cadenceDays: 7,
    welcomeDeliversFirstLesson: false,
  },
  "money-plan": {
    name: "The Money Plan",
    totalLessons: 5,
    cadenceDays: 1,
    welcomeDeliversFirstLesson: true,
    welcomeSubject: "Day 1: The Pause Rule — read this before the next request",
    welcomeHtml: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #932a2a; font-size: 24px; margin-bottom: 4px;">No More Enabling</h1>
          <p style="color: #888; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">The Money Plan · Day 1 of 5</p>
        </div>

        <h2 style="font-size: 22px; margin-bottom: 20px;">${firstName ? `${escapeHtml(firstName)}, you` : 'You'} just looked at a hard number.</h2>

        <p>Most families never add it up. You did. That takes more courage than it sounds like — and it means you're ready for what comes next.</p>

        <p>Over the next five days I'm going to give you a short, practical plan for stopping the financial bleed without abandoning the person you love. One email a day. Each one takes about three minutes.</p>

        <h3 style="color: #932a2a; margin-top: 30px;">Day 1: The Pause Rule</h3>

        <p>Here it is: <strong>from today forward, no money decision gets made during the phone call.</strong></p>

        <p>Every dollar in the number you calculated was moved under pressure — a crisis, a deadline, a voice you love saying "I need it tonight." Urgency is the addiction's best salesman. The Pause Rule takes urgency off the table:</p>

        <p style="padding: 15px; background: #faf5f5; border-left: 3px solid #932a2a; font-style: italic;">
          "I hear you. I'm not deciding anything on this call. I'll get back to you tomorrow."
        </p>

        <p>That's the whole move. You don't have to say no yet. You don't have to argue, explain, or defend. You just have to not decide <em>right now</em>. A real emergency survives 24 hours of thought. A manipulation usually doesn't.</p>

        <p><strong>Today's assignment:</strong> say the pause line out loud three times. Yes, actually out loud — the first time you say it can't be the moment the phone rings.</p>

        <p>Tomorrow: the exact script for the next money request.</p>

        <p>With you in this,<br><strong>Matt Brown</strong><br><span style="color:#888;font-size:14px;">Interventionist · NoMoreEnabling.com</span></p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        <p style="font-size: 12px; color: #666; text-align: center;">
          You're receiving this because you asked for the Money Plan after using the Enabling Cost Calculator.<br>
          <a href="https://nomoreenabling.com" style="color: #932a2a;">NoMoreEnabling.com</a>
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
    const body = await req.json();
    const { email, first_name, course_name = 'boundaries' } = body;

    // Layer 2+3: honeypot and time trap — silently discard, report success.
    const honeypot = typeof body.website === 'string' ? body.website.trim() : '';
    if (honeypot.length > 0) {
      console.log('course-enroll: honeypot tripped, dropping silently');
      return fakeSuccess();
    }
    if (body.form_ms !== undefined) {
      const formMs = Number(body.form_ms);
      if (!Number.isFinite(formMs) || formMs < MIN_FORM_MS) {
        console.log('course-enroll: time trap tripped, dropping silently');
        return fakeSuccess();
      }
    }

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

    if (isDisposableEmail(sanitizedEmail)) {
      console.log('Disposable email rejected for course enrollment');
      return new Response(
        JSON.stringify({ error: 'Please use a permanent email address' }),
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

    // Layer 1: per-IP rate limit — hard stop for scripted volume.
    const ip = clientIp(req);
    const windowStart = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
    const { count: recentAttempts } = await supabase
      .from('course_enroll_attempts')
      .select('id', { count: 'exact', head: true })
      .eq('ip', ip)
      .gte('created_at', windowStart);

    if ((recentAttempts ?? 0) >= RATE_LIMIT_MAX) {
      console.log(`course-enroll: rate limit hit for ip bucket (count=${recentAttempts})`);
      return new Response(
        JSON.stringify({ error: 'Too many attempts. Please try again in a few minutes.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    await supabase.from('course_enroll_attempts').insert({ ip });
    // Opportunistic pruning keeps the table tiny; failures are harmless.
    // (A PostgrestBuilder only runs when awaited — `void` never executed it.)
    const { error: pruneError } = await supabase
      .from('course_enroll_attempts')
      .delete()
      .lt('created_at', new Date(Date.now() - 6 * RATE_LIMIT_WINDOW_MS).toISOString());
    if (pruneError) console.warn('course-enroll: prune failed:', pruneError.message);

    console.log(`Processing course enrollment for: ${sanitizedEmail}, course: ${course_name}`);

    // Cadence is per-course: weekly for the boundaries course, daily for the
    // Money Plan (whose welcome email delivers Day 1 immediately).
    const nextEmailAt = new Date();
    nextEmailAt.setDate(nextEmailAt.getDate() + courseInfo.cadenceDays);

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
        // 200 rather than 409: supabase.functions.invoke() turns non-2xx into
        // an error with data=null, so the client could never read this flag.
        return new Response(
          JSON.stringify({ success: true, already_enrolled: true }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('Database error:', error.message);
      throw error;
    }

    // Send welcome email
    try {
      const emailResponse = await resend.emails.send({
        from: "No More Enabling <contact@nomoreenabling.com>",
        to: [sanitizedEmail],
        subject: courseInfo.welcomeSubject,
        html: courseInfo.welcomeHtml(sanitizedFirstName),
      });
      if (emailResponse.error) {
        console.error('Welcome email rejected by provider:', emailResponse.error);
      } else {
        console.log('Welcome email sent:', emailResponse.data?.id);
      }
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the enrollment if email fails
    }


    console.log('Successfully enrolled:', sanitizedEmail);

    await enqueueSpineEvent("lead_captured", {
      email: sanitizedEmail,
      name: sanitizedFirstName ?? null,
      props: { source: "course_enroll", course_name },
    });

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
