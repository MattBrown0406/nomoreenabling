export type OwnedAdVariant = "family-bridge" | "freedom-interventions" | "party-wreckers";

export type SponsorPlacementKey =
  | "article_top_leaderboard"
  | "article_bottom_leaderboard"
  | "article_sidebar"
  | "evergreen_sidebar"
  | "homepage_sidebar"
  | "topic_hub_sponsor"
  | "newsletter_sponsor";

export type SponsorPlacementStatus = "house" | "available" | "reserved";

export interface SponsorPlacement {
  key: SponsorPlacementKey;
  name: string;
  surface: string;
  size: string;
  monthlyRate: number;
  quarterlyRate: number;
  status: SponsorPlacementStatus;
  houseVariant: OwnedAdVariant;
  buyerFit: string;
  description: string;
  reporting: string;
}

export interface SponsorshipPackage {
  name: string;
  price: string;
  fit: string;
  includes: string[];
}

export const sponsorPlacements: SponsorPlacement[] = [
  {
    key: "article_top_leaderboard",
    name: "Article Top Leaderboard",
    surface: "Article pages",
    size: "728x90 responsive",
    monthlyRate: 500,
    quarterlyRate: 1200,
    status: "house",
    houseVariant: "freedom-interventions",
    buyerFit: "High-trust recovery brands that want visibility before the reader enters the article body.",
    description: "Appears near the top of long-form article pages after the primary article CTA.",
    reporting: "Clicks, page path, and article context.",
  },
  {
    key: "article_bottom_leaderboard",
    name: "Article Bottom Leaderboard",
    surface: "Article pages",
    size: "728x90 responsive",
    monthlyRate: 350,
    quarterlyRate: 850,
    status: "house",
    houseVariant: "family-bridge",
    buyerFit: "Aftercare, family support, recovery technology, and next-step resources.",
    description: "Appears after the article and next-step module when readers are ready to act.",
    reporting: "Clicks, page path, and article context.",
  },
  {
    key: "article_sidebar",
    name: "Article Sidebar Sponsor",
    surface: "Article sidebar",
    size: "300x250 responsive",
    monthlyRate: 450,
    quarterlyRate: 1050,
    status: "house",
    houseVariant: "party-wreckers",
    buyerFit: "Podcast, education, treatment navigation, and intervention-adjacent resources.",
    description: "Persistent desktop sidebar position beside article content.",
    reporting: "Clicks and page path.",
  },
  {
    key: "evergreen_sidebar",
    name: "Evergreen Guide Sidebar",
    surface: "Guides and tools",
    size: "300x250 responsive",
    monthlyRate: 400,
    quarterlyRate: 950,
    status: "house",
    houseVariant: "family-bridge",
    buyerFit: "Resources that help families move from insight into structure.",
    description: "Appears on high-intent evergreen guide pages and self-assessment pages.",
    reporting: "Clicks and page path.",
  },
  {
    key: "homepage_sidebar",
    name: "Homepage Sidebar Sponsor",
    surface: "Homepage sidebar",
    size: "300x250 responsive",
    monthlyRate: 400,
    quarterlyRate: 950,
    status: "house",
    houseVariant: "freedom-interventions",
    buyerFit: "Brands that want broad exposure across first-time readers.",
    description: "Appears in the primary site sidebar with popular posts and guided entry points.",
    reporting: "Clicks and page path.",
  },
  {
    key: "topic_hub_sponsor",
    name: "Topic Hub Sponsor",
    surface: "Topic hubs",
    size: "Native placement",
    monthlyRate: 750,
    quarterlyRate: 1800,
    status: "available",
    houseVariant: "freedom-interventions",
    buyerFit: "Category-specific providers aligned with one reader intent: intervention, aftercare, boundaries, or family support.",
    description: "A native sponsorship block attached to a specific SEO topic hub.",
    reporting: "Hub-level clicks and source context.",
  },
  {
    key: "newsletter_sponsor",
    name: "Newsletter Sponsor",
    surface: "Email newsletter",
    size: "Native mention",
    monthlyRate: 600,
    quarterlyRate: 1500,
    status: "available",
    houseVariant: "party-wreckers",
    buyerFit: "Ethical sponsors with a useful family-facing offer or educational resource.",
    description: "One reviewed sponsor mention in family-support email content.",
    reporting: "Click tracking by campaign link.",
  },
];

export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    name: "Starter Sponsor",
    price: "$750/month",
    fit: "A first test for a vetted recovery brand.",
    includes: ["One sidebar placement", "One newsletter mention", "Monthly click report"],
  },
  {
    name: "Topic Authority",
    price: "$1,500/month",
    fit: "Best when a sponsor wants category-level association with a topic hub.",
    includes: ["One topic hub sponsor slot", "One article sidebar placement", "One contextual article placement", "Monthly performance recap"],
  },
  {
    name: "Network Bundle",
    price: "Custom",
    fit: "Best for brands that fit No More Enabling, Freedom Interventions, Family Bridge, and Party Wreckers.",
    includes: ["Site placement", "Podcast or email integration", "Custom landing page option", "Direct review before launch"],
  },
];

export const sponsorStandards = {
  accepted: [
    "Treatment centers and detox providers with transparent admissions practices",
    "Sober living, aftercare, and outpatient programs",
    "Family education, coaching, and support resources",
    "Recovery technology and accountability tools",
    "Books, courses, and events that help families make better decisions",
  ],
  notAccepted: [
    "Lead-generation offers that obscure who receives the inquiry",
    "Fear-based creative or exaggerated recovery promises",
    "Unreviewed affiliate offers for broad mental health services",
    "Pay-for-recommendation placements inside editorial guidance",
    "Any sponsor that conflicts with family safety or treatment ethics",
  ],
  reviewQuestions: [
    "Does this sponsor help families make a better decision?",
    "Can a reader understand who they are contacting?",
    "Would this placement still feel ethical beside a crisis-oriented article?",
    "Is the claim clear, modest, and supportable?",
  ],
};

export const getSponsorPlacement = (key: SponsorPlacementKey) =>
  sponsorPlacements.find((placement) => placement.key === key);

export const getHouseVariantForPlacement = (key: SponsorPlacementKey) =>
  getSponsorPlacement(key)?.houseVariant ?? "family-bridge";

export const formatSponsorRate = (rate: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rate);
