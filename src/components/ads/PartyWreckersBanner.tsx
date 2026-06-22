import partyWreckersLogo from "@/assets/party-wreckers-logo.jpg";
import { Headphones, Star, Users } from "lucide-react";
import { trackAdClick } from "@/lib/trackAdClick";
import { withOwnedUtm } from "@/lib/ownedLinks";

interface PartyWreckersBannerProps {
  size?: "sidebar" | "leaderboard";
}

const PartyWreckersBanner = ({ size = "leaderboard" }: PartyWreckersBannerProps) => {
  const isLeaderboard = size === "leaderboard";
  const href = withOwnedUtm("https://partywreckers.com", {
    medium: "house_ad",
    campaign: "party_wreckers_podcast",
    content: `party_wreckers_${size}`,
  });

  if (isLeaderboard) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-gradient-to-r from-[#2d2a26] via-[#3d3832] to-[#2d2a26] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 max-w-4xl mx-auto border border-[#c4a77d]/30"
        onClick={() => trackAdClick("Party Wreckers")}
      >
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-5">
          {/* Logo */}
          <img
            src={partyWreckersLogo}
            alt="The Party Wreckers Podcast"
            className="h-20 md:h-24 w-auto rounded-lg shadow-lg"
          />
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white font-serif text-xl md:text-2xl font-bold mb-1">
              The Party Wreckers <span className="text-[#c4a77d]">Podcast</span>
            </h3>
            <p className="text-white/80 text-sm md:text-base mb-2">
              Real conversations about addiction, intervention, and recovery with host Matt Brown.
            </p>
            <p className="text-white/60 text-xs">
              Practical guidance for families navigating addiction
            </p>
          </div>

          {/* Stats */}
          <div className="flex md:flex-col gap-4 md:gap-2 text-center px-4">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#c4a77d]" />
              <span className="text-white font-bold">80+</span>
              <span className="text-white/60 text-xs">Episodes</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#c4a77d] fill-[#c4a77d]" />
              <span className="text-white font-bold">4.9</span>
              <span className="text-white/60 text-xs">Rating</span>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-[#c4a77d] hover:bg-[#b39669] text-[#2d2a26] font-bold py-2.5 px-5 rounded-lg transition-colors text-sm whitespace-nowrap">
            Listen Now
          </div>
        </div>
      </a>
    );
  }

  // Sidebar version
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#2d2a26] to-[#3d3832] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#c4a77d]/30"
      onClick={() => trackAdClick("Party Wreckers")}
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={partyWreckersLogo}
            alt="The Party Wreckers Podcast"
            className="h-20 w-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Headline */}
        <h3 className="text-white text-center font-serif text-lg font-bold mb-1">
          The Party Wreckers
        </h3>
        <p className="text-[#c4a77d] text-center font-serif text-base font-semibold mb-3">
          Podcast
        </p>

        {/* Description */}
        <p className="text-white/80 text-center text-sm leading-relaxed mb-4">
          Real conversations about addiction, intervention, and recovery.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Headphones className="w-3.5 h-3.5 text-[#c4a77d]" />
              <p className="text-white font-bold text-lg">80+</p>
            </div>
            <p className="text-white/60 text-xs">Episodes</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 text-[#c4a77d] fill-[#c4a77d]" />
              <p className="text-white font-bold text-lg">4.9</p>
            </div>
            <p className="text-white/60 text-xs">Rating</p>
          </div>
          <div className="w-px bg-white/20"></div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#c4a77d]" />
              <p className="text-white font-bold text-lg">1000s</p>
            </div>
            <p className="text-white/60 text-xs">Helped</p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#c4a77d] hover:bg-[#b39669] text-[#2d2a26] font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm">
          Listen Now
        </div>

        {/* Host note */}
        <p className="text-white/50 text-center text-[10px] mt-3">
          Hosted by Matt Brown
        </p>
      </div>
    </a>
  );
};

export default PartyWreckersBanner;
