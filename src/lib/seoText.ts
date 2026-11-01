const BRAND_SUFFIX = " | No More Enabling";
const ELLIPSIS = "...";

// Cut at the last whole word that fits, so we never emit fragments like
// "Definition for Addi...". Trailing separators/punctuation are dropped
// before the ellipsis is appended.
function truncateAtWord(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  const budget = Math.max(1, maxLength - ELLIPSIS.length);
  let cut = value.slice(0, budget + 1);
  const lastSpace = cut.lastIndexOf(" ");
  // Only fall back to a hard cut when there is no usable word boundary.
  cut = lastSpace > budget * 0.5 ? cut.slice(0, lastSpace) : cut.slice(0, budget);
  cut = cut.replace(/[\s|—–\-:,;&]+$/u, "").trimEnd();
  return `${cut}${ELLIPSIS}`;
}

export function fitSeoTitle(value: string, maxLength = 60): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  if (cleaned.endsWith(BRAND_SUFFIX)) {
    const base = cleaned.slice(0, -BRAND_SUFFIX.length).trim();
    const maxBase = maxLength - BRAND_SUFFIX.length;
    return `${truncateAtWord(base, maxBase)}${BRAND_SUFFIX}`;
  }
  return truncateAtWord(cleaned, maxLength);
}

export function fitSeoDescription(value: string, maxLength = 160): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return truncateAtWord(cleaned, maxLength);
}
