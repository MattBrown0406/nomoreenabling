import { ExternalLink, Heart, MessageCircle } from "lucide-react";

const BetterHelpBanner = () => {
  return (
    <a
      href="https://www.betterhelp.com/partywreckers"
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-[hsl(153,30%,25%)] hover:bg-[hsl(153,30%,22%)] transition-all duration-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
        {/* Left side - Logo and tagline */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5">
            <div className="text-white font-bold text-lg md:text-xl tracking-tight flex items-center gap-1">
              <span className="text-white/90">⟨⟩</span>
              <span>betterhelp</span>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-white/20" />
          <p className="hidden sm:block text-white/90 text-sm md:text-base font-medium">
            You deserve to be happy.
          </p>
        </div>

        {/* Center - Features */}
        <div className="hidden lg:flex items-center gap-6 text-white/80 text-sm">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4" />
            <span>30,000+ Licensed Therapists</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            <span>100% Online Therapy</span>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="bg-[hsl(38,70%,55%)] text-[hsl(153,30%,15%)] px-3 py-1 rounded-full text-xs md:text-sm font-bold">
              10% OFF First Month
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-white font-semibold text-sm md:text-base bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors">
            <span className="hidden md:inline">Get Started</span>
            <ExternalLink className="w-4 h-4" />
          </div>
        </div>
      </div>
    </a>
  );
};

export default BetterHelpBanner;
