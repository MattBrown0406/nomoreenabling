import { useState } from "react";

const useNewsletterTurnstile = () => {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const resetTurnstile = () => {
    setTurnstileToken(null);
    setTurnstileResetKey((current) => current + 1);
  };

  return {
    turnstileToken,
    setTurnstileToken,
    turnstileResetKey,
    resetTurnstile,
  };
};

export default useNewsletterTurnstile;
