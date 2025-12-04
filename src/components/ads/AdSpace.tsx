import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
  size: "banner" | "sidebar" | "inline" | "leaderboard";
  className?: string;
}

const sizeClasses = {
  banner: "h-24 md:h-32 w-full",
  sidebar: "h-64 w-full",
  inline: "h-20 w-full my-6",
  leaderboard: "h-20 md:h-24 w-full max-w-4xl mx-auto",
};

// Ad format mapping for responsive ads
const adFormats = {
  banner: "horizontal",
  sidebar: "vertical",
  inline: "horizontal",
  leaderboard: "horizontal",
};

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const AdSpace = ({ size, className }: AdSpaceProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const isAdLoaded = useRef(false);

  useEffect(() => {
    if (adRef.current && !isAdLoaded.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isAdLoaded.current = true;
      } catch (error) {
        console.error("AdSense error:", error);
      }
    }
  }, []);

  return (
    <div
      className={cn(
        "ad-space flex items-center justify-center overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", height: "100%" }}
        data-ad-client="ca-pub-4711693967004790"
        data-ad-format={adFormats[size]}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSpace;
