import { useCallback, useRef, useState } from "react";
import { awaitMinDwell, dwellMs } from "@/lib/formDwell";

/**
 * Client half of the course-enroll anti-abuse guards.
 *
 * Renders an invisible honeypot input (bots autofill it; humans never see it)
 * and measures how long the form has been on screen. Spread the returned
 * fields into the enroll request body — the server silently drops submissions
 * that trip either guard.
 */
const MIN_DWELL_MS = 3000;

export function useEnrollGuard() {
  const openedAtRef = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");

  // Async: a real person who autofills and submits within the dwell window
  // (common when the form appears in a modal) used to get a silent fake
  // success from the server. Wait out the remainder instead of dropping them.
  const guardFields = useCallback(async () => {
    await awaitMinDwell(openedAtRef.current, MIN_DWELL_MS);
    return {
      website: honeypot,
      form_ms: dwellMs(openedAtRef.current, MIN_DWELL_MS),
    };
  }, [honeypot]);

  const honeypotProps = {
    type: "text" as const,
    name: "website",
    value: honeypot,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setHoneypot(e.target.value),
    tabIndex: -1,
    autoComplete: "off" as const,
    "aria-hidden": true as const,
    style: {
      position: "absolute",
      left: "-9999px",
      width: "1px",
      height: "1px",
      opacity: 0,
      pointerEvents: "none",
    } as React.CSSProperties,
  };

  return { honeypotProps, guardFields };
}
