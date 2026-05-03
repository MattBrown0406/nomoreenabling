import { ArrowRight, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSoberHelplineBridgeUrl, type ArticleBridgeLink } from "@/data/articleBridgeLinks";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

interface SoberHelplineBridgeCalloutProps {
  bridgeLink: ArticleBridgeLink;
  articleTitle: string;
}

const SoberHelplineBridgeCallout = ({ bridgeLink, articleTitle }: SoberHelplineBridgeCalloutProps) => {
  const href = buildSoberHelplineBridgeUrl(bridgeLink.slug);

  const handleClick = () => {
    void trackFunnelEvent("outbound_offer_click", {
      source: "article_sober_helpline_bridge",
      articleSlug: bridgeLink.slug,
      offerSlug: "sober-helpline",
      targetHref: href,
      metadata: {
        label: bridgeLink.ctaLabel,
        intent: bridgeLink.intent,
        articleTitle,
      },
    });
  };

  return (
    <aside className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-background to-secondary/50 p-6 shadow-sm">
      <div className="relative">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
          <LifeBuoy className="h-3.5 w-3.5" />
          {bridgeLink.eyebrow}
        </div>
        <h2 className="font-serif text-2xl font-bold leading-tight text-foreground">{bridgeLink.title}</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">{bridgeLink.description}</p>
        <Button asChild className="mt-5">
          <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
            {bridgeLink.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </aside>
  );
};

export default SoberHelplineBridgeCallout;
