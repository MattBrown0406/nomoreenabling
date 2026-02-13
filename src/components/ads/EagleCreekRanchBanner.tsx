import { ExternalLink, Mountain, Phone, Shield } from "lucide-react";
import eagleCreekLogo from "@/assets/eagle-creek-ranch-logo.png";
import { trackAdClick } from "@/lib/trackAdClick";

const EagleCreekRanchBanner = () => {
  return (
    <a
      href="https://idahorecoverycenter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[hsl(38,35%,25%)] to-[hsl(38,40%,15%)] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]"
      onClick={() => trackAdClick("Eagle Creek Ranch")}
    >
      {/* Mountain Header Image */}
      <div className="relative h-24 bg-gradient-to-b from-[hsl(200,30%,70%)] to-[hsl(38,35%,25%)] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Mountain className="w-32 h-32 text-white/20" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[hsl(38,35%,25%)] to-transparent" />
      </div>

      <div className="p-5 -mt-8 relative">
        {/* Logo - centered and prominent */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-full max-w-[200px] mb-2">
            <img
              src={eagleCreekLogo}
              alt="Eagle Creek Ranch Recovery"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Tagline */}
        <p className="text-white/90 font-serif text-xl font-bold mb-2 leading-tight">
          Rise Above Your Past
        </p>
        <p className="text-amber-200/70 text-sm italic mb-3">
          Idaho Rehab Center for Men
        </p>

        {/* Description */}
        <p className="text-white/70 text-sm mb-4 leading-relaxed">
          First-class behavioral health treatment in Nampa, Idaho. Clinically driven programs with top-notch professionals.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
            <Shield className="w-3 h-3" />
            <span>Insurance Accepted</span>
          </div>
          <div className="flex items-center gap-1 text-white/60 text-xs bg-white/5 px-2 py-1 rounded-full">
            <Mountain className="w-3 h-3" />
            <span>Detox & Residential</span>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center gap-2 text-amber-300 text-sm font-semibold mb-3">
          <Phone className="w-4 h-4" />
          <span>(208) 907-3738</span>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center gap-2 bg-amber-600/30 hover:bg-amber-600/40 text-amber-200 py-2.5 rounded-lg transition-colors font-semibold text-sm">
          <span>Start Your Recovery</span>
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
};

export default EagleCreekRanchBanner;
