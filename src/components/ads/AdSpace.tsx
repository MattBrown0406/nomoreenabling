import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import FreedomInterventionsBanner from "@/components/ads/FreedomInterventionsBanner";
import PartyWreckersBanner from "@/components/ads/PartyWreckersBanner";
import { getHouseVariantForPlacement, type OwnedAdVariant, type SponsorPlacementKey } from "@/data/sponsorInventory";
import { trackFunnelEvent } from "@/lib/funnelAnalytics";

interface AdSpaceProps {
  size: "banner" | "sidebar" | "inline" | "leaderboard";
  className?: string;
  variant?: OwnedAdVariant;
  placementKey?: SponsorPlacementKey;
}

const spacingClasses = {
  banner: "my-6",
  sidebar: "",
  inline: "my-6",
  leaderboard: "my-8",
};

const defaultVariants = {
  banner: "party-wreckers",
  sidebar: "family-bridge",
  inline: "family-bridge",
  leaderboard: "freedom-interventions",
} as const;

const AdSpace = ({ size, className, variant, placementKey }: AdSpaceProps) => {
  const impressionTracked = useRef(false);
  const selectedVariant = variant ?? (placementKey ? getHouseVariantForPlacement(placementKey) : defaultVariants[size]);
  const bannerSize = size === "sidebar" ? "sidebar" : "leaderboard";

  useEffect(() => {
    if (impressionTracked.current) return;

    impressionTracked.current = true;
    void trackFunnelEvent("sponsor_impression", {
      source: "sponsor_placement",
      targetHref: placementKey ?? size,
      metadata: {
        placementKey: placementKey ?? null,
        size,
        variant: selectedVariant,
        mode: "house",
      },
    });
  }, [placementKey, selectedVariant, size]);

  const placement = {
    "family-bridge": <FamilyBridgeBanner size={bannerSize} />,
    "freedom-interventions": <FreedomInterventionsBanner size={bannerSize} />,
    "party-wreckers": <PartyWreckersBanner size={bannerSize} />,
  }[selectedVariant];

  return (
    <div
      className={cn("owned-ad-space", spacingClasses[size], className)}
      data-sponsor-placement={placementKey ?? size}
      data-sponsor-mode="house"
      aria-label="House sponsor placement"
    >
      {placement}
    </div>
  );
};

export default AdSpace;
