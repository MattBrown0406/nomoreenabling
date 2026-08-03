import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// refresh-press-feed — weekly press-page updater.
//
// Fetches The Party Wreckers RSS feed and stores the latest episodes in the
// press_feed table, which the /press page reads. Invoked by pg_cron every
// Monday at 14:00 UTC with the service-role key (see the press_feed
// migration); manual invoke with the same bearer also works.

const FEED_URL = "https://rss.buzzsprout.com/1941777.rss";
const MAX_EPISODES = 5;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Episode {
  title: string;
  url: string;
  published_at: string;
}

const decodeEntities = (value: string): string =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'");

const firstMatch = (block: string, patterns: RegExp[]): string | null => {
  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
};

function parseEpisodes(xml: string): Episode[] {
  const episodes: Episode[] = [];
  const items = xml.split(/<item[\s>]/).slice(1);

  for (const raw of items) {
    const block = raw.split("</item>")[0] ?? raw;
    const title = firstMatch(block, [
      /<title>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/,
      /<title>([\s\S]*?)<\/title>/,
    ]);
    const link = firstMatch(block, [
      /<link>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/link>/,
      /<link>([\s\S]*?)<\/link>/,
    ]);
    const pubDate = firstMatch(block, [/<pubDate>([\s\S]*?)<\/pubDate>/]);
    if (!title || !link) continue;

    const published = pubDate ? new Date(pubDate) : null;
    episodes.push({
      title: decodeEntities(title),
      url: decodeEntities(link),
      published_at: published && !Number.isNaN(published.getTime())
        ? published.toISOString()
        : "",
    });
    if (episodes.length >= MAX_EPISODES) break;
  }
  return episodes;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!supabaseServiceKey || authHeader !== `Bearer ${supabaseServiceKey}`) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const feedResponse = await fetch(FEED_URL, {
      headers: { "User-Agent": "NoMoreEnabling-PressPage/1.0" },
    });
    if (!feedResponse.ok) {
      throw new Error(`Feed fetch failed: ${feedResponse.status}`);
    }
    const xml = await feedResponse.text();
    const episodes = parseEpisodes(xml);

    if (episodes.length === 0) {
      // A parse regression should never blank the press page — keep old data.
      console.error("refresh-press-feed: parsed 0 episodes; leaving press_feed unchanged");
      return new Response(
        JSON.stringify({ success: false, reason: "no_episodes_parsed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { error } = await supabase
      .from("press_feed")
      .upsert({ id: 1, episodes, updated_at: new Date().toISOString() });

    if (error) throw error;

    console.log(`refresh-press-feed: stored ${episodes.length} episodes`);
    return new Response(
      JSON.stringify({ success: true, episodes: episodes.length }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error in refresh-press-feed:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
