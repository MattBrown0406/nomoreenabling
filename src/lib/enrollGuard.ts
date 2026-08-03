import { useCallback, useRef, useState } from "react";

/**
 * Client half of the course-enroll anti-abuse guards.
 *
 * Renders an invisible honeypot input (bots autofill it; humans never see it)
 * and measures how long the form has been on screen. Spread the returned
 * fields into the enroll request body — the server silently drops submissions
 * that trip either guard.
 */
export function useEnrollGuard() {
  const openedAtRef = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const guardFields = useCallback(
    () => ({
      website: honeypot,
      form_ms: Date.now() - openedAtRef.current,
    }),
    [honeypot],
  );

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
