export const MIRROR_EMBED_ORIGIN = "https://nomoreenabling.com";

/**
 * TikTok video URL for the Enabling Mirror explainer.
 * Paste the full video link (https://www.tiktok.com/@mattbrowninterventionist/video/...)
 * and the page will render the real TikTok embed instead of the profile card.
 */
export const MIRROR_TIKTOK_VIDEO_URL: string = "";
export const MIRROR_TIKTOK_PROFILE_URL = "https://www.tiktok.com/@mattbrowninterventionist";

export const getMirrorEmbedCode = (lang: "en" | "es") =>
  `<iframe src="${MIRROR_EMBED_ORIGIN}/the-mirror/embed?lang=${lang}" width="100%" height="820" style="border:0;max-width:720px;border-radius:18px" loading="lazy" title="The Enabling Mirror — interactive addiction family cycle tool"></iframe>
<p style="font-size:13px">Interactive tool: <a href="${MIRROR_EMBED_ORIGIN}/the-mirror" target="_blank" rel="noopener">The Enabling Mirror</a> by No More Enabling</p>`;
