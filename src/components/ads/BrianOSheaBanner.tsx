import brianOSheaLogo from "@/assets/brian-oshea-logo.jpg";

const BrianOSheaBanner = () => {
  return (
    <a
      href="https://brianosheaconsulting.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#1a3a52] to-[#2d5a7b] rounded-xl overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300 border border-[#3d7a9b]/30"
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-3">
          <img
            src={brianOSheaLogo}
            alt="Brian O'Shea Coaching and Consulting"
            className="w-20 h-20 object-cover rounded-full border-2 border-white/20"
          />
        </div>

        {/* Title */}
        <h3 className="text-white text-center font-serif text-lg font-bold mb-2">
          Brian O'Shea
        </h3>
        <p className="text-[#d4a574] text-center text-sm font-medium mb-3">
          Coaching & Consulting
        </p>

        {/* Tagline */}
        <p className="text-white/90 text-center text-sm leading-relaxed mb-4">
          Guiding You Toward Healing, Clarity, and Purpose
        </p>

        {/* Services */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#d4a574] rounded-full flex-shrink-0"></span>
            <span>Recovery Support & Relapse Prevention</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#d4a574] rounded-full flex-shrink-0"></span>
            <span>Intervention Services</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#d4a574] rounded-full flex-shrink-0"></span>
            <span>Family Systems Healing</span>
          </div>
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <span className="w-1.5 h-1.5 bg-[#d4a574] rounded-full flex-shrink-0"></span>
            <span>Life & Career Coaching</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-[#d4a574] hover:bg-[#c49564] text-[#1a3a52] font-semibold text-center py-2.5 px-4 rounded-lg transition-colors text-sm">
          Get Started Today
        </div>

        {/* Experience note */}
        <p className="text-white/60 text-center text-xs mt-3">
          30+ Years of Compassionate Guidance
        </p>
      </div>
    </a>
  );
};

export default BrianOSheaBanner;
