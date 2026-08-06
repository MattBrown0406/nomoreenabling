import { useRef, useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";
import SocialProofLine from "./SocialProofLine";
import { markSubscribed } from "@/hooks/useAbVariant";

interface Props {
  articleSlug?: string;
  category?: string;
}

const ArticleEndSubscribe = ({ articleSlug, category }: Props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const loadedAt = useRef(Date.now());

  const contextLabel = category ? `families dealing with ${category.toLowerCase()}` : "families like this";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (honeypot) {
      setDone(true);
      return;
    }
    if (Date.now() - loadedAt.current < 3000) {
      setDone(true);
      return;
    }

    setIsSubmitting(true);
    void trackFunnelEvent("email_capture_attempt", {
      source: "article_end",
      articleSlug,
      metadata: { placement: "article_end", category },
    });

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: email.trim(),
          first_name: firstName.trim() || null,
          source: "article_end",
          article_slug: articleSlug ?? null,
          _t: loadedAt.current,
          website: honeypot,
          form_ms: Date.now() - loadedAt.current,
        },
      });
      if (error && data?.error !== "already_subscribed") throw error;

      setDone(true);
      markSubscribed();
      void trackFunnelEvent("email_capture_success", {
        source: "article_end",
        articleSlug,
        metadata: { placement: "article_end", alreadySubscribed: data?.error === "already_subscribed" },
      });
      trackGAConversion("newsletter_signup", { placement: "article_end", article_slug: articleSlug });
      toast({
        title: data?.error === "already_subscribed" ? "Already on the list." : "You are subscribed.",
        description: "Look for a welcome email from Matt.",
      });
    } catch {
      void trackFunnelEvent("email_capture_failure", {
        source: "article_end",
        articleSlug,
        metadata: { placement: "article_end" },
      });
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-secondary/30 p-6 md:p-8" aria-label="Subscribe">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
        </div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mt-4">
          {done ? "You are on the list." : `Get weekly guidance for ${contextLabel}`}
        </h2>
        <p className="mt-3 text-muted-foreground">
          {done
            ? "Look for a welcome email from Matt. Reply to it anytime — real inbox, real reply."
            : "Every Sunday, one short email with practical family guidance on boundaries, enabling, relapse, and next steps."}
        </p>

        {!done && (
          <form onSubmit={handleSubmit} className="mt-6 max-w-md mx-auto grid gap-3">
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <Input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Get the emails"}
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <SocialProofLine showTestimonial={!done} />
        </div>
      </div>
    </section>
  );
};

export default ArticleEndSubscribe;
