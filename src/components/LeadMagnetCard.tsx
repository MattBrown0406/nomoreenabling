import { useRef, useState } from "react";
import { ArrowRight, CheckCircle2, Download, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { LeadMagnet } from "@/data/leadMagnets";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";
import { withOwnedUtm } from "@/lib/ownedLinks";

interface LeadMagnetCardProps {
  magnet: LeadMagnet;
  source: string;
  articleSlug?: string;
  hubSlug?: string;
  compact?: boolean;
}

const familySquaresHref = withOwnedUtm("https://soberhelpline.com", {
  medium: "lead_magnet",
  campaign: "family_squares",
  content: "lead_magnet_thank_you",
});

const LeadMagnetCard = ({ magnet, source, articleSlug, hubSlug, compact = false }: LeadMagnetCardProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const loadedAt = useRef(Date.now());

  const eventMetadata = {
    leadMagnet: magnet.slug,
    leadMagnetTitle: magnet.title,
    hubSlug: hubSlug ?? null,
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;

    if (honeypot) {
      setIsUnlocked(true);
      return;
    }

    setIsSubmitting(true);

    void trackFunnelEvent("email_capture_attempt", {
      source: "lead_magnet",
      articleSlug,
      targetHref: magnet.slug,
      metadata: eventMetadata,
    });

    try {
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email,
          first_name: firstName || null,
          source: "lead_magnet",
          lead_magnet: magnet.slug,
          lead_magnet_source: source,
          article_slug: articleSlug ?? null,
          hub_slug: hubSlug ?? null,
          page_path: window.location.pathname,
          _t: loadedAt.current,
        },
      });

      if (error) throw error;

      setIsUnlocked(true);
      setEmail("");
      setFirstName("");

      void trackFunnelEvent("lead_magnet_signup", {
        source: "lead_magnet",
        articleSlug,
        targetHref: magnet.slug,
        metadata: { ...eventMetadata, alreadySubscribed: data?.error === "already_subscribed" },
      });

      trackGAConversion("lead_magnet_signup", {
        lead_magnet: magnet.slug,
        lead_magnet_source: source,
        article_slug: articleSlug,
        hub_slug: hubSlug,
      });

      void trackFunnelEvent("email_capture_success", {
        source: "lead_magnet",
        articleSlug,
        targetHref: magnet.slug,
        metadata: eventMetadata,
      });
    } catch {
      void trackFunnelEvent("email_capture_failure", {
        source: "lead_magnet",
        articleSlug,
        targetHref: magnet.slug,
        metadata: eventMetadata,
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
    <section className={`rounded-2xl border border-primary/20 bg-primary/5 ${compact ? "p-5" : "p-6 md:p-7"}`}>
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
          {isUnlocked ? <CheckCircle2 className="h-5 w-5" /> : <Download className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-primary font-medium">Free family tool</p>
          <h2 className={`font-serif font-bold text-foreground mt-1 ${compact ? "text-2xl" : "text-3xl"}`}>
            {isUnlocked ? magnet.thankYouTitle : magnet.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {isUnlocked ? magnet.thankYouDescription : magnet.description}
          </p>
        </div>
      </div>

      {!isUnlocked ? (
        <>
          <div className="mt-5 flex flex-wrap gap-2">
            {magnet.bullets.map((bullet) => (
              <span key={bullet} className="rounded-full bg-background/80 border border-border px-3 py-1 text-xs text-muted-foreground">
                {bullet}
              </span>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <Input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(event) => setHoneypot(event.target.value)}
              />
            </div>
            <Input
              type="text"
              placeholder="First name (optional)"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
            />
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Unlocking..." : magnet.formTitle}
              </Button>
            </div>
          </form>

          <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            <p>This does not replace the Family Squares meeting. It gives you a practical tool first, then points you toward the live support room if you need help using it.</p>
          </div>
        </>
      ) : (
        <div className="mt-6 space-y-5">
          {magnet.guideSections.map((section) => (
            <div key={section.heading} className="rounded-xl border border-border bg-background p-4">
              <h3 className="font-semibold text-foreground">{section.heading}</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-xl border border-primary/20 bg-background p-4">
            <p className="font-medium text-foreground">Next step: bring it to Family Squares</p>
            <p className="mt-1 text-sm text-muted-foreground">
              If the tool raises a real family decision, Family Squares is the place to talk it through with support instead of deciding alone.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a
                  href={familySquaresHref}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() =>
                    trackGAConversion("family_squares_click", {
                      source: "lead_magnet_thank_you",
                      lead_magnet: magnet.slug,
                    })
                  }
                >
                  <Mail className="h-4 w-4" />
                  Register for Family Squares
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/#newsletter">
                  Stay on the email list
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default LeadMagnetCard;
