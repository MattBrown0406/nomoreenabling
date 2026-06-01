import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import { Brain, Shield, MessageSquare, TrendingUp, Pill, MapPin, DollarSign, FileText } from "lucide-react";
import { trackAdClick } from "@/lib/trackAdClick";
import { withOwnedUtm } from "@/lib/ownedLinks";
import AppStoreBadge from "@/components/AppStoreBadge";

interface FamilyBridgeBannerProps {
  size?: "sidebar" | "leaderboard";
}

const FamilyBridgeBanner = ({ size = "leaderboard" }: FamilyBridgeBannerProps) => {
  const isLeaderboard = size === "leaderboard";
  const href = withOwnedUtm("https://familybridgeapp.com", {
    medium: "house_ad",
    campaign: "family_bridge_app",
    content: `family_bridge_${size}`,
  });

  if (isLeaderboard) {
    return (
      <div
        className="block bg-gradient-to-r from-[#0d4a4a] via-[#0f5f5f] to-[#0d4a4a] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto border border-[#2a9d8f]/30"
        onClick={() => trackAdClick("FamilyBridge")}
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6">
          {/* Logo */}
          <img
            src={familyBridgeLogo}
            alt="FamilyBridge App"
            className="h-20 md:h-24 w-auto rounded-lg bg-white/95 p-2 shadow-lg flex-shrink-0"
          />

          {/* Content + Features + CTA */}
          <div className="flex-1 flex flex-col gap-3 text-center md:text-left min-w-0">
            {/* Title + description */}
            <div>
              <h3 className="text-white font-serif text-xl md:text-2xl font-bold mb-1">
                Family<span className="text-[#2a9d8f]">Bridge</span>
              </h3>
              <p className="text-white/90 text-sm md:text-base">
                AI support for families across the recovery journey.
              </p>
            </div>

            {/* Features row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5">
              {[
                { Icon: Brain, label: "Recovery Intelligence" },
                { Icon: TrendingUp, label: "Recovery Tracking" },
                { Icon: Pill, label: "Medication Compliance" },
                { Icon: MapPin, label: "Meeting Check-Ins" },
                { Icon: DollarSign, label: "Financial Coordination" },
                { Icon: MessageSquare, label: "AI Chat" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
                  <span className="text-white/80 text-[11px]">{label}</span>
                </div>
              ))}
            </div>

            {/* Badge */}
            <div className="flex justify-center md:justify-start">
              <AppStoreBadge height={40} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar version
  return (
    <div
      className="block bg-gradient-to-br from-[#0d4a4a] to-[#0f5f5f] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#2a9d8f]/30"
      onClick={() => trackAdClick("FamilyBridge")}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={familyBridgeLogo}
            alt="FamilyBridge App"
            className="h-20 w-auto rounded-lg bg-white/95 p-2 shadow-lg"
          />
        </div>

        {/* Headline */}
        <h3 className="text-white text-center font-serif text-lg font-bold mb-1">
          Family<span className="text-[#2a9d8f]">Bridge</span>
        </h3>
        <p className="text-[#2a9d8f] text-center font-serif text-sm font-semibold mb-3">
          AI-Powered Recovery Platform
        </p>

        {/* Description */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-4">
          Clinical insights for families and providers across the recovery journey.
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 justify-center">
            <Brain className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">FIIS Recovery Intelligence</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">Recovery Trajectory Tracking</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Pill className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">Medication Compliance</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MapPin className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">GPS Meeting Check-Ins</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <DollarSign className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">Financial Coordination</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
            <span className="text-white/80 text-xs">AI Chat Moderation</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <AppStoreBadge height={36} />
        </div>

        {/* Tagline */}
        <p className="text-white/50 text-center text-[10px] mt-3">
          Patent-Pending FIIS Technology
        </p>
      </div>
    </div>
  );
};

export default FamilyBridgeBanner;
