import freedomLogo from "@/assets/freedom-interventions-logo.jpg";
import { Phone } from "lucide-react";
import { trackAdClick } from "@/lib/trackAdClick";

interface FreedomInterventionsBannerProps {
  size?: "sidebar" | "leaderboard";
}

const FreedomInterventionsBanner = ({ size = "sidebar" }: FreedomInterventionsBannerProps) => {
  const isLeaderboard = size === "leaderboard";

  if (isLeaderboard) {
    return (
      <a
        href="https://freedominterventions.com"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackAdClick("Freedom Interventions")}
        className="block bg-gradient-to-r from-[#1a365d] via-[#2c5282] to-[#1a365d] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto border border-[#3182ce]/30"
      >
        <div className="flex flex-row items-center gap-6 p-4">
          <img
            src={freedomLogo}
            alt="Freedom Interventions"
            className="h-28 w-auto rounded-lg border-2 border-white/20"
          />
          <div className="flex-1">
            <h3 className="text-white font-serif text-xl font-bold mb-1">
              Guiding Families to <span className="text-[#63b3ed]">Hope & Recovery</span>
            </h3>
            <p className="text-white/80 text-sm">
              When addiction takes hold, intervention offers a lifeline. Our compassionate team helps families navigate the path to recovery.
            </p>
          </div>
          <div className="text-center px-4">
            <div className="bg-[#63b3ed] hover:bg-[#4299e1] text-[#1a365d] font-bold py-2 px-4 rounded-lg transition-colors text-sm whitespace-nowrap">
              Free Consultation
            </div>
            <p className="text-white/60 text-xs mt-2">1000+ Families Helped</p>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a
      href="https://freedominterventions.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#1a365d] to-[#2c5282] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#3182ce]/30"
      onClick={() => trackAdClick("Freedom Interventions")}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={freedomLogo}
            alt="Freedom Interventions"
            className="h-24 w-auto rounded-lg border-2 border-white/20 shadow-lg"
          />
        </div>

        {/* Headline */}
        <h3 className="text-white text-center font-serif text-lg font-bold mb-1">
          Guiding Families to
        </h3>
        <p className="text-[#63b3ed] text-center font-serif text-xl font-bold mb-3">
          Hope & Recovery
        </p>

        {/* Description */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-4">
          When addiction takes hold, intervention offers a lifeline. Our compassionate team helps families navigate the path to recovery.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <p className="text-[#63b3ed] font-bold text-xl">1000+</p>
            <p className="text-white/60 text-xs">Families Helped</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <p className="text-[#63b3ed] font-bold text-xl">20+</p>
            <p className="text-white/60 text-xs">Years of Service</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#63b3ed] rounded-full flex-shrink-0"></span>
            <span>Family Intervention</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#63b3ed] rounded-full flex-shrink-0"></span>
            <span>Crisis Support</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#63b3ed] rounded-full flex-shrink-0"></span>
            <span>Treatment Planning</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#63b3ed] rounded-full flex-shrink-0"></span>
            <span>Aftercare Guidance</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#63b3ed] hover:bg-[#4299e1] text-[#1a365d] font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm mb-3">
          Free Consultation
        </div>

        {/* Phone */}
        <div className="flex items-center justify-center gap-2 text-white/70 text-xs">
          <Phone className="w-3 h-3" />
          <span>(503) 836-2136</span>
        </div>

        {/* Confidential note */}
        <p className="text-white/50 text-center text-[10px] mt-2">
          All calls are confidential
        </p>
      </div>
    </a>
  );
};

export default FreedomInterventionsBanner;
