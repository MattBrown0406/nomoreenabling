// Signed unsubscribe links for email sent through Resend (newsletter, weekly
// digest, course drips). Mailchimp handles its own confirmation emails; these
// are the messages that previously had no way to opt out.
//
// Token = HMAC-SHA256(secret, "unsubscribe:" + lowercased email). The secret
// is UNSUBSCRIBE_SECRET if set, otherwise the service-role key (server-only).

const SITE_URL = "https://nomoreenabling.com";

const unsubscribeSecret = (): string => {
  const secret = Deno.env.get("UNSUBSCRIBE_SECRET") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!secret) throw new Error("No unsubscribe signing secret is configured");
  return secret;
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

export const unsubscribeToken = async (email: string): Promise<string> => {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(unsubscribeSecret()),
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

export const verifyUnsubscribeToken = async (email: string, token: string): Promise<boolean> => {
  const expected = await unsubscribeToken(email);
  if (expected.length !== token.length) return false;
  let mismatch = 0;
  for (let index = 0; index < expected.length; index += 1) {
    mismatch |= expected.charCodeAt(index) ^ token.charCodeAt(index);
  }
  return mismatch === 0;
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
