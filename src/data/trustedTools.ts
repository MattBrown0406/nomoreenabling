// Trusted Tools page data — books, programs, and home tools Matt actually
// recommends. Editorial picks come first; affiliate programs second, never the
// reverse. No treatment provider can pay for placement anywhere on this page.

/**
 * Amazon Associates tracking ID (e.g. "nomoreenabling-20").
 * Leave empty until the Associates account is approved — links still work,
 * they just don't earn. Fill it in and every Amazon link on the page monetizes.
 */
export const AMAZON_ASSOCIATES_TAG = "";

export type TrustedToolKind = "affiliate" | "free" | "ours";

export interface TrustedTool {
  id: string;
  kind: TrustedToolKind;
  title: string;
  by: string;
  description: string;
  /** "Why Matt recommends it" / usage note. Optional for free resources. */
  why?: string;
  whyLabel?: string;
  /** For affiliate Amazon items: the search query used to build the link. */
  amazonQuery?: string;
  /** For free/external resources: the direct URL. */
  href?: string;
  ctaLabel: string;
}

export const amazonUrl = (query: string): string => {
  const base = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  return AMAZON_ASSOCIATES_TAG ? `${base}&tag=${AMAZON_ASSOCIATES_TAG}` : base;
};

export const toolHref = (tool: TrustedTool): string =>
  tool.amazonQuery ? amazonUrl(tool.amazonQuery) : tool.href ?? "#";

export const foundationBooks: TrustedTool[] = [
  {
    id: "beyond-addiction",
    kind: "affiliate",
    title: "Beyond Addiction: How Science and Kindness Help People Change",
    by: "Jeffrey Foote, Carrie Wilkens, Nicole Kosanke",
    description:
      "The book for families who've been told \"detach or you're enabling\" and felt something was missing. Evidence-based, compassionate, practical.",
    why: "it teaches the difference between helping the person and helping the addiction — the exact line this whole site exists to draw.",
    amazonQuery: "Beyond Addiction How Science and Kindness Help People Change",
    ctaLabel: "View on Amazon",
  },
  {
    id: "get-your-loved-one-sober",
    kind: "affiliate",
    title: "Get Your Loved One Sober: Alternatives to Nagging, Pleading, and Threatening",
    by: "Robert J. Meyers & Brenda L. Wolfe",
    description:
      "The family-friendly guide to CRAFT — the most researched approach for families of people who refuse treatment.",
    why: "CRAFT gives you actual moves for the moment your loved one says \"I don't have a problem.\"",
    amazonQuery: "Get Your Loved One Sober Meyers Wolfe",
    ctaLabel: "View on Amazon",
  },
  {
    id: "codependent-no-more",
    kind: "affiliate",
    title: "Codependent No More",
    by: "Melody Beattie",
    description:
      "The classic on losing yourself in someone else's addiction — and finding your way back. Millions of family members recognized themselves in this book first.",
    why: "when a family member asks \"why can't I stop rescuing?\", this is the book that answers.",
    amazonQuery: "Codependent No More Melody Beattie",
    ctaLabel: "View on Amazon",
  },
  {
    id: "boundaries-cloud-townsend",
    kind: "affiliate",
    title: "Boundaries: When to Say Yes, How to Say No",
    by: "Henry Cloud & John Townsend",
    description:
      "Not addiction-specific — which is exactly why it works. The mechanics of holding a line with someone you love, from a faith-informed perspective.",
    why: "most families don't have an addiction problem with boundaries — they have a boundaries problem that addiction exposed.",
    amazonQuery: "Boundaries When to Say Yes How to Say No Cloud Townsend",
    ctaLabel: "View on Amazon",
  },
  {
    id: "language-of-letting-go",
    kind: "affiliate",
    title: "The Language of Letting Go",
    by: "Melody Beattie",
    description:
      "Daily meditations for family members. One page a day, for the mornings when the fear is loudest.",
    why: "recovery for the family is a daily practice, not a decision — this makes it daily.",
    amazonQuery: "The Language of Letting Go Melody Beattie",
    ctaLabel: "View on Amazon",
  },
];

export const jayBooks: TrustedTool[] = [
  {
    id: "love-first",
    kind: "affiliate",
    title: "Love First: A Family's Guide to Intervention",
    by: "Jeff Jay & Debra Jay",
    description:
      "The definitive guide to planning a loving, structured family intervention — letters, teams, bottom lines, and what happens after yes or no.",
    why: "this is the book behind the approach Matt practices. If an intervention is on the table in your family, read this before anything else.",
    amazonQuery: "Love First A Family's Guide to Intervention Jeff Jay Debra Jay",
    ctaLabel: "View on Amazon",
  },
  {
    id: "it-takes-a-family",
    kind: "affiliate",
    title: "It Takes a Family: Creating Lasting Sobriety, Togetherness, and Happiness",
    by: "Debra Jay",
    description:
      "Structured Family Recovery® — a clear system for the year after treatment, when most families quietly fall apart or drift back to old patterns.",
    why: "getting them to treatment is halftime, not the win. This book gives the family a job for the next twelve months.",
    amazonQuery: "It Takes a Family Debra Jay",
    ctaLabel: "View on Amazon",
  },
  {
    id: "no-more-letting-go",
    kind: "affiliate",
    title: "No More Letting Go: The Spirituality of Taking Action Against Alcoholism and Drug Addiction",
    by: "Debra Jay",
    description:
      "A direct challenge to \"detach and wait for rock bottom\" — the case for loving action, made with both evidence and heart.",
    why: "if you've been told there's nothing you can do until they're ready, this book is the antidote — and the argument this site is built on.",
    amazonQuery: "No More Letting Go Debra Jay",
    ctaLabel: "View on Amazon",
  },
  {
    id: "aging-and-addiction",
    kind: "affiliate",
    title: "Aging and Addiction: Helping Older Adults Overcome Alcohol or Medication Dependence",
    by: "Carol Colleran & Debra Jay",
    description:
      "The overlooked crisis — parents and grandparents dependent on alcohol or prescriptions, and the adult children who don't know how to raise it.",
    why: "for every family worried about a son, there's one worried about a father who \"just has his wine.\" This is their book.",
    amazonQuery: "Aging and Addiction Colleran Jay",
    ctaLabel: "View on Amazon",
  },
  {
    id: "navigating-grace",
    kind: "affiliate",
    title: "Navigating Grace: A Solo Voyage of Survival and Redemption",
    by: "Jeff Jay",
    description:
      "Jeff Jay's memoir — a solo Atlantic sailing voyage woven with his own recovery story. Not a how-to; a why-to.",
    why: "for the family member who needs hope more than instructions right now.",
    amazonQuery: "Navigating Grace Jeff Jay",
    ctaLabel: "View on Amazon",
  },
];

export const freeSupport: TrustedTool[] = [
  {
    id: "al-anon",
    kind: "free",
    title: "Al-Anon Family Groups",
    by: "Al-Anon / Alateen",
    description:
      "Peer support meetings — in person and online — for anyone affected by someone else's drinking. Alateen serves teens.",
    href: "https://al-anon.org/al-anon-meetings/find-an-al-anon-meeting/",
    ctaLabel: "Find a meeting",
  },
  {
    id: "smart-family",
    kind: "free",
    title: "SMART Recovery Family & Friends",
    by: "SMART Recovery",
    description:
      "Science-based, CRAFT-informed support meetings for family members — a good fit if the 12-step language never landed for you.",
    href: "https://smartrecovery.org/family",
    ctaLabel: "Find a meeting",
  },
  {
    id: "findtreatment",
    kind: "free",
    title: "FindTreatment.gov",
    by: "SAMHSA",
    description:
      "The federal treatment locator. No ads, no placement fees, no call-center middlemen — search by location, payment type, and level of care.",
    href: "https://findtreatment.gov/",
    ctaLabel: "Search treatment",
  },
];

export const homeTools: TrustedTool[] = [
  {
    id: "medication-lock-box",
    kind: "affiliate",
    title: "Medication lock box",
    by: "Various manufacturers",
    description:
      "A locking box for prescriptions in the home. Securing medications is a boundary you can hold without saying a word.",
    whyLabel: "When it matters",
    why: "opioid or benzo prescriptions in the house, visits home from treatment, younger siblings around.",
    amazonQuery: "medication lock box",
    ctaLabel: "View options on Amazon",
  },
  {
    id: "drug-test-kits",
    kind: "affiliate",
    title: "At-home multi-panel drug test kits",
    by: "Various manufacturers",
    description:
      "Used well, testing isn't surveillance — it's the trust-but-verify structure some recovery agreements are built on.",
    whyLabel: "Use with care",
    why: "testing works when it's part of an agreement your loved one signed onto, not an ambush. Our articles cover how.",
    amazonQuery: "multi panel drug test kit home",
    ctaLabel: "View options on Amazon",
  },
  {
    id: "naloxone",
    kind: "free",
    title: "Naloxone (Narcan)",
    by: "Next Distro / your local pharmacy",
    description:
      "If opioids are involved, naloxone in the home is not optional. Available over the counter, and free by mail in many states.",
    whyLabel: "No commission here, ever",
    why: "we will not earn money on overdose reversal. Get it free if you can, buy it today if you can't.",
    href: "https://nextdistro.org/",
    ctaLabel: "Find free naloxone",
  },
];
