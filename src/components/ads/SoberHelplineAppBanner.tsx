import { MessagesSquare, Video, PlayCircle, Headphones } from "lucide-react";
import soberHelplineLogo from "@/assets/sober-helpline-logo.svg";
import appStoreBadge from "@/assets/app-store-badge.svg";
import { trackAdClick } from "@/lib/trackAdClick";
import { trackGAConversion } from "@/lib/gaConversions";

const APP_STORE_URL = "https://apps.apple.com/us/app/sober-helpline/id6780034996";

// Sober Helpline lighthouse brand palette
const NAVY = "#16294a";
const NAVY_SOFT = "#1f3866";
const ACCENT = "#9fb6d9";

const features = [
  {
    Icon: MessagesSquare,
    label: "Practice hard conversations with AI",
    detail:
      "Rehearse the real conversation, not the easy one. Set your loved one’s emotional temperature, age, and gender so it plays out honestly.",
  },
  {
    Icon: Video,
    label: "Free weekly family support Zoom meetings",
    detail: "Join live family support meetings from anywhere, at no cost.",
  },
  {
    Icon: PlayCircle,
    label: "Watch past meetings you missed",
    detail: "Replay the full library of recorded family meetings on your schedule.",
  },
  {
    Icon: Headphones,
    label: "Live chat or video coaching",
    detail: "Book one-on-one sessions with an experienced interventionist.",
  },
];

interface SoberHelplineAppBannerProps {
  size?: "leaderboard" | "sidebar";
}

const SoberHelplineAppBanner = ({ size = "leaderboard" }: SoberHelplineAppBannerProps) => {
  const handleClick = () => {
    trackAdClick("SoberHelplineApp");
    trackGAConversion("owned_offer_click", {
      offer_slug: "sober-helpline-app",
      owned_brand: "sober-helpline",
      placement: `sober_helpline_app_${size}`,
    });
  };

  const badge = (height: number) => (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Download the Sober Helpline app on the App Store"
      className="inline-block hover:opacity-80 transition-opacity"
    >
      <img
        src={appStoreBadge}
        alt="Download Sober Helpline on the App Store"
        style={{ height: `${height}px`, width: "auto" }}
      />
    </a>
  );

  if (size === "sidebar") {
    return (
      <aside
        className="rounded-xl border p-4 shadow-card"
        style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`, borderColor: NAVY }}
      >
        <div className="flex justify-center">
          <img src={soberHelplineLogo} alt="Sober Helpline lighthouse logo" className="h-16 w-16 rounded-lg" />
        </div>
        <h3 className="mt-3 text-center font-serif text-lg font-bold" style={{ color: "#ffffff" }}>
          Sober Helpline App
        </h3>
        <p className="mt-1 text-center text-xs font-semibold" style={{ color: ACCENT }}>
          Family Addiction Support &amp; Education
        </p>
        <ul className="mt-4 space-y-2">
          {features.map(({ Icon, label }) => (
            <li key={label} className="flex items-start gap-2">
              <Icon className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" style={{ color: ACCENT }} />
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
                {label}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-center">{badge(38)}</div>
      </aside>
    );
  }

  return (
    <aside
      className="mx-auto max-w-5xl overflow-hidden rounded-2xl border shadow-card"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, ${NAVY_SOFT} 100%)`, borderColor: NAVY }}
    >
      <div className="flex flex-col gap-6 p-5 md:flex-row md:items-start md:p-7">
        <div className="flex flex-col items-center gap-4 md:w-56">
          <img
            src={soberHelplineLogo}
            alt="Sober Helpline lighthouse logo"
            className="h-20 w-20 rounded-xl md:h-24 md:w-24"
          />
          <div className="text-center">
            <p
              className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide"
              style={{ backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff" }}
            >
              Now on iPhone
            </p>
            <h2 className="mt-3 font-serif text-2xl font-bold leading-tight" style={{ color: "#ffffff" }}>
              Sober Helpline App
            </h2>
            <p className="mt-1 text-sm" style={{ color: ACCENT }}>
              Family Addiction Support &amp; Education
            </p>
          </div>
          <div className="hidden md:block">{badge(44)}</div>
        </div>

        <div className="flex-1">
          <p className="text-sm md:text-base" style={{ color: "rgba(255,255,255,0.85)" }}>
            Everything families ask for between articles: practice, live support, replays, and real coaching.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {features.map(({ Icon, label, detail }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="text-sm font-semibold" style={{ color: "#ffffff" }}>
                    {label}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {detail}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-center md:hidden">{badge(42)}</div>
        </div>
      </div>
    </aside>
  );
};

export default SoberHelplineAppBanner;
