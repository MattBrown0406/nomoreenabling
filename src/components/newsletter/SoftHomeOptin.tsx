import { useRef, useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { friendlyInvokeError, readInvokeError } from "@/lib/invokeError";
import { trackGAConversion } from "@/lib/gaConversions";
import NewsletterTurnstile from "./NewsletterTurnstile";
import useNewsletterTurnstile from "@/hooks/useNewsletterTurnstile";

const SoftHomeOptin = () => {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const loadedAt = useRef(Date.now());
  const { turnstileToken, setTurnstileToken, turnstileResetKey, resetTurnstile } = useNewsletterTurnstile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || honeypot) {
      setDone(true);
      return;
    }
    if (Date.now() - loadedAt.current < 3000) {
      setDone(true);
      return;
    }
    if (!turnstileToken) {
      toast({ title: "Please complete the security check.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    void trackFunnelEvent("email_capture_attempt", {
      source: "home_soft_optin",
      metadata: { placement: "home_soft_optin" },
    });
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-signup", {
        body: {
          email: email.trim(),
          source: "home_soft_optin",
          _t: loadedAt.current,
          website: honeypot,
          form_ms: Date.now() - loadedAt.current,
          turnstile_token: turnstileToken,
        },
      });
      if (error) throw error;
      setDone(true);
      void trackFunnelEvent("email_capture_success", {
        source: "home_soft_optin",
        metadata: { placement: "home_soft_optin" },
      });
      trackGAConversion("newsletter_signup", { placement: "home_soft_optin" });
      toast({
        title: "Check your inbox to confirm.",
        description: "You will join the list after clicking the confirmation link.",
      });
    } catch (err) {
      resetTurnstile();
      const serverMessage = friendlyInvokeError(await readInvokeError(err));
      toast({
        title: serverMessage ? "Could not subscribe" : "Something went wrong",
        description: serverMessage ?? "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary/40 border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <Mail className="mt-0.5 h-4 w-4 text-primary flex-shrink-0" />
            <p className="text-sm text-foreground">
              {done ? (
                <span className="font-medium">Thanks — check your inbox and confirm your subscription.</span>
              ) : (
                <>
                  <span className="font-medium">Not in crisis?</span>{" "}
                  <span className="text-muted-foreground">
                    Get weekly clarity for families dealing with addiction — one short email each Sunday.
                  </span>
                </>
              )}
            </p>
          </div>
          {!done && (
            <form onSubmit={handleSubmit} className="flex w-full md:w-auto gap-2">
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
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 md:w-64 h-9"
              />
              <Button size="sm" type="submit" disabled={isSubmitting || !turnstileToken}>
                {isSubmitting ? "..." : "Subscribe"}
              </Button>
              <NewsletterTurnstile
                resetKey={turnstileResetKey}
                onTokenChange={setTurnstileToken}
                className="flex min-h-0 w-full justify-center md:w-auto"
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoftHomeOptin;
