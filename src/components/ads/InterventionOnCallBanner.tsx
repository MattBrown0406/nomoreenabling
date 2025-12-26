import interventionOnCallLogo from "@/assets/intervention-on-call-logo.jpg";
import { Calendar, Clock, Video, Users } from "lucide-react";

const InterventionOnCallBanner = () => {
  return (
    <a
      href="https://interventiononcall.com"
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gradient-to-br from-[#f5f0e8] to-[#e8e0d4] rounded-xl shadow-card overflow-hidden hover:shadow-lg transition-all duration-300 border border-[#00a19a]/20"
    >
      <div className="p-4">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src={interventionOnCallLogo}
            alt="Intervention On Call"
            className="h-20 w-auto rounded shadow-md"
          />
        </div>

        {/* Headline */}
        <h3 className="text-[#1a365d] text-center font-serif text-lg font-bold mb-1">
          Helping You Help
        </h3>
        <p className="text-[#00a19a] text-center font-serif text-xl font-bold mb-3">
          Your Loved One
        </p>

        {/* Description */}
        <p className="text-[#4a4a4a] text-center text-sm leading-relaxed mb-4">
          On-demand appointments with trained interventionists. Real-time solutions when you need them most.
        </p>

        {/* Key Feature */}
        <div className="bg-[#00a19a]/10 border border-[#00a19a]/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-[#1a365d] font-semibold text-sm mb-1">
            "A New Way to Do Interventions"
          </p>
          <p className="text-[#4a4a4a] text-xs">
            Hour-long sessions with immediate strategies
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <Video className="w-3.5 h-3.5 text-[#00a19a] flex-shrink-0" />
            <span>Remote Consults</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <Clock className="w-3.5 h-3.5 text-[#00a19a] flex-shrink-0" />
            <span>Crisis Support</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <Calendar className="w-3.5 h-3.5 text-[#00a19a] flex-shrink-0" />
            <span>ASAP Booking</span>
          </div>
          <div className="flex items-center gap-2 text-[#4a4a4a] text-xs">
            <Users className="w-3.5 h-3.5 text-[#00a19a] flex-shrink-0" />
            <span>Sober Coaching</span>
          </div>
        </div>

        {/* Free Zoom Meetings */}
        <div className="bg-[#1a365d] rounded-lg p-2.5 mb-3 text-center">
          <p className="text-white text-xs font-medium">
            FREE Family Support Zoom Meetings
          </p>
          <p className="text-white/70 text-[10px]">5 nights a week</p>
        </div>

        {/* CTA Button */}
        <div className="bg-[#00a19a] hover:bg-[#008f89] text-white font-bold text-center py-2.5 px-4 rounded-lg transition-colors text-sm">
          Make an Appointment
        </div>

        {/* Trust note */}
        <p className="text-[#6b6b6b] text-center text-[10px] mt-3">
          Appointments within 48 hours • Confidential
        </p>
      </div>
    </a>
  );
};

export default InterventionOnCallBanner;
