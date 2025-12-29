import { ExternalLink, Award, Heart } from "lucide-react";
import jeffHatchLogo from "@/assets/jeff-hatch-coaching-logo.png";

const JeffHatchCoachingBanner = () => {
  return (
    <a
      href="https://hatch-coaching.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[hsl(220,40%,20%)] to-[hsl(220,50%,12%)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
    >
      <div className="p-5">
        {/* Header with Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-full bg-white/10 p-1 flex items-center justify-center">
            <img
              src={jeffHatchLogo}
              alt="Jeff Hatch Coaching"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">
              Jeff Hatch Coaching
            </h3>
            <p className="text-cyan-300/80 text-xs font-medium">
              High Performance Coach
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-white/90 font-serif text-xl font-bold mb-3 leading-tight">
          Transform Challenges into Triumphs
        </p>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 leading-relaxed">
          Personal transformation coaching focused on resilience and mental wellness. Former NFL player turned recovery advocate.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
            <Award className="w-3 h-3" />
            <span>Certified Coach</span>
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
            <Heart className="w-3 h-3" />
            <span>Recovery Focused</span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 py-2.5 rounded-lg transition-colors font-semibold text-sm">
          <span>Learn More</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};

export default JeffHatchCoachingBanner;
