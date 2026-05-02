import { cn } from "@/lib/utils";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import FreedomInterventionsBanner from "@/components/ads/FreedomInterventionsBanner";
import PartyWreckersBanner from "@/components/ads/PartyWreckersBanner";
import { getHouseVariantForPlacement, type OwnedAdVariant, type SponsorPlacementKey } from "@/data/sponsorInventory";

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
  const selectedVariant = variant ?? (placementKey ? getHouseVariantForPlacement(placementKey) : defaultVariants[size]);
  const bannerSize = size === "sidebar" ? "sidebar" : "leaderboard";

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
