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
  // To rotate UNSUBSCRIBE_SECRET, move the old value to
  // UNSUBSCRIBE_SECRET_PREVIOUS for at least 30 days.
  const secrets = [
    Deno.env.get("UNSUBSCRIBE_SECRET"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    Deno.env.get("UNSUBSCRIBE_SECRET_PREVIOUS"),
  ]
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
 * Case-insensitive email equality for a PostgREST query. Older rows may be
 * mixed-case. PostgREST turns "*" into a wildcard in (i)like values and it
 * can't be escaped, so an address containing "*" falls back to exact match.
 */
// deno-lint-ignore no-explicit-any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const matchEmail = (query: any, email: string) => {
  const normalized = email.trim().toLowerCase();
  return normalized.includes("*")
    ? query.eq("email", normalized)
    : query.ilike("email", escapeLikePattern(normalized));
};

/**
 * True when the address has opted out: it has subscriber rows and none of
 * them is active (a confirmed re-signup creates/reactivates an active row).
 */
export const isEmailSuppressed = async (supabase: AnySupabaseClient, email: string): Promise<boolean> => {
  const { data, error } = await matchEmail(supabase.from("subscribers").select("is_active"), email);
  if (error) throw error;
  const rows = (data ?? []) as Array<{ is_active: boolean }>;
  return rows.length > 0 && !rows.some((row) => row.is_active);
};

/**
 * Mark an address as opted out (all case variants) and record a suppression
 * row when it has no subscriber row yet (e.g. a CRM contact), so later
 * campaigns skip it.
 */
export const deactivateSubscriber = async (supabase: AnySupabaseClient, email: string) => {
  const normalized = email.trim().toLowerCase();
  const deactivate = async () => {
    const { data, error } = await matchEmail(supabase.from("subscribers").update({ is_active: false }), normalized)
      .select("id");
    if (error) throw error;
    return (data ?? []).length;
  };
  if ((await deactivate()) > 0) return;
  const { error: insertError } = await supabase
    .from("subscribers")
    .insert({ email: normalized, is_active: false });
  if (!insertError) return;
  // 23505: a row was created concurrently (e.g. a finalize); deactivate it.
  if (insertError.code !== "23505") throw insertError;
  await deactivate();
};

/**
 * Lowercased emails that have opted out: every subscriber row for the
 * address is inactive (an old inactive mixed-case row next to an active
 * lowercase one doesn't count).
 */
export const fetchSuppressedEmails = async (supabase: AnySupabaseClient): Promise<Set<string>> => {
  const hasActive = new Map<string, boolean>();
  for (let from = 0; from <= 200000; from += 1000) {
    const { data, error } = await supabase
      .from("subscribers")
      .select("email, is_active")
      .order("id", { ascending: true })
      .range(from, from + 999);
    if (error) throw error;
    for (const row of data ?? []) {
      const key = String(row.email).trim().toLowerCase();
      hasActive.set(key, Boolean(hasActive.get(key)) || Boolean(row.is_active));
    }
    if (!data || data.length < 1000) break;
  }
  return new Set([...hasActive].filter(([, active]) => !active).map(([email]) => email));
};
