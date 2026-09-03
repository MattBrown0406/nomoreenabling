import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

// send-money-plan-email — daily drip for The Money Plan (5-day sequence
// triggered by the Enabling Cost Calculator).
//
// Day 1 is delivered instantly by course-enroll's welcome email; this function
// sends Days 2-5, one per day, to enrollments whose next_email_at is due.
// current_lesson counts drip emails sent (0 → Day 2 is next … 3 → Day 5 is next).
//
// Invoked by pg_cron daily at 15:00 UTC with the service-role key (see the
// money-plan cron migration). Manual invoke with the same bearer also works.

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const shell = (dayLabel: string, body: string) => `
  <!DOCTYPE html>
  <html>
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
  <body style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a1a1a; line-height: 1.7;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #932a2a; font-size: 24px; margin-bottom: 4px;">No More Enabling</h1>
      <p style="color: #888; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">The Money Plan · ${dayLabel} of 5</p>
    </div>
    ${body}
    <p>With you in this,<br><strong>Matt Brown</strong><br><span style="color:#888;font-size:14px;">Interventionist · NoMoreEnabling.com</span></p>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e5e5;">
    <p style="font-size: 12px; color: #666; text-align: center;">
      You're receiving this because you asked for the Money Plan after using the Enabling Cost Calculator.<br>
      <a href="https://nomoreenabling.com" style="color: #932a2a;">NoMoreEnabling.com</a>
    </p>
  </body>
  </html>
`;

const quote = (text: string) =>
  `<p style="padding: 15px; background: #faf5f5; border-left: 3px solid #932a2a; font-style: italic;">${text}</p>`;

interface Lesson {
  subject: string;
  html: (firstName: string | null) => string;
}

// Days 2-5. Day 1 (The Pause Rule) ships in the enrollment welcome email.
const LESSONS: Lesson[] = [
  {
    subject: "Day 2: The exact script for the next money request",
    html: (firstName) =>
      shell("Day 2", `
        <h2 style="font-size: 22px;">${firstName ? `${firstName}, the` : "The"} next request is coming.</h2>
        <p>You know it is. Maybe tonight, maybe next month — but the phone will ring, and the ask will come wrapped in an emergency. Yesterday you learned to pause. Today you get the words for what comes after the pause.</p>
        <h3 style="color: #932a2a; margin-top: 26px;">The script</h3>
        ${quote("I love you, and I'm not giving cash anymore. If you want help with treatment, an assessment, or a ride to a meeting, I'm all in — today. But I won't fund anything else while the addiction is running the show.")}
        <p>Read it again. Notice what it does:</p>
        <p><strong>It leads with love</strong> — because this isn't punishment, and saying so out loud keeps <em>you</em> steady.<br>
        <strong>It says "I won't," not "I can't"</strong> — "can't" invites negotiation; "won't" is a decision.<br>
        <strong>It offers a real yes</strong> — you're not closing the door, you're moving it. Help that points toward recovery is always on the table.</p>
        <p>They will push back. Expect the greatest hits: anger, guilt, "you're abandoning me," a sudden crisis that only cash can fix. You don't need a new argument for each one. You need the same sentence, said calmly, as many times as it takes.</p>
        <p><strong>Today's assignment:</strong> put the script in your phone's notes app, word for word. When the call comes, you won't have to be clever — just faithful to what you already decided.</p>
        <p>Tomorrow: what you <em>can</em> pay for — help that doesn't enable.</p>
      `),
  },
  {
    subject: "Day 3: What to fund instead — help that doesn't enable",
    html: (firstName) =>
      shell("Day 3", `
        <h2 style="font-size: 22px;">"No more cash" doesn't mean "no more help."</h2>
        <p>${firstName ? `${firstName}, this` : "This"} is the part most families never hear: stopping the money is only half the move. The other half is redirecting it — because your instinct to help is not the problem. Where the help lands is.</p>
        <h3 style="color: #932a2a; margin-top: 26px;">The green-light list</h3>
        <p>Paid <em>directly to the provider</em>, never as cash through their hands:</p>
        <p>✅ A treatment program, detox bed, or clinical assessment<br>
        ✅ Transportation to treatment or a meeting — a ride, a bus pass<br>
        ✅ A verified sober-living bed (paid to the house, not the person)<br>
        ✅ Food — a meal you share, groceries you buy, never grocery <em>money</em><br>
        ✅ A therapist for <em>you</em> — the family healing is part of the plan</p>
        <h3 style="color: #932a2a; margin-top: 26px;">The red-light list</h3>
        <p>🚫 Cash, in any amount, for any story<br>
        🚫 Rent and bills that make active addiction more comfortable<br>
        🚫 Paying off debts the addiction created<br>
        🚫 Bail and legal rescue that erases consequences before they can teach</p>
        <p>The test is one question: <strong>does this dollar move them toward recovery, or does it make the addiction cheaper to maintain?</strong></p>
        <p><strong>Today's assignment:</strong> write your own two lists — what you'll fund, what you're done funding. Put a dollar limit and a condition on anything in the green column.</p>
        <p>Tomorrow: the hardest audience for your new boundary — the other adults in your family.</p>
      `),
  },
  {
    subject: "Day 4: When your spouse won't stop paying",
    html: (firstName) =>
      shell("Day 4", `
        <h2 style="font-size: 22px;">A boundary only one parent holds isn't a boundary.</h2>
        <p>It's a doorway — and the addiction will find it. ${firstName ? `${firstName}, if` : "If"} you say no and someone else in the family quietly says yes, nothing you've built this week survives. Grandma's "little bit to tide him over" undoes all of it.</p>
        <p>So today isn't about your loved one. It's about the meeting you need to have with the other adults — spouse, ex, grandparents, siblings.</p>
        <h3 style="color: #932a2a; margin-top: 26px;">How to have it</h3>
        <p><strong>Don't open with the rules. Open with the number.</strong> Show them what you calculated. Not as an accusation — as information the family has never actually looked at together.</p>
        ${quote("I added it up. In the last year we've spent $__ protecting the addiction from consequences. I'm not asking you to be harsh. I'm asking us to point that same love and money somewhere that can actually work.")}
        <p><strong>Then ask for one agreement,</strong> not ten: <em>no money moves without the two of us talking first.</em> That's it. You're not asking the softer-hearted person to become hard — you're asking them not to decide alone under pressure, which is exactly what you promised yourself on Day 1.</p>
        <p>If someone won't align, don't burn the relationship over it. Hold your own line, tell them what you're doing and why, and let the results argue for you.</p>
        <p><strong>Today's assignment:</strong> name the one person most likely to keep paying, and put the conversation on the calendar this week.</p>
        <p>Tomorrow, the last one: how to know when the money problem is really a bigger problem — and what to do then.</p>
      `),
  },
  {
    subject: "Day 5: When it's time for more than a plan",
    html: (firstName) =>
      shell("Day 5", `
        <h2 style="font-size: 22px;">${firstName ? `${firstName}, let's` : "Let's"} be honest about what this week was.</h2>
        <p>The Pause Rule, the script, the green-light list, the family agreement — those will stop the bleed. For some families, that shift alone changes everything: the addiction runs out of easy fuel, and the person you love starts feeling the weight of their own choices for the first time in years.</p>
        <p>And for some families, it surfaces the truth: the money was never the real problem. It was the part of the problem you could measure.</p>
        <h3 style="color: #932a2a; margin-top: 26px;">Signs it's time for more</h3>
        <p>• Every conversation about treatment collapses into promises or rage<br>
        • The consequences are getting dangerous — overdose, DUIs, violence, disappearing<br>
        • You've held the line and they've simply routed around you<br>
        • Your family can't get aligned no matter how many talks you have</p>
        <p>None of those mean you failed. They mean the disease has outgrown what a family can manage alone — and that's precisely the moment a structured, loving intervention exists for.</p>
        <p style="margin-top: 22px;"><strong>Three doors, in order of weight:</strong></p>
        <p>1. <a href="https://soberhelpline.com/monday-zoom-registration" style="color: #932a2a; font-weight: bold;">The Family Squares</a> — my free Monday night family group on Zoom. Bring this week's questions.<br>
        2. <a href="https://nomoreenabling.com/family-situation-assessment" style="color: #932a2a; font-weight: bold;">The Family Situation Assessment</a> — five minutes to see how serious this actually is.<br>
        3. <a href="https://nomoreenabling.com/work-with-matt" style="color: #932a2a; font-weight: bold;">Work with me directly</a> — when your family needs a guide, not another article.</p>
        <p>Whatever you choose, hear this: the number you calculated five days ago was never a record of your foolishness. It was a record of your love. The work now is aiming that love where it can win.</p>
      `),
  },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Cron/service callers only — this function can email every enrollee.
    const authHeader = req.headers.get("Authorization") ?? "";
    if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const now = new Date().toISOString();

    const { data: enrollments, error: fetchError } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("course_name", "money-plan")
      .eq("is_active", true)
      .is("completed_at", null)
      .lte("next_email_at", now);

    if (fetchError) throw fetchError;

    console.log(`money-plan: ${enrollments?.length || 0} enrollments due`);

    let sent = 0;
    let errors = 0;

    for (const enrollment of enrollments || []) {
      const lessonIndex = enrollment.current_lesson;

      if (lessonIndex >= LESSONS.length) {
        await supabase
          .from("course_enrollments")
          .update({ completed_at: now, is_active: false })
          .eq("id", enrollment.id);
        continue;
      }

      const lesson = LESSONS[lessonIndex];

      try {
        const emailResponse = await resend.emails.send({
          from: "No More Enabling <contact@nomoreenabling.com>",
          to: [enrollment.email],
          subject: lesson.subject,
          html: lesson.html(enrollment.first_name),
        });
        if (emailResponse.error) throw new Error(JSON.stringify(emailResponse.error));


        const nextEmailAt = new Date();
        nextEmailAt.setDate(nextEmailAt.getDate() + 1);
        const isLast = lessonIndex === LESSONS.length - 1;

        await supabase
          .from("course_enrollments")
          .update({
            current_lesson: lessonIndex + 1,
            last_email_sent_at: now,
            next_email_at: isLast ? null : nextEmailAt.toISOString(),
            completed_at: isLast ? now : null,
            is_active: !isLast,
          })
          .eq("id", enrollment.id);

        sent++;
        console.log(`money-plan: sent day ${lessonIndex + 2} to ${enrollment.email}`);
      } catch (emailError) {
        console.error(`money-plan: failed for ${enrollment.email}:`, emailError);
        errors++;
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent, errors, total: enrollments?.length || 0 }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in send-money-plan-email:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
