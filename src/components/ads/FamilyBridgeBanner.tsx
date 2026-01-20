import familyBridgeLogo from "@/assets/family-bridge-logo.png";
import { Brain, Shield, MessageSquare } from "lucide-react";

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
            className="h-20 md:h-24 w-auto rounded-lg bg-white/95 p-2 shadow-lg"
          />
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-serif text-xl md:text-2xl font-bold mb-1">
              Family<span className="text-[#2a9d8f]">Bridge</span>
            </h3>
            <p className="text-white/90 text-sm md:text-base mb-2">
              A safe space for families affected by addiction to communicate, set boundaries, and rebuild trust.
            </p>
            <p className="text-white/60 text-xs">
              AI-powered insights help families catch warning signs early
            </p>
          </div>

          {/* Features */}
          <div className="flex md:flex-col gap-4 md:gap-2 text-center px-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#2a9d8f]" />
              <span className="text-white/80 text-xs">AI Pattern Detection</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#2a9d8f]" />
              <span className="text-white/80 text-xs">100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#2a9d8f]" />
              <span className="text-white/80 text-xs">Moderated Chat</span>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#2a9d8f] hover:bg-[#238b7e] text-white font-bold py-2.5 px-5 rounded-lg transition-colors text-sm whitespace-nowrap">
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
          Healing Starts with Connection
        </p>

        {/* Description */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-4">
          A safe space for families to communicate, set boundaries, and rebuild trust through recovery.
        </p>

        {/* Features */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 justify-center">
            <Brain className="w-3.5 h-3.5 text-[#2a9d8f]" />
            <span className="text-white/80 text-xs">AI Pattern Intelligence</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Shield className="w-3.5 h-3.5 text-[#2a9d8f]" />
            <span className="text-white/80 text-xs">100% Private & Secure</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <MessageSquare className="w-3.5 h-3.5 text-[#2a9d8f]" />
            <span className="text-white/80 text-xs">AI Chat Moderation</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#2a9d8f] hover:bg-[#238b7e] text-white font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm">
          Learn More
        </div>

        {/* Tagline */}
        <p className="text-white/50 text-center text-[10px] mt-3">
          AI-Powered Family Recovery Platform
        </p>
      </div>
    </a>
  );
};

export default FamilyBridgeBanner;
