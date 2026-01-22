import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SuggestionRequest {
  articlesRead: string[];
  assessmentScore?: number;
  assessmentLevel?: string;
  situation?: string;
  availableArticles: Array<{
    slug: string;
    title: string;
    excerpt: string;
    categories: string[];
  }>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { articlesRead, assessmentScore, assessmentLevel, situation, availableArticles }: SuggestionRequest = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Filter out already-read articles
    const unreadArticles = availableArticles.filter(a => !articlesRead.includes(a.slug));
    
    // Build context about what user has read
    const readArticleTitles = availableArticles
      .filter(a => articlesRead.includes(a.slug))
      .map(a => a.title);

    const systemPrompt = `You are a compassionate guide for families dealing with addiction. Your role is to recommend the most helpful articles based on the user's situation and reading history.

You understand codependency, enabling behaviors, boundary-setting, and family dynamics in addiction. You're warm but direct—like a wise counselor who tells the truth with kindness.

Guidelines:
- Recommend 3 articles maximum
- Focus on what would be most helpful RIGHT NOW for this person
- Consider their emotional state and readiness
- If they seem early in their journey, start with foundational content
- If they're further along, suggest deeper material
- Always explain WHY each article would help them specifically`;

    let userPrompt = `Based on the following information, recommend the 3 most helpful articles for this person:\n\n`;

    if (readArticleTitles.length > 0) {
      userPrompt += `**Articles they've already read:**\n${readArticleTitles.map(t => `- ${t}`).join('\n')}\n\n`;
    } else {
      userPrompt += `**Reading history:** They haven't read any articles yet.\n\n`;
    }

    if (assessmentLevel && assessmentScore !== undefined) {
      userPrompt += `**Self-Assessment Results:** ${assessmentLevel} level (score: ${assessmentScore})\n`;
      if (assessmentLevel === 'high' || assessmentLevel === 'established') {
        userPrompt += `This suggests significant patterns of enabling or codependency that may benefit from focused learning.\n\n`;
      } else if (assessmentLevel === 'mild') {
        userPrompt += `This suggests some concerning patterns that could benefit from awareness and prevention.\n\n`;
      } else {
        userPrompt += `This suggests minimal concerning patterns—they may be researching for someone else or seeking general education.\n\n`;
      }
    }

    if (situation && situation.trim()) {
      userPrompt += `**Their situation (in their words):**\n"${situation}"\n\n`;
    }

    userPrompt += `**Available articles to recommend from:**\n`;
    for (const article of unreadArticles.slice(0, 20)) {
      userPrompt += `- "${article.title}" (${article.categories.join(', ')}): ${article.excerpt.slice(0, 100)}...\n`;
    }

    userPrompt += `\nReturn your response as JSON with this structure:
{
  "suggestions": [
    {
      "slug": "article-slug-here",
      "title": "Article Title",
      "reason": "One sentence explaining why this article would help them specifically"
    }
  ],
  "encouragement": "A brief, warm message acknowledging their journey (1-2 sentences)"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON response
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      // If JSON parsing fails, return a fallback
      console.error("Failed to parse AI response:", content);
      parsed = {
        suggestions: unreadArticles.slice(0, 3).map(a => ({
          slug: a.slug,
          title: a.title,
          reason: "This article provides valuable insights for families navigating addiction.",
        })),
        encouragement: "You're taking an important step by seeking information and support.",
      };
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in personalized-suggestions:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
