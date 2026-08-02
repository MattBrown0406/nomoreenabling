import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-automation-secret, x-client-info, apikey, content-type",
};

const SITE_URL = "https://nomoreenabling.com";
const FEED_URL = `${SITE_URL}/blog-feed.json`;
const MEETING_URL = "https://soberhelpline.com/monday-zoom-registration";
const SOBER_HELPLINE_APP_URL = "https://apps.apple.com/us/app/sober-helpline/id6780034996";
const FAMILY_BRIDGE_APP_URL = "https://familybridgeapp.com";
const COACHING_URL =
  "https://www.freedominterventions.com/book-intervention-consultation#booking";

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

interface FeedPost {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  readTime?: string;
  date: string;
  url: string;
  image?: string;
}

const authorize = async (req: Request, supabase: ReturnType<typeof createClient>) => {
  const automationSecret = Deno.env.get("FOLLOWUP_AUTOMATION_SECRET");
  if (automationSecret && req.headers.get("x-automation-secret") === automationSecret) return true;

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return false;
  const token = authHeader.replace("Bearer ", "").trim();

  if (token === Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) return true;

  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) return false;

  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return Boolean(roleData);
};

const buildPostsHtml = (posts: FeedPost[]) =>
  posts
    .map(
      (post) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 26px 0;border:1px solid #ecdcd4;border-radius:12px;overflow:hidden;background:#fffdfb;">
          <tr>
            <td style="padding:0;">
              ${
                post.image
                  ? `<img src="${escapeHtml(post.image)}" alt="${escapeHtml(post.title)}" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />`
                  : ""
              }
            </td>
          </tr>
          <tr>
            <td style="padding:20px 22px 24px 22px;">
              <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#9a5b4d;">
                ${escapeHtml(post.category || "New article")}${post.readTime ? ` &middot; ${escapeHtml(post.readTime)}` : ""}
              </p>
              <h3 style="margin:0 0 10px 0;font-size:20px;line-height:1.3;color:#2c1a16;">
                <a href="${escapeHtml(post.url)}" style="color:#2c1a16;text-decoration:none;">${escapeHtml(post.title)}</a>
              </h3>
              <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#5b4a45;">${escapeHtml(post.excerpt)}</p>
              <a href="${escapeHtml(post.url)}" style="display:inline-block;background:#8c2f24;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 20px;border-radius:8px;">Read the article</a>
            </td>
          </tr>
        </table>`,
    )
    .join("");

const buildEmailHtml = (posts: FeedPost[], rangeLabel: string) => `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f7f1ec;font-family:Georgia,'Times New Roman',serif;">
  <div style="display:none;max-height:0;overflow:hidden;">This week on No More Enabling: ${escapeHtml(posts.length)} new articles, the free Family Squares meeting, and tools for families.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f1ec;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;">
        <tr>
          <td style="background:#8c2f24;padding:26px 24px;text-align:center;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:.02em;">No More Enabling</p>
            <p style="margin:6px 0 0 0;font-size:13px;color:#f4d9d2;">This week's reading &middot; ${escapeHtml(rangeLabel)}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 24px 8px 24px;">
            <p style="margin:0 0 6px 0;font-size:16px;line-height:1.6;color:#3a2823;">Hi {{first_name}},</p>
            <p style="margin:0 0 22px 0;font-size:16px;line-height:1.7;color:#5b4a45;">Here's everything we published this week — support for your family without fear and without guilt.</p>
          </td>
        </tr>
        <tr><td style="padding:0 24px;">${buildPostsHtml(posts)}</td></tr>

        <!-- Family Squares meeting -->
        <tr>
          <td style="padding:6px 24px 26px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf4ef;border:1px solid #ecdcd4;border-radius:12px;">
              <tr><td style="padding:22px;">
                <h3 style="margin:0 0 8px 0;font-size:19px;color:#2c1a16;">Free family support meeting: The Family Squares</h3>
                <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#5b4a45;">Every Monday, families meet on Zoom to talk honestly about boundaries, guilt, and what actually helps. It's free, and you don't have to say a word your first time.</p>
                <a href="${MEETING_URL}" style="display:inline-block;background:#8c2f24;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:12px 22px;border-radius:8px;">Register for the meeting</a>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Sober Helpline app -->
        <tr>
          <td style="padding:0 24px 26px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#16294a;border-radius:12px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#9fb4d8;">Sponsored &middot; Sober Helpline App</p>
                <h3 style="margin:0 0 10px 0;font-size:20px;color:#ffffff;">Practice the hard conversation before you have it</h3>
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:#d6e0f0;">
                  Rehearse difficult conversations with AI — adjust your loved one's emotional temperature, age, and gender so you prepare for the real conversation, not the easy one. Plus free weekly family support meetings, replays of meetings you missed, and live chat or video coaching with an experienced interventionist.
                </p>
                <a href="${SOBER_HELPLINE_APP_URL}" style="display:inline-block;background:#ffffff;color:#16294a;text-decoration:none;font-size:15px;font-weight:700;padding:12px 22px;border-radius:8px;">Download the Sober Helpline app</a>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- Family Bridge app + coaching -->
        <tr>
          <td style="padding:0 24px 26px 24px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0f5f63;border-radius:12px;">
              <tr><td style="padding:24px;">
                <p style="margin:0 0 6px 0;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#9fd8d6;">Sponsored &middot; Family Bridge App</p>
                <h3 style="margin:0 0 10px 0;font-size:20px;color:#ffffff;">Stay aligned as a family, without the chaos</h3>
                <p style="margin:0 0 14px 0;font-size:15px;line-height:1.6;color:#d3ecec;">Family Bridge helps families coordinate support, track agreements, and keep everyone on the same page instead of working against each other.</p>
                <a href="${FAMILY_BRIDGE_APP_URL}" style="display:inline-block;background:#ffffff;color:#0f5f63;text-decoration:none;font-size:15px;font-weight:700;padding:12px 22px;border-radius:8px;">Get the Family Bridge app</a>
                <p style="margin:18px 0 12px 0;font-size:15px;line-height:1.6;color:#d3ecec;">Want help applying any of this to your own family? I offer one-on-one consultations for families deciding what to do next.</p>
                <a href="${COACHING_URL}" style="display:inline-block;border:1px solid #ffffff;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;padding:11px 20px;border-radius:8px;">Book a consultation with Matt</a>
              </td></tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 30px 24px;text-align:center;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#8a7b76;">
              You're receiving this because you subscribed at nomoreenabling.com.<br />
              If you're in crisis, call or text 988. In an emergency, call 911.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    if (!(await authorize(req, supabase))) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let body: Record<string, unknown> = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }

    const dryRun = body.dry_run === true;
    const days = Number(body.days) > 0 ? Math.min(Number(body.days), 60) : 7;

    // Pull the published blog feed (generated at build time).
    const feedResponse = await fetch(`${FEED_URL}?t=${Date.now()}`);
    if (!feedResponse.ok) {
      throw new Error(`Failed to load blog feed: ${feedResponse.status}`);
    }
    const feed = (await feedResponse.json()) as { posts: FeedPost[] };

    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;
    const recent = (feed.posts || [])
      .map((post) => ({ post, time: new Date(post.date).getTime() }))
      .filter(({ time }) => Number.isFinite(time) && time >= cutoff && time <= now + 86_400_000)
      .sort((a, b) => b.time - a.time)
      .map(({ post }) => post);

    if (recent.length === 0) {
      console.log("No new posts in window — skipping weekly digest.");
      return new Response(
        JSON.stringify({ success: true, skipped: true, reason: "no_new_posts", posts: 0 }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const rangeLabel = new Date(now).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "America/Los_Angeles",
    });

    const html = buildEmailHtml(recent, `week of ${rangeLabel}`);
    const subject =
      recent.length === 1
        ? `New this week: ${recent[0].title}`
        : `This week on No More Enabling: ${recent.length} new articles`;

    const { data: subscribers, error: subscribersError } = await supabase
      .from("subscribers")
      .select("email, first_name")
      .eq("is_active", true);

    if (subscribersError) throw subscribersError;

    if (dryRun) {
      return new Response(
        JSON.stringify({
          success: true,
          dry_run: true,
          subject,
          posts: recent.map((p) => ({ title: p.title, url: p.url, date: p.date })),
          recipients: subscribers?.length ?? 0,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const subscriber of subscribers ?? []) {
      const personalized = html.replace(
        /{{first_name}}/g,
        escapeHtml(subscriber.first_name || "friend"),
      );
      try {
        const { error: sendError } = await resend.emails.send({
          from: "No More Enabling <contact@nomoreenabling.com>",
          to: [subscriber.email as string],
          subject,
          html: personalized,
        });
        if (sendError) {
          failed++;
          errors.push(`${subscriber.email}: ${sendError.message}`);
        } else {
          successful++;
        }
      } catch (error) {
        failed++;
        errors.push(`${subscriber.email}: ${(error as Error).message}`);
      }
    }

    await supabase.from("email_campaigns").insert({
      subject,
      body_html: html,
      recipients: (subscribers ?? []).map((s) => s.email as string),
      sent_count: successful,
      failed_count: failed,
      campaign_type: "weekly_digest",
      sent_at: new Date().toISOString(),
    });

    console.log(`Weekly digest sent. posts=${recent.length} ok=${successful} failed=${failed}`);

    return new Response(
      JSON.stringify({
        success: true,
        posts: recent.length,
        successful,
        failed,
        errors: errors.length ? errors.slice(0, 20) : undefined,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("send-weekly-digest error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
