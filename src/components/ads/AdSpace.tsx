import { cn } from "@/lib/utils";
import FamilyBridgeBanner from "@/components/ads/FamilyBridgeBanner";
import FreedomInterventionsBanner from "@/components/ads/FreedomInterventionsBanner";
import PartyWreckersBanner from "@/components/ads/PartyWreckersBanner";

interface AdSpaceProps {
  size: "banner" | "sidebar" | "inline" | "leaderboard";
  className?: string;
  variant?: "family-bridge" | "freedom-interventions" | "party-wreckers";
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

const AdSpace = ({ size, className, variant }: AdSpaceProps) => {
  const selectedVariant = variant ?? defaultVariants[size];
  const bannerSize = size === "sidebar" ? "sidebar" : "leaderboard";

  const placement = {
    "family-bridge": <FamilyBridgeBanner size={bannerSize} />,
    "freedom-interventions": <FreedomInterventionsBanner size={bannerSize} />,
    "party-wreckers": <PartyWreckersBanner size={bannerSize} />,
  }[selectedVariant];

  return (
    <div className={cn("owned-ad-space", spacingClasses[size], className)}>
      {placement}
    </div>
  );
};

export default AdSpace;
