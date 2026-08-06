import { Turnstile } from "@marsidev/react-turnstile";

interface NewsletterTurnstileProps {
  onTokenChange: (token: string | null) => void;
  resetKey?: number;
  className?: string;
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

/**
 * Cloudflare Turnstile for public newsletter capture forms.
 *
 * The token is useful only after newsletter-signup validates it with
 * Cloudflare's Siteverify API. It is single-use and expires after five minutes.
 */
const NewsletterTurnstile = ({
  onTokenChange,
  resetKey = 0,
  className = "flex min-h-0 justify-center",
}: NewsletterTurnstileProps) => {
  if (!siteKey) {
    return (
      <p className="text-xs text-destructive" role="alert">
        Security verification is temporarily unavailable. Please try again later.
      </p>
    );
  }

  return (
    <Turnstile
      key={resetKey}
      siteKey={siteKey}
      className={className}
      onSuccess={(token) => onTokenChange(token)}
      onExpire={() => onTokenChange(null)}
      onError={() => onTokenChange(null)}
      onTimeout={() => onTokenChange(null)}
      options={{
        action: "newsletter_signup",
        appearance: "interaction-only",
        execution: "render",
        refreshExpired: "auto",
        refreshTimeout: "auto",
        responseField: false,
        size: "flexible",
        theme: "auto",
      }}
    />
  );
};

export default NewsletterTurnstile;
