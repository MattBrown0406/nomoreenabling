import kairosLogo from "@/assets/kairos-intervention-logo.png";
import { Phone, Heart, Users, ClipboardCheck } from "lucide-react";

interface KairosInterventionBannerProps {
  size?: "sidebar" | "leaderboard";
}

const KairosInterventionBanner = ({ size = "sidebar" }: KairosInterventionBannerProps) => {
  const isLeaderboard = size === "leaderboard";

  if (isLeaderboard) {
    return (
      <a
        href="https://kairosintervention.com"
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto border border-[#e94560]/30"
      >
        <div className="flex flex-row items-center gap-6 p-4">
          <img
            src={kairosLogo}
            alt="Kairos Intervention"
            className="h-28 w-auto rounded-lg bg-white p-2"
          />
          <div className="flex-1">
            <h3 className="text-white font-serif text-xl font-bold mb-1">
              There Is Hope. <span className="text-[#e94560]">We'll Help You Find It.</span>
            </h3>
            <p className="text-white/80 text-sm mb-1">
              Professional addiction intervention services guided by compassion and proven methods.
            </p>
            <p className="text-white/60 text-xs italic">
              Kairos: The right moment for action—when change is not only possible, but necessary.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="bg-[#e94560] hover:bg-[#d63d56] text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap">
              Free Assessment
            </div>
            <p className="text-white/60 text-xs mt-2">(267) 664-9590</p>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href="https://kairosintervention.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#e94560]/30"
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={kairosLogo}
            alt="Kairos Intervention"
            className="h-20 w-auto rounded-lg bg-white p-2 shadow-lg"
          />
        </div>

        {/* Headline */}
        <h3 className="text-white text-center font-serif text-lg font-bold mb-1">
          There Is Hope.
        </h3>
        <p className="text-[#e94560] text-center font-serif text-base font-bold mb-2">
          We'll Help You Find It.
        </p>

        {/* Definition */}
        <div className="bg-white/5 rounded-lg p-2 mb-3">
          <p className="text-white/70 text-center text-xs italic">
            <span className="text-[#e94560] font-semibold">Kairos</span> · The right moment for action
          </p>
        </div>

        {/* Description */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-4">
          Professional addiction intervention guided by compassion and proven, personalized methods.
        </p>

        {/* Services List */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Heart className="w-3.5 h-3.5 text-[#e94560] flex-shrink-0" />
            <span>Compassionate Approach</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <ClipboardCheck className="w-3.5 h-3.5 text-[#e94560] flex-shrink-0" />
            <span>Evidence-Based Methods</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Users className="w-3.5 h-3.5 text-[#e94560] flex-shrink-0" />
            <span>Whole Family Healing</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#e94560] hover:bg-[#d63d56] text-white font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm mb-3">
          Start Clinical Assessment
        </div>

        {/* Phone */}
        <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
          <Phone className="w-3 h-3" />
          <span>(267) 664-9590</span>
        </div>

        {/* Confidential note */}
        <p className="text-white/50 text-center text-[10px] mt-2">
          Certified Interventionist • Confidential Consultations
        </p>
      </div>
    </a>
  );
};

export default KairosInterventionBanner;