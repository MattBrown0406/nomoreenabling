import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const GA_MEASUREMENT_ID = "G-T8Q605D5GN";

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;

    // react-helmet applies the new <title> on an animation frame, after this
    // effect runs; wait for it so page_title isn't the previous page's.
    const timer = window.setTimeout(() => {
      window.gtag?.("event", "page_view", {
        send_to: GA_MEASUREMENT_ID,
        page_path: `${location.pathname}${location.search}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return null;
};

export default GoogleAnalytics;
