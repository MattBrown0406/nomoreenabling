import { useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Loader2, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { blogPosts } from "@/data/blogPosts";
import { supabase } from "@/integrations/supabase/client";

interface Suggestion {
  slug: string;
  title: string;
  reason: string;
}

interface SuggestionsResponse {
  suggestions: Suggestion[];
  encouragement: string;
}

interface PersonalizedSuggestionsProps {
  assessmentScore?: number;
  assessmentLevel?: string;
}

const PersonalizedSuggestions = ({ assessmentScore, assessmentLevel }: PersonalizedSuggestionsProps) => {
  const [situation, setSituation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestionsResponse | null>(null);
  const [showInput, setShowInput] = useState(false);
  const { articlesRead } = useReadingProgress();
  const { toast } = useToast();

  const getSuggestions = async (includeSituation = false) => {
    setIsLoading(true);
    
    try {
      const availableArticles = blogPosts.map(post => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        categories: post.categories,
      }));

      const { data, error } = await supabase.functions.invoke('personalized-suggestions', {
        body: {
          articlesRead,
          assessmentScore,
          assessmentLevel,
          situation: includeSituation ? situation : undefined,
          availableArticles,
        },
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setSuggestions(data);
      setShowInput(false);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        title: "Couldn't get suggestions",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetSuggestions = () => {
    if (showInput && situation.trim()) {
      getSuggestions(true);
    } else {
      getSuggestions(false);
    }
  };

  const handleRefresh = () => {
    setSuggestions(null);
    setSituation("");
    setShowInput(false);
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          Personalized Reading Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!suggestions ? (
          <>
            <p className="text-sm text-muted-foreground">
              Get AI-powered article recommendations based on your reading history
              {assessmentLevel ? ` and assessment results` : ''}.
            </p>

            {showInput ? (
              <div className="space-y-3">
                <Textarea
                  placeholder="Briefly describe your situation (optional). For example: 'My adult son has been drinking heavily for 2 years. I've tried everything but nothing seems to work.'"
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="min-h-[100px] text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleGetSuggestions}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Finding articles...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Suggestions
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInput(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={handleGetSuggestions}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Finding articles...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Suggest Articles
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowInput(true)}
                  disabled={isLoading}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Describe Situation
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            {suggestions.encouragement && (
              <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                {suggestions.encouragement}
              </p>
            )}

            <div className="space-y-3">
              {suggestions.suggestions.map((suggestion, index) => {
                const article = blogPosts.find(p => p.slug === suggestion.slug);
                if (!article) return null;

                return (
                  <Link
                    key={suggestion.slug}
                    to={`/articles/${suggestion.slug}`}
                    className="block group"
                  >
                    <div className="flex gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/50 transition-colors">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {suggestion.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {suggestion.reason}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </Link>
                );
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Get New Suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PersonalizedSuggestions;
