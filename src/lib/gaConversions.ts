const GA_MEASUREMENT_ID = "G-Y3CM6RCELZ";

type GtagParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: GtagParams
    ) => void;
  }
}

export const trackGAConversion = (eventName: string, params: GtagParams = {}) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", eventName, {
    send_to: GA_MEASUREMENT_ID,
    ...params,
  });
};
