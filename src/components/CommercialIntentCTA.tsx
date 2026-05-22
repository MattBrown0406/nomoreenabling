import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CommercialIntentPage } from "@/data/commercialIntentPages";
import { trackGAConversion } from "@/lib/gaConversions";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import PhoneCallButton from "@/components/PhoneCallButton";

interface CommercialIntentCTAProps {
  page: CommercialIntentPage;
  source: "article" | "topic_hub" | "start_here";
  articleSlug?: string;
  hubSlug?: string;
  compact?: boolean;
}

const CommercialIntentCTA = ({ page, source, articleSlug, hubSlug, compact = false }: CommercialIntentCTAProps) => {
  const href = `/${page.slug}`;

  const trackClick = (label: string, targetHref: string) => {
    trackGAConversion("money_page_cta_click", {
      source,
      lead_intent: page.leadIntent,
      article_slug: articleSlug,
      hub_slug: hubSlug,
      cta_label: label,
    });
    void trackFunnelEvent("article_intent_cta_click", {
      source: `commercial_intent_${source}`,
      articleSlug,
      targetHref,
      metadata: {
        pageSlug: page.slug,
        leadIntent: page.leadIntent,
        hubSlug,
        label,
      },
    });
  };

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 md:p-6">
      <div className="flex gap-4">
        <div className="hidden sm:flex h-11 w-11 rounded-full bg-primary/10 text-primary items-center justify-center flex-shrink-0">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm uppercase tracking-wide text-primary font-medium">High-intent next step</p>
          <h2 className={`font-serif font-bold text-foreground mt-2 ${compact ? "text-2xl" : "text-2xl md:text-3xl"}`}>
            {page.title}
          </h2>
          <p className="mt-3 text-muted-foreground">
            {page.description}
          </p>
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <Button asChild>
              <Link to={href} onClick={() => trackClick("Open dedicated guidance page", href)}>
                Open guidance page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to={`${href}#consultation-form`} onClick={() => trackClick("Request guidance from intent CTA", `${href}#consultation-form`)}>
                Request guidance
              </Link>
            </Button>
            <PhoneCallButton source={`commercial_intent_${source}_${page.slug}`} variant="coral" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialIntentCTA;
