import soberHelplineLogo from "@/assets/sober-helpline-logo.png";
import { Phone, Users, BookOpen, Video } from "lucide-react";

const SoberHelplineBanner = () => {
  return (
    <a
      href="https://soberhelpline.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#f5e6d3] to-[#e8d4bc] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#c9a96e]/30"
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={soberHelplineLogo}
            alt="Sober Helpline"
            className="h-20 w-auto drop-shadow-md"
          />
        </div>

        {/* Headline */}
        <h3 className="text-[#2d5a3d] text-center font-serif text-lg font-bold mb-1">
          Empowering Your
        </h3>
        <p className="text-[#c9a96e] text-center font-serif text-xl font-bold mb-3">
          Recovery Journey
        </p>

        {/* Description */}
        <p className="text-[#4a4a4a] text-center text-sm leading-relaxed mb-4">
          Find ethical, proven treatment and recovery resources for your family.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-[#2d5a3d]" />
            <p className="text-[#4a4a4a] text-[10px] leading-tight">Family Discussion Forum</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <BookOpen className="w-4 h-4 mx-auto mb-1 text-[#2d5a3d]" />
            <p className="text-[#4a4a4a] text-[10px] leading-tight">Free Assessments</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <Video className="w-4 h-4 mx-auto mb-1 text-[#2d5a3d]" />
            <p className="text-[#4a4a4a] text-[10px] leading-tight">60+ Videos & Guides</p>
          </div>
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <Phone className="w-4 h-4 mx-auto mb-1 text-[#2d5a3d]" />
            <p className="text-[#4a4a4a] text-[10px] leading-tight">Expert Zoom Calls</p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <span className="w-1.5 h-1.5 bg-[#2d5a3d] rounded-full flex-shrink-0"></span>
            <span>Vetted Treatment Providers</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <span className="w-1.5 h-1.5 bg-[#2d5a3d] rounded-full flex-shrink-0"></span>
            <span>DSM-5 Based Assessments</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <span className="w-1.5 h-1.5 bg-[#2d5a3d] rounded-full flex-shrink-0"></span>
            <span>Guided Meditations</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#2d5a3d] hover:bg-[#234a31] text-white font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm mb-3">
          Explore Free Resources
        </div>

        {/* Phone */}
        <div className="flex items-center justify-center gap-2 text-[#4a4a4a] text-xs">
          <Phone className="w-3 h-3" />
          <span>(541) 241-5886</span>
        </div>

        {/* Trust note */}
        <p className="text-[#6b6b6b] text-center text-[10px] mt-2">
          No commissions • Ethical providers only
        </p>
      </div>
    </a>
  );
};

export default SoberHelplineBanner;
