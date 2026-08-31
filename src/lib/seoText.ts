const BRAND_SUFFIX = " | No More Enabling";

export function fitSeoTitle(value: string, maxLength = 60): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  if (cleaned.endsWith(BRAND_SUFFIX)) {
    const base = cleaned.slice(0, -BRAND_SUFFIX.length).trim();
    const maxBase = maxLength - BRAND_SUFFIX.length;
    return `${base.slice(0, Math.max(1, maxBase - 3)).trimEnd()}...${BRAND_SUFFIX}`;
  }
  return `${cleaned.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}

export function fitSeoDescription(value: string, maxLength = 160): string {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned.length <= maxLength ? cleaned : `${cleaned.slice(0, Math.max(1, maxLength - 3)).trimEnd()}...`;
}
