import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Course lesson content
const BOUNDARIES_LESSONS = [
  {
    subject: "Lesson 1: Why Boundaries Feel Like Abandonment (But Aren't)",
    html: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 5px;">No More Enabling</h1>
          <p style="color: #666; font-size: 14px;">Boundaries Course • Lesson 1 of 4</p>
        </div>
        
        <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 20px;">
          Why Boundaries Feel Like Abandonment (But Aren't)
        </h2>
        
        ${firstName ? `<p>Hi ${firstName},</p>` : ''}
        
        <p>When you set a boundary with someone struggling with addiction, they often react as though you've abandoned them. And worse—you might <em>feel</em> like you have.</p>
        
        <p>This is one of the most painful parts of loving someone in active addiction.</p>
        
        <p>But here's what's actually happening:</p>
        
        <p style="font-weight: bold; padding: 15px; background: #f8f5ff; border-left: 3px solid #7c3aed;">
          Addiction needs access to you to survive. A boundary interrupts that access. So addiction frames the boundary as cruelty.
        </p>
        
        <p>This isn't your loved one manipulating you—though it may feel that way. It's addiction doing what addiction does: protecting itself.</p>
        
        <h3 style="margin-top: 25px;">The Difference Between Abandonment and Boundaries</h3>
        
        <p><strong>Abandonment</strong> says: "I don't care what happens to you. You're on your own."</p>
        
        <p><strong>A boundary</strong> says: "I love you, and I will not participate in this."</p>
        
        <p>Abandonment withdraws love. A boundary withdraws access to harmful patterns—<em>while the love remains</em>.</p>
        
        <h3 style="margin-top: 25px;">Why It Still Hurts</h3>
        
        <p>Even when you understand this, it still hurts. That's normal. You're not doing something wrong because it feels hard.</p>
        
        <p>In fact, if it were easy, it probably wouldn't be a real boundary.</p>
        
        <h3 style="margin-top: 25px;">This Week's Reflection</h3>
        
        <p style="font-style: italic; color: #666; padding: 15px; border-left: 3px solid #7c3aed;">
          Think about a time when someone told you "no" out of love—a parent, a mentor, a friend. How did it feel at the time? How do you see it now?
        </p>
        
        <p>Next week, we'll explore the critical difference between boundaries and ultimatums—and why confusing the two keeps families stuck.</p>
        
        <p>With care,<br>
        <strong>The No More Enabling Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          <a href="https://nomoreenabling.com/articles" style="color: #7c3aed;">Read more articles</a> • 
          <a href="https://nomoreenabling.com" style="color: #7c3aed;">Visit our website</a>
        </p>
      </body>
      </html>
    `,
  },
  {
    subject: "Lesson 2: The Difference Between Boundaries and Ultimatums",
    html: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 5px;">No More Enabling</h1>
          <p style="color: #666; font-size: 14px;">Boundaries Course • Lesson 2 of 4</p>
        </div>
        
        <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 20px;">
          The Difference Between Boundaries and Ultimatums
        </h2>
        
        ${firstName ? `<p>Hi ${firstName},</p>` : ''}
        
        <p>Families often confuse these two things—and the confusion keeps everyone stuck.</p>
        
        <h3 style="margin-top: 25px;">What's an Ultimatum?</h3>
        
        <p>An ultimatum is a demand aimed at controlling someone else's behavior:</p>
        
        <p style="padding: 15px; background: #fff5f5; border-left: 3px solid #dc2626;">
          "If you don't stop drinking, I'm leaving."<br>
          "Get clean or I'm cutting you off."<br>
          "Go to rehab or don't come home."
        </p>
        
        <p>These statements focus on <em>what the other person must do</em>.</p>
        
        <h3 style="margin-top: 25px;">What's a Boundary?</h3>
        
        <p>A boundary is a decision about <em>your own behavior</em>—regardless of what they choose:</p>
        
        <p style="padding: 15px; background: #f8f5ff; border-left: 3px solid #7c3aed;">
          "I will not give you money while you're actively using."<br>
          "I won't engage in conversations when you've been drinking."<br>
          "I need to sleep in a separate room when you come home intoxicated."
        </p>
        
        <p>See the difference? Boundaries don't require the other person to change. They define what <em>you</em> will and won't do.</p>
        
        <h3 style="margin-top: 25px;">Why This Matters</h3>
        
        <p>Ultimatums often fail because:</p>
        <ul style="padding-left: 20px;">
          <li>They depend on someone else's compliance</li>
          <li>They're often issued in moments of desperation</li>
          <li>They're rarely enforced, which trains the other person to ignore them</li>
        </ul>
        
        <p>Boundaries work because they're <em>yours</em>. You can keep them whether anyone else agrees or not.</p>
        
        <h3 style="margin-top: 25px;">This Week's Reflection</h3>
        
        <p style="font-style: italic; color: #666; padding: 15px; border-left: 3px solid #7c3aed;">
          Think about a "boundary" you've set that was really an ultimatum. What would it look like reframed as something you control?
        </p>
        
        <p>Next week: What boundaries actually protect—and it's not what you think.</p>
        
        <p>With care,<br>
        <strong>The No More Enabling Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          <a href="https://nomoreenabling.com/articles" style="color: #7c3aed;">Read more articles</a> • 
          <a href="https://nomoreenabling.com" style="color: #7c3aed;">Visit our website</a>
        </p>
      </body>
      </html>
    `,
  },
  {
    subject: "Lesson 3: What Boundaries Actually Protect",
    html: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 5px;">No More Enabling</h1>
          <p style="color: #666; font-size: 14px;">Boundaries Course • Lesson 3 of 4</p>
        </div>
        
        <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 20px;">
          What Boundaries Actually Protect
        </h2>
        
        ${firstName ? `<p>Hi ${firstName},</p>` : ''}
        
        <p>Most people think boundaries exist to protect <em>you</em> from the person with addiction.</p>
        
        <p>That's only partly true.</p>
        
        <h3 style="margin-top: 25px;">Boundaries Protect Three Things</h3>
        
        <p><strong>1. Your wellbeing</strong></p>
        <p>Yes, boundaries protect your mental health, your finances, your peace. This is real and valid.</p>
        
        <p><strong>2. The relationship</strong></p>
        <p>Without boundaries, resentment builds. You start to despise the person you love. Boundaries preserve what's left of the relationship so that if recovery happens, there's something to rebuild.</p>
        
        <p><strong>3. Their opportunity to grow</strong></p>
        <p style="font-weight: bold; padding: 15px; background: #f8f5ff; border-left: 3px solid #7c3aed;">
          When you absorb every consequence, you remove the pressure that often motivates change.
        </p>
        
        <p>This is the hardest truth: your "helping" may be standing between them and the discomfort that leads to recovery.</p>
        
        <h3 style="margin-top: 25px;">The Oxygen Metaphor</h3>
        
        <p>Addiction is like a fire. It needs fuel to keep burning.</p>
        
        <p>Every time you:</p>
        <ul style="padding-left: 20px;">
          <li>Pay a bill they should pay</li>
          <li>Lie to cover for them</li>
          <li>Smooth over consequences</li>
          <li>Accept promises you know won't be kept</li>
        </ul>
        
        <p>...you're adding oxygen to the fire.</p>
        
        <p>Boundaries don't put out the fire. But they stop <em>you</em> from feeding it.</p>
        
        <h3 style="margin-top: 25px;">This Week's Reflection</h3>
        
        <p style="font-style: italic; color: #666; padding: 15px; border-left: 3px solid #7c3aed;">
          What "oxygen" have you been providing? What would happen if you stopped?
        </p>
        
        <p>Next week: Our final lesson on holding boundaries when it hurts the most.</p>
        
        <p>With care,<br>
        <strong>The No More Enabling Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          <a href="https://nomoreenabling.com/articles" style="color: #7c3aed;">Read more articles</a> • 
          <a href="https://nomoreenabling.com" style="color: #7c3aed;">Visit our website</a>
        </p>
      </body>
      </html>
    `,
  },
  {
    subject: "Lesson 4: Holding Boundaries When It Hurts",
    html: (firstName: string | null) => `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #7c3aed; font-size: 24px; margin-bottom: 5px;">No More Enabling</h1>
          <p style="color: #666; font-size: 14px;">Boundaries Course • Lesson 4 of 4</p>
        </div>
        
        <h2 style="font-size: 22px; color: #1a1a1a; margin-bottom: 20px;">
          Holding Boundaries When It Hurts
        </h2>
        
        ${firstName ? `<p>Hi ${firstName},</p>` : ''}
        
        <p>Setting a boundary is hard. Keeping it is harder.</p>
        
        <p>Because the moment you set one, you'll face:</p>
        <ul style="padding-left: 20px;">
          <li>Guilt ("Am I being cruel?")</li>
          <li>Pushback ("You've changed. You don't love me anymore.")</li>
          <li>Doubt ("Maybe I'm overreacting.")</li>
          <li>Pressure from others ("They're family—you have to help.")</li>
        </ul>
        
        <p>Here's what to remember:</p>
        
        <h3 style="margin-top: 25px;">1. Guilt Is Not a Reliable Guide</h3>
        
        <p>Guilt often shows up when you do something <em>different</em>, not when you do something <em>wrong</em>.</p>
        
        <p>If you've spent years enabling, doing the healthy thing will feel wrong at first. That's conditioning, not truth.</p>
        
        <h3 style="margin-top: 25px;">2. Expect Resistance</h3>
        
        <p>When you change the rules, people resist. This is predictable—plan for it.</p>
        
        <p style="font-weight: bold; padding: 15px; background: #f8f5ff; border-left: 3px solid #7c3aed;">
          The strength of someone's resistance is often proportional to how much they benefited from your lack of boundaries.
        </p>
        
        <h3 style="margin-top: 25px;">3. You Don't Have to Explain</h3>
        
        <p>A boundary doesn't require justification. "No" is a complete sentence.</p>
        
        <p>Explaining often invites debate. You don't need permission to protect your peace.</p>
        
        <h3 style="margin-top: 25px;">4. Get Support</h3>
        
        <p>You're not meant to do this alone. Groups like Al-Anon, therapists, and family programs exist because this is genuinely hard work.</p>
        
        <p>Surround yourself with people who understand what you're navigating.</p>
        
        <h3 style="margin-top: 25px;">A Final Thought</h3>
        
        <p style="font-style: italic; color: #666; padding: 15px; border-left: 3px solid #7c3aed;">
          "You didn't cause it. You can't cure it. You can't control it. But you can stop participating in patterns that keep everyone stuck—including you."
        </p>
        
        <p>Thank you for taking this journey with us. We hope these lessons serve you well.</p>
        
        <p>With care,<br>
        <strong>The No More Enabling Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="text-align: center; margin-top: 20px;">
          <a href="https://nomoreenabling.com/articles" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Continue Reading on Our Blog</a>
        </p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          You've completed the Boundaries email course.<br>
          <a href="https://nomoreenabling.com" style="color: #7c3aed;">Visit our website</a>
        </p>
      </body>
      </html>
    `,
  },
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get all enrollments due for an email
    const now = new Date().toISOString();
    const { data: enrollments, error: fetchError } = await supabase
      .from('course_enrollments')
      .select('*')
      .eq('course_name', 'boundaries')
      .eq('is_active', true)
      .is('completed_at', null)
      .lte('next_email_at', now);

    if (fetchError) {
      throw fetchError;
    }

    console.log(`Found ${enrollments?.length || 0} enrollments due for emails`);

    let sent = 0;
    let errors = 0;

    for (const enrollment of enrollments || []) {
      const lessonIndex = enrollment.current_lesson;
      
      if (lessonIndex >= BOUNDARIES_LESSONS.length) {
        // Course complete
        await supabase
          .from('course_enrollments')
          .update({
            completed_at: now,
            is_active: false,
          })
          .eq('id', enrollment.id);
        continue;
      }

      const lesson = BOUNDARIES_LESSONS[lessonIndex];

      try {
        await resend.emails.send({
          from: "No More Enabling <onboarding@resend.dev>",
          to: [enrollment.email],
          subject: lesson.subject,
          html: lesson.html(enrollment.first_name),
        });

        // Calculate next email date
        const nextEmailAt = new Date();
        nextEmailAt.setDate(nextEmailAt.getDate() + 7);

        const isLastLesson = lessonIndex === BOUNDARIES_LESSONS.length - 1;

        await supabase
          .from('course_enrollments')
          .update({
            current_lesson: lessonIndex + 1,
            last_email_sent_at: now,
            next_email_at: isLastLesson ? null : nextEmailAt.toISOString(),
            completed_at: isLastLesson ? now : null,
            is_active: !isLastLesson,
          })
          .eq('id', enrollment.id);

        sent++;
        console.log(`Sent lesson ${lessonIndex + 1} to ${enrollment.email}`);
      } catch (emailError) {
        console.error(`Failed to send to ${enrollment.email}:`, emailError);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, errors, total: enrollments?.length || 0 }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-course-email function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
