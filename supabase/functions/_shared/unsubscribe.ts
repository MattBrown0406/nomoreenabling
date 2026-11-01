// Signed unsubscribe links for email sent through Resend (newsletter, weekly
// digest, course drips). Mailchimp handles its own confirmation emails; these
// are the messages that previously had no way to opt out.
//
// Token = HMAC-SHA256(secret, "unsubscribe:" + lowercased email). The secret
// is UNSUBSCRIBE_SECRET if set, otherwise the service-role key (server-only).

const SITE_URL = "https://nomoreenabling.com";

// Links already in inboxes must keep working (CAN-SPAM: at least 30 days), so
// verification accepts a token signed with any configured secret: adding
// UNSUBSCRIBE_SECRET later doesn't invalidate links signed with the
// service-role key, and vice versa.
const signingSecrets = (): string[] => {
  const secrets = [Deno.env.get("UNSUBSCRIBE_SECRET"), Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")]
    .filter((value): value is string => Boolean(value));
  if (secrets.length === 0) throw new Error("No unsubscribe signing secret is configured");
  return secrets;
};

const toHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");

const base64UrlEncode = (value: string) =>
  btoa(String.fromCharCode(...new TextEncoder().encode(value)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

export const base64UrlDecode = (value: string): string | null => {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
};

export const unsubscribeToken = async (email: string, secret: string = signingSecrets()[0]): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`unsubscribe:${email.trim().toLowerCase()}`),
  );
  return toHex(signature);
};

const constantTimeEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
};

export const verifyUnsubscribeToken = async (email: string, token: string): Promise<boolean> => {
  let valid = false;
  for (const secret of signingSecrets()) {
    if (constantTimeEqual(await unsubscribeToken(email, secret), token)) valid = true;
  }
  return valid;
};

export interface UnsubscribeLinks {
  /** Human-facing page on the site that confirms the unsubscribe. */
  pageUrl: string;
  /** Headers for RFC 8058 one-click unsubscribe (Gmail/Yahoo bulk-sender rules). */
  headers: Record<string, string>;
  /** Footer HTML to append to the email body. */
  footerHtml: string;
}

export const unsubscribeLinks = async (email: string): Promise<UnsubscribeLinks> => {
  const normalized = email.trim().toLowerCase();
  const query = `e=${base64UrlEncode(normalized)}&t=${await unsubscribeToken(normalized)}`;
  const pageUrl = `${SITE_URL}/unsubscribe?${query}`;
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const oneClickUrl = supabaseUrl ? `${supabaseUrl}/functions/v1/unsubscribe?${query}` : pageUrl;
  return {
    pageUrl,
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    footerHtml: `<p style="font-size:12px;color:#888;text-align:center;margin:24px 0 0;">You're receiving this because you signed up at nomoreenabling.com. <a href="${pageUrl}" style="color:#888;">Unsubscribe</a></p>`,
  };
};

/** Insert the footer before </body> when present, otherwise append it. */
export const withUnsubscribeFooter = (html: string, footerHtml: string): string =>
  /<\/body>/i.test(html) ? html.replace(/<\/body>/i, () => `${footerHtml}</body>`) : `${html}${footerHtml}`;

// Accepts any supabase-js client version used across the functions (their
// generic parameters don't unify).
// deno-lint-ignore no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = any;

const escapeLikePattern = (value: string) => value.replace(/[\\%_]/g, (char) => `\\${char}`);

/**
 * Mark an address as opted out. Matches case-insensitively (older rows may
 * have mixed-case emails) and records a suppression row when the address has
 * no subscriber row yet (e.g. a CRM contact), so later campaigns skip it.
 */
export const deactivateSubscriber = async (supabase: AnySupabaseClient, email: string) => {
  const normalized = email.trim().toLowerCase();
  const { data: updated, error } = await supabase
    .from("subscribers")
    .update({ is_active: false })
    .ilike("email", escapeLikePattern(normalized))
    .select("id");
  if (error) throw error;
  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from("subscribers")
      .insert({ email: normalized, is_active: false });
    // 23505: a row appeared concurrently; it will be deactivated on retry.
    if (insertError && insertError.code !== "23505") throw insertError;
  }
};

/** Lowercased emails that have opted out (subscribers.is_active = false). */
export const fetchSuppressedEmails = async (supabase: AnySupabaseClient): Promise<Set<string>> => {
  const suppressed = new Set<string>();
  for (let from = 0; from <= 100000; from += 1000) {
    const { data, error } = await supabase
      .from("subscribers")
      .select("email")
      .eq("is_active", false)
      .order("id", { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    for (const row of data ?? []) suppressed.add(String(row.email).trim().toLowerCase());
    if (!data || data.length < 1000) break;
  }
  return suppressed;
};
