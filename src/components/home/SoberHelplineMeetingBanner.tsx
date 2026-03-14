import soberHelplineLogo from "@/assets/sober-helpline-logo-2.png";
import { trackAdClick } from "@/lib/trackAdClick";

const SoberHelplineMeetingBanner = () => {
  return (
    <a
      href="https://soberhelpline.com/monday-zoom-registration"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-r from-[#f5e6d3] to-[#e8d4bc] border-b border-[#c9a96e]/30 hover:from-[#f0ddc7] hover:to-[#e0c8ae] transition-all duration-300"
      onClick={() => trackAdClick("Sober Helpline Meeting Banner")}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4">
          <img
            src={soberHelplineLogo}
            alt="Sober Helpline"
            className="h-10 w-auto"
          />
          <div className="text-center">
            <span className="text-[#2d5a3d] font-serif font-bold text-base md:text-lg block">
              Free Weekly Family Support Zoom Calls
            </span>
            <span className="text-[#4a4a4a] text-xs md:text-sm">
              Every Monday — Join from anywhere. No cost, no commitment.
            </span>
          </div>
        </div>
      </div>
    </a>
  );
};

export default SoberHelplineMeetingBanner;
