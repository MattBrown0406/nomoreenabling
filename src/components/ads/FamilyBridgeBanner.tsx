import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import { Brain, Shield, MessageSquare, TrendingUp, Pill, MapPin, DollarSign, FileText } from "lucide-react";

interface FamilyBridgeBannerProps {
  size?: "sidebar" | "leaderboard";
}

const FamilyBridgeBanner = ({ size = "leaderboard" }: FamilyBridgeBannerProps) => {
  const isLeaderboard = size === "leaderboard";

  if (isLeaderboard) {
    return (
      <a
        href="https://familybridgeapp.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-[#0d4a4a] via-[#0f5f5f] to-[#0d4a4a] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto border border-[#2a9d8f]/30"
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-5">
          {/* Logo */}
          <img
            src={familyBridgeLogo}
            alt="FamilyBridge App"
            className="h-20 md:h-24 w-auto rounded-lg bg-white/95 p-2 shadow-lg flex-shrink-0"
          />
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-serif text-xl md:text-2xl font-bold mb-1">
              Family<span className="text-[#2a9d8f]">Bridge</span>
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-2">
              AI-powered clinical insights for families and providers across the recovery journey.
            </p>
            <p className="text-white/60 text-xs">
              Patent-pending FIIS technology surfaces recovery insights before crises occur
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-center px-2">
            <div className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">FIIS Recovery Intelligence</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">Recovery Tracking</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">Medication Compliance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">Meeting Check-Ins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">Financial Coordination</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#2a9d8f] flex-shrink-0" />
              <span className="text-white/80 text-[10px] whitespace-nowrap">AI Chat Moderation</span>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#2a9d8f] hover:bg-[#238b7e] text-white font-bold py-2.5 px-5 rounded-lg transition-colors text-sm whitespace-nowrap flex-shrink-0">
            Learn More
          </div>
        </div>
      </a>
    );
  }

  // Sidebar version
  return (
    <a
      href="https://familybridgeapp.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#0d4a4a] to-[#0f5f5f] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#2a9d8f]/30"
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
        <div className="bg-[#2a9d8f] hover:bg-[#238b7e] text-white font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm">
          Learn More
        </div>

        {/* Tagline */}
        <p className="text-white/50 text-center text-[10px] mt-3">
          Patent-Pending FIIS Technology
        </p>
      </div>
    </a>
  );
};

export default FamilyBridgeBanner;
