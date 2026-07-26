import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ADSENSE_CLIENT, ADSENSE_SLOTS, type AdSenseSlotKey } from "@/config/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdSenseProps {
  slotKey: AdSenseSlotKey;
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  layout?: string;
  layoutKey?: string;
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Approximate min-height reserved to reduce CLS. */
  minHeight?: number;
}

const GoogleAdSense = ({
  slotKey,
  format = "auto",
  layout,
  layoutKey,
  responsive = true,
  className,
  style,
  minHeight = 120,
}: GoogleAdSenseProps) => {
  const slot = ADSENSE_SLOTS[slotKey];
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!slot || pushedRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushedRef.current = true;
    } catch {
      // AdSense may not be loaded yet (e.g. blocked). Silently ignore.
    }
  }, [slot]);

  // Nothing to render in production if the slot isn't configured yet.
  if (!slot) {
    if (import.meta.env.DEV) {
      return (
        <div
          className={cn(
            "border border-dashed border-muted-foreground/40 rounded-md text-xs text-muted-foreground flex items-center justify-center",
            className,
          )}
          style={{ minHeight, ...style }}
          aria-hidden="true"
        >
          AdSense slot &laquo;{slotKey}&raquo; not configured
        </div>
      );
    }
    return null;
  }

  return (
    <div className={cn("adsense-slot", className)} style={{ minHeight, ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-ad-layout-key={layoutKey}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
};

export default GoogleAdSense;
