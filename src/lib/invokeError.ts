/**
 * supabase.functions.invoke() turns any non-2xx response into an `error`
 * with `data === null`, which hides the JSON body the Edge Function sent
 * (for example "Please use a permanent email address"). Read it back so
 * forms can show the real validation message instead of a generic one.
 */
export const readInvokeError = async (error: unknown): Promise<string | null> => {
  const context = (error as { context?: unknown } | null)?.context;
  if (!context || typeof (context as Response).json !== "function") return null;
  try {
    const body = (await (context as Response).clone().json()) as { error?: unknown };
    return typeof body?.error === "string" && body.error.trim() ? body.error : null;
  } catch {
    return null;
  }
};

const FRIENDLY_MESSAGES: Record<string, string> = {
  security_verification_failed: "Security verification failed. Please reload the page and try again.",
};

export const friendlyInvokeError = (code: string | null): string | null =>
  code ? FRIENDLY_MESSAGES[code] ?? code : null;
