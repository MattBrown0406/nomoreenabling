import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildSoberHelplineBridgeUrl, type ArticleBridgeLink } from "@/data/articleBridgeLinks";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";
import soberHelplineLogo from "@/assets/sober-helpline-logo.svg";

interface SoberHelplineBridgeCalloutProps {
  bridgeLink: ArticleBridgeLink;
  articleTitle: string;
}

// Brand palette anchored to the Sober Helpline lighthouse mark
const NAVY = "#16294a";
const NAVY_SOFT = "#1f3866";

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
    <aside
      className="relative overflow-hidden rounded-2xl border p-6 shadow-sm"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`,
        borderColor: NAVY,
        color: "#ffffff",
      }}
    >
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
        <img
          src={soberHelplineLogo}
          alt="Sober Helpline lighthouse logo"
          className="h-16 w-16 shrink-0 rounded-lg sm:h-20 sm:w-20"
        />
        <div className="flex-1">
          <div
            className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide"
            style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }}
          >
            {bridgeLink.eyebrow}
          </div>
          <h2 className="font-serif text-2xl font-bold leading-tight" style={{ color: "#ffffff" }}>
            {bridgeLink.title}
          </h2>
          <p className="mt-3 max-w-2xl" style={{ color: "rgba(255,255,255,0.85)" }}>
            {bridgeLink.description}
          </p>
          <Button
            asChild
            className="mt-5 border-0"
            style={{ backgroundColor: "#ffffff", color: NAVY }}
          >
            <a href={href} target="_blank" rel="noopener noreferrer" onClick={handleClick}>
              {bridgeLink.ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default SoberHelplineBridgeCallout;
