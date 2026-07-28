import { useMemo } from "react";
import { Quote, Users } from "lucide-react";
import { SITE_STATS } from "@/config/socialProof";

interface Props {
  variant?: "light" | "dark";
  showTestimonial?: boolean;
  className?: string;
}

/**
 * Compact social-proof line: subscriber count + one rotating testimonial.
 * Rotates deterministically by day so admins see consistent output within a day.
 */
const SocialProofLine = ({ variant = "light", showTestimonial = true, className = "" }: Props) => {
  const testimonial = useMemo(() => {
    const list = SITE_STATS.testimonials;
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % list.length;
    return list[dayIndex];
  }, []);

  const isDark = variant === "dark";
  const mutedText = isDark ? "text-primary-foreground/80" : "text-muted-foreground";
  const strongText = isDark ? "text-primary-foreground" : "text-foreground";
  const iconTint = isDark ? "text-primary-foreground/70" : "text-primary";

  return (
    <div className={`space-y-3 ${className}`}>
      <div className={`flex items-center justify-center gap-2 text-sm ${mutedText}`}>
        <Users size={14} className={iconTint} />
        <span>
          Joining <span className={`font-semibold ${strongText}`}>{SITE_STATS.subscriberCount}</span> families
          reading these emails.
        </span>
      </div>
      {showTestimonial && testimonial && (
        <blockquote
          className={`mx-auto max-w-md rounded-xl border ${isDark ? "border-primary-foreground/15 bg-primary-foreground/5" : "border-border bg-secondary/30"} p-4 text-left`}
        >
          <div className="flex gap-2">
            <Quote size={16} className={`mt-0.5 flex-shrink-0 ${iconTint}`} />
            <div>
              <p className={`text-sm italic ${strongText}`}>"{testimonial.quote}"</p>
              <p className={`mt-2 text-xs ${mutedText}`}>{testimonial.attribution}</p>
            </div>
          </div>
        </blockquote>
      )}
    </div>
  );
};

export default SocialProofLine;
