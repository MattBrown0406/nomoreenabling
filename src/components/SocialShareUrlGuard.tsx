import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SHARE_PREVIEW_PATTERN = /^https:\/\/[^/]+\.supabase\.co\/functions\/v1\/sharepreview\/([^/?#]+)/i;
const SITE_URL = "https://nomoreenabling.com";

const canonicalArticleUrl = () => {
  if (typeof window === "undefined") return null;
  const match = window.location.pathname.match(/^\/articles\/([^/?#]+)/);
  return match ? `${SITE_URL}/articles/${decodeURIComponent(match[1])}` : null;
};

const isSharePreviewUrl = (value: string) => SHARE_PREVIEW_PATTERN.test(value);

const replaceSocialShareUrl = (rawUrl: string, canonicalUrl: string) => {
  if (isSharePreviewUrl(rawUrl)) return canonicalUrl;

  try {
    const parsed = new URL(rawUrl);
    for (const param of ["u", "url"]) {
      const value = parsed.searchParams.get(param);
      if (value && isSharePreviewUrl(value)) {
        parsed.searchParams.set(param, canonicalUrl);
      }
    }
    return parsed.toString();
  } catch {
    return rawUrl;
  }
};

const addLinkedInButton = () => {
  const canonicalUrl = canonicalArticleUrl();
  if (!canonicalUrl) return;

  const shareLabel = Array.from(document.querySelectorAll("span"))
    .find((element) => element.textContent?.trim() === "Share:");
  const toolbar = shareLabel?.parentElement;
  if (!toolbar || toolbar.querySelector("[data-nme-linkedin-share]")) return;

  const link = document.createElement("a");
  link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(canonicalUrl)}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.title = "Share on LinkedIn";
  link.setAttribute("aria-label", "Share on LinkedIn");
  link.setAttribute("data-nme-linkedin-share", "true");
  link.className = "p-2 rounded-full bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90 transition-colors inline-flex items-center justify-center text-xs font-bold leading-none";
  link.textContent = "in";

  const emailButton = Array.from(toolbar.children)
    .find((element) => element.getAttribute("aria-label") === "Share via Email");

  toolbar.insertBefore(link, emailButton ?? null);
};

const SocialShareUrlGuard = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalOpen = window.open;
    window.open = function patchedOpen(url?: string | URL, target?: string, features?: string) {
      const canonicalUrl = canonicalArticleUrl();
      const nextUrl = canonicalUrl && typeof url === "string" ? replaceSocialShareUrl(url, canonicalUrl) : url;
      return originalOpen.call(window, nextUrl, target, features);
    } as typeof window.open;

    return () => {
      window.open = originalOpen;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !location.pathname.startsWith("/articles/")) return;

    addLinkedInButton();
    const observer = new MutationObserver(addLinkedInButton);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
};

export default SocialShareUrlGuard;
