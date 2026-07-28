import { useRef, useState } from "react";
import { CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";
import { markSubscribed } from "@/hooks/useAbVariant";

interface Props {
  source: string; // "consultation_form" | "advertiser_form"
  defaultEmail?: string;
  defaultFirstName?: string;
}

const PostSubmitSubscribe = ({ source, defaultEmail = "", defaultFirstName = "" }: Props) => {
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const loadedAt = useRef(Date.now());

  if (dismissed) return null;

  const subscribe = async () => {
    if (!defaultEmail) return;
    setIsSubmitting(true);
    void trackFunnelEvent("email_capture_attempt", {
      source: `post_submit_${source}`,
      metadata: { placement: source },
    });
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: defaultEmail.trim(),
          first_name: defaultFirstName.trim() || null,
          source: `post_submit_${source}`,
          _t: loadedAt.current - 4000, // pre-date to bypass 3s server check
        },
      });
      if (error && data?.error !== "already_subscribed") throw error;
      setSubscribed(true);
      markSubscribed();
      void trackFunnelEvent("email_capture_success", {
        source: `post_submit_${source}`,
        metadata: { placement: source, alreadySubscribed: data?.error === "already_subscribed" },
      });
      trackGAConversion("newsletter_signup", { placement: `post_submit_${source}` });
      toast({
        title: data?.error === "already_subscribed" ? "Already on the list." : "Subscribed.",
        description: "Look for a welcome email from Matt.",
      });
    } catch {
      toast({
        title: "Could not subscribe",
        description: "Please try from the newsletter box on the homepage.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
          {subscribed ? <CheckCircle2 className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-bold text-foreground">
            {subscribed ? "You are on the list." : "One more thing"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {subscribed
              ? "You will get weekly family guidance from Matt. Reply anytime — it goes to a real inbox."
              : "Would you also like weekly family support articles? One short email, every Sunday."}
          </p>

          {!subscribed && (
            <div className="mt-4 space-y-2">
              {!defaultEmail && (
                <Input
                  type="email"
                  placeholder="Email address"
                  onChange={() => {}}
                  disabled
                  className="hidden"
                />
              )}
              <div className="flex flex-wrap gap-3">
                <Button onClick={subscribe} disabled={isSubmitting || !defaultEmail}>
                  {isSubmitting ? "Adding..." : "Yes, subscribe me"}
                </Button>
                <Button variant="ghost" onClick={() => setDismissed(true)}>
                  No thanks
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostSubmitSubscribe;
