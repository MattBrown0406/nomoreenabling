export type TurnstileValidation = {
  success?: boolean;
  hostname?: string;
  action?: string;
  'error-codes'?: string[];
};

export const DEFAULT_TURNSTILE_HOSTNAMES = 'nomoreenabling.com,www.nomoreenabling.com';

export const acceptsTurnstileResult = (
  result: TurnstileValidation,
  configuredHostnames = DEFAULT_TURNSTILE_HOSTNAMES,
): boolean => {
  const allowed = new Set(configuredHostnames.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean));
  // This backend serves production too: local tokens must never authorize it.
  allowed.delete('localhost');
  allowed.delete('127.0.0.1');
  return result.success === true
    && result.action === 'newsletter_signup'
    && typeof result.hostname === 'string'
    && allowed.has(result.hostname.toLowerCase());
};