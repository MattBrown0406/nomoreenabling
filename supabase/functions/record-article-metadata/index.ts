import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Seeds public.articles_metadata (used by the `sharepreview` function for
// social crawlers). The client only tells us WHICH slug to seed; the values
// come from the build-time blog feed on nomoreenabling.com, so an anonymous
// caller can never overwrite an article's share title/description/image.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SLUG_RE = /^[a-z0-9-]{1,160}$/;
const FEED_URL = Deno.env.get("ARTICLE_FEED_URL") || "https://nomoreenabling.com/blog-feed.json";
const FEED_TTL_MS = 15 * 60 * 1000;

interface FeedPost {
  slug: string;
  title: string;
  excerpt: string;
  url: string;
  image?: string;
}

let feedCache: { fetchedAt: number; posts: Map<string, FeedPost> } | null = null;

const loadFeed = async (): Promise<Map<string, FeedPost>> => {
  if (feedCache && Date.now() - feedCache.fetchedAt < FEED_TTL_MS) return feedCache.posts;

  const response = await fetch(FEED_URL, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Feed fetch failed with ${response.status}`);
  const body = await response.json() as { posts?: FeedPost[] };
  const posts = new Map<string, FeedPost>();
  for (const post of body.posts ?? []) {
    if (post && typeof post.slug === "string" && SLUG_RE.test(post.slug)) posts.set(post.slug, post);
  }
  feedCache = { fetchedAt: Date.now(), posts };
  return posts;
};

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json().catch(() => null);
    const slug = body && typeof body.slug === "string" ? body.slug.trim() : "";
    if (!SLUG_RE.test(slug)) return json({ error: "Invalid input" }, 400);

    const posts = await loadFeed();
    const post = posts.get(slug);
    if (!post) return json({ error: "Unknown article" }, 404);

    const title = String(post.title || "").trim().slice(0, 300);
    const description = String(post.excerpt || "").trim().slice(0, 1000);
    const image_url = typeof post.image === "string" && /^https:\/\//i.test(post.image)
      ? post.image.slice(0, 2000)
      : "https://nomoreenabling.com/favicon.jpg";
    if (!title || !description) return json({ error: "Article has no metadata" }, 422);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Only write when something actually changed so page views do not
    // generate a row update each time.
    const { data: existing } = await supabase
      .from("articles_metadata")
      .select("title, description, image_url")
      .eq("slug", slug)
      .maybeSingle();

    if (
      existing &&
      existing.title === title &&
      existing.description === description &&
      existing.image_url === image_url
    ) {
      return json({ success: true, unchanged: true });
    }

    const { error } = await supabase
      .from("articles_metadata")
      .upsert(
        { slug, title, description, image_url, updated_at: new Date().toISOString() },
        { onConflict: "slug" },
      );

    if (error) {
      console.error("record-article-metadata upsert error:", error.message);
      return json({ error: "Upsert failed" }, 500);
    }

    return json({ success: true });
  } catch (err) {
    console.error("record-article-metadata error:", err);
    return json({ error: "Unexpected error" }, 500);
  }
});
