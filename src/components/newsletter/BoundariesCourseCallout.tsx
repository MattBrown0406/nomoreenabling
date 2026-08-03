import { useRef, useState } from "react";
import { useEnrollGuard } from "@/lib/enrollGuard";
import { BookOpen, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import { trackGAConversion } from "@/lib/gaConversions";
import SocialProofLine from "./SocialProofLine";
import { markSubscribed } from "@/hooks/useAbVariant";

interface Props {
  source: string; // "home_below_hero" | "article_mid" | "assessment_result" | ...
  headline?: string;
  subhead?: string;
  compact?: boolean;
}

const DEFAULT_HEADLINE = "Free 4-week Boundaries email course";
const DEFAULT_SUBHEAD =
  "One lesson a week — the exact language, scripts, and family agreements that hold up when your loved one pushes back.";

const outline = [
  "Week 1 — What a real boundary actually is (and is not)",
  "Week 2 — Naming the boundary without threats or ultimatums",
  "Week 3 — Holding the line when they test it",
  "Week 4 — Getting your family on the same page",
];

const BoundariesCourseCallout = ({ source, headline, subhead, compact = false }: Props) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { honeypotProps, guardFields } = useEnrollGuard();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const loadedAt = useRef(Date.now());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (honeypot) {
      setIsEnrolled(true);
      return;
    }
    if (Date.now() - loadedAt.current < 3000) {
      setIsEnrolled(true);
      return;
    }

    setIsSubmitting(true);
    void trackFunnelEvent("email_capture_attempt", {
      source: `boundaries_course_${source}`,
      metadata: { placement: source },
    });

    try {
      const { data, error } = await supabase.functions.invoke("course-enroll", {
        body: {
          email: email.trim(),
          first_name: firstName.trim() || null,
          course_name: "boundaries",
          source,
          ...guardFields(),
        },
      });
      if (error) throw error;

      setIsEnrolled(true);
      markSubscribed();
      void trackFunnelEvent("email_capture_success", {
        source: `boundaries_course_${source}`,
        metadata: { placement: source, alreadyEnrolled: data?.error === "already_enrolled" },
      });
      trackGAConversion("boundaries_course_enroll", { placement: source });
      toast({
        title: data?.error === "already_enrolled" ? "You are already enrolled" : "You are in.",
        description: "Check your inbox — the first lesson is on its way.",
      });
    } catch {
      void trackFunnelEvent("email_capture_failure", {
        source: `boundaries_course_${source}`,
        metadata: { placement: source },
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
    <section
      className={`rounded-2xl border border-primary/20 bg-primary/5 ${compact ? "p-5" : "p-6 md:p-8"}`}
      aria-label="Free Boundaries email course"
    >
      <div className="flex items-start gap-3">
        <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
          {isEnrolled ? <CheckCircle2 className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-primary font-medium">Free family email course</p>
          <h2 className={`font-serif font-bold text-foreground mt-1 ${compact ? "text-2xl" : "text-3xl"}`}>
            {isEnrolled ? "Lesson 1 is on the way" : headline ?? DEFAULT_HEADLINE}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {isEnrolled
              ? "Check your inbox. If it did not arrive within a few minutes, check spam or promotions."
              : subhead ?? DEFAULT_SUBHEAD}
          </p>
        </div>
      </div>

      {!isEnrolled ? (
        <>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {outline.map((line) => (
              <li key={line} className="flex gap-2 text-sm text-foreground/90">
                <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
          <input {...honeypotProps} />
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
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isSubmitting}>
                <Mail className="h-4 w-4" />
                {isSubmitting ? "Enrolling..." : "Send me lesson 1"}
              </Button>
            </div>
          </form>

          <div className="mt-5">
            <SocialProofLine />
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl border border-primary/20 bg-background p-4 text-sm text-muted-foreground">
          You will receive one lesson per week for four weeks. Unsubscribe anytime.
        </div>
      )}
    </section>
  );
};

export default BoundariesCourseCallout;
