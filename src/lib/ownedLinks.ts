type OwnedBrand = "sober-helpline" | "freedom-interventions" | "family-bridge" | "party-wreckers";

const ownedDomains: Record<OwnedBrand, string[]> = {
  "sober-helpline": ["soberhelpline.com", "www.soberhelpline.com"],
  "freedom-interventions": ["freedominterventions.com", "www.freedominterventions.com"],
  "family-bridge": ["familybridgeapp.com", "www.familybridgeapp.com"],
  "party-wreckers": ["partywreckers.com", "www.partywreckers.com"],
};

const brandCampaigns: Record<OwnedBrand, string> = {
  "sober-helpline": "family_squares",
  "freedom-interventions": "intervention_consult",
  "family-bridge": "family_bridge_app",
  "party-wreckers": "party_wreckers_podcast",
};

interface OwnedUtmOptions {
  medium?: string;
  campaign?: string;
  content?: string;
}

export const getOwnedBrandForUrl = (href: string): OwnedBrand | null => {
  try {
    const url = new URL(href);
    const host = url.hostname.toLowerCase();
    return (Object.entries(ownedDomains).find(([, domains]) => domains.includes(host))?.[0] as OwnedBrand | undefined) ?? null;
  } catch {
    return null;
  }
};

export const withOwnedUtm = (href: string, options: OwnedUtmOptions = {}) => {
  const brand = getOwnedBrandForUrl(href);
  if (!brand) return href;

  const url = new URL(href);
  url.searchParams.set("utm_source", "nomoreenabling");
  url.searchParams.set("utm_medium", options.medium ?? "owned_cta");
  url.searchParams.set("utm_campaign", options.campaign ?? brandCampaigns[brand]);

  if (options.content) {
    url.searchParams.set("utm_content", options.content);
  }

  return url.toString();
};
