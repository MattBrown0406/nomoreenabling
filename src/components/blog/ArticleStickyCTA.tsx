import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

interface ArticleStickyCTAProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  compact?: boolean;
  articleSlug?: string;
  ctaLocation?: string;
}

const ArticleStickyCTA = ({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel = "Take the family assessment",
  secondaryHref = "/family-situation-assessment",
  compact = false,
  articleSlug,
  ctaLocation = "article_sticky",
}: ArticleStickyCTAProps) => {
  const trackClick = (targetHref: string, label: string) => {
    void trackFunnelEvent("sticky_cta_click", {
      source: ctaLocation,
      articleSlug,
      targetHref,
      metadata: { label },
    });
  };

  return (
    <div className={`rounded-2xl border border-primary/20 bg-background shadow-card ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ClipboardList className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm uppercase tracking-wide text-primary font-medium">Next best step</p>
          <h2 className={`font-serif font-bold text-foreground mt-1 ${compact ? "text-xl" : "text-2xl"}`}>{title}</h2>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{description}</p>
      <div className="mt-4 grid gap-2">
        <Button asChild>
          <Link to={primaryHref} onClick={() => trackClick(primaryHref, primaryLabel)}>
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={secondaryHref} onClick={() => trackClick(secondaryHref, secondaryLabel)}>{secondaryLabel}</Link>
        </Button>
      </div>
    </div>
  );
};

export default ArticleStickyCTA;
