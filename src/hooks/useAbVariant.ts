import { useEffect, useState } from "react";

/**
 * Sticky 50/50 A/B variant selector.
 * Persists the chosen variant in localStorage per `key` so the reader sees the
 * same variant across sessions.
 */
export function useAbVariant<T extends string>(key: string, variants: readonly T[]): T {
  const storageKey = `nme_ab_${key}`;

  const pick = () => variants[Math.floor(Math.random() * variants.length)];

  const [variant, setVariant] = useState<T>(() => {
    if (typeof window === "undefined") return variants[0];
    try {
      const stored = window.localStorage.getItem(storageKey) as T | null;
      if (stored && variants.includes(stored)) return stored;
      const chosen = pick();
      window.localStorage.setItem(storageKey, chosen);
      return chosen;
    } catch {
      return variants[0];
    }
  });

  useEffect(() => {
    // If the stored variant no longer matches the current variant list, reroll.
    try {
      const stored = window.localStorage.getItem(storageKey) as T | null;
      if (!stored || !variants.includes(stored)) {
        const chosen = pick();
        window.localStorage.setItem(storageKey, chosen);
        setVariant(chosen);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  return variant;
}

export const SUBSCRIBED_COOKIE = "nme_sub";

export function hasSubscribedCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some((c) => c.trim().startsWith(`${SUBSCRIBED_COOKIE}=1`));
}

export function markSubscribed(): void {
  if (typeof document === "undefined") return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${SUBSCRIBED_COOKIE}=1; path=/; max-age=${oneYear}; SameSite=Lax`;
}
