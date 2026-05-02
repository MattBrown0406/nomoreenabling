export interface LeadMagnet {
  slug: string;
  hubSlugs: string[];
  categoryMatches: string[];
  title: string;
  shortTitle: string;
  description: string;
  formTitle: string;
  bullets: string[];
  guideSections: { heading: string; items: string[] }[];
  thankYouTitle: string;
  thankYouDescription: string;
}

export const leadMagnets: LeadMagnet[] = [
  {
    slug: "financial-boundaries-script",
    hubSlugs: ["financial-enabling"],
    categoryMatches: ["Financial Enabling"],
    title: "Financial Boundaries Script",
    shortTitle: "Money Boundary Script",
    description: "A short script for saying no to cash, rent, bills, and last-minute rescue requests without getting pulled into another negotiation.",
    formTitle: "Unlock the financial boundaries script",
    bullets: ["cash request response", "rent and bill language", "what to offer instead"],
    guideSections: [
      {
        heading: "Use this before the next money request",
        items: [
          "I love you, and I am not giving cash or covering bills while treatment and recovery support are being refused.",
          "I am willing to help with a recovery step directly, not with anything that keeps the same pattern going.",
          "I will not debate this in a crisis. If you want help finding treatment or support, I will stay in that conversation.",
        ],
      },
      {
        heading: "A steadier alternative to offer",
        items: [
          "Pay a verified treatment, assessment, transportation, or recovery-support cost directly when appropriate.",
          "Ask for a written plan before discussing future financial help.",
          "Bring the question to Family Squares before deciding under pressure.",
        ],
      },
    ],
    thankYouTitle: "Your money-boundary script is unlocked",
    thankYouDescription: "Use the script below, then bring the situation to Family Squares if you need help holding the line.",
  },
  {
    slug: "parent-boundary-checklist",
    hubSlugs: ["adult-child-addiction"],
    categoryMatches: ["Adult Child Addiction"],
    title: "Parent Boundary Checklist",
    shortTitle: "Parent Checklist",
    description: "A decision checklist for parents who are trying to stay loving without becoming the housing, money, and rescue system for active addiction.",
    formTitle: "Unlock the parent boundary checklist",
    bullets: ["housing decisions", "money requests", "treatment refusal next steps"],
    guideSections: [
      {
        heading: "Before you say yes",
        items: [
          "Is this request connected to a recovery action, or is it removing the consequence of active addiction?",
          "Would I make the same decision if I were calm, rested, and not being pressured?",
          "Have the adults in the family agreed on the boundary before responding?",
        ],
      },
      {
        heading: "Parent boundary language",
        items: [
          "I love you too much to keep participating in a pattern that is hurting you.",
          "I am available for treatment planning, recovery support, and honest conversation.",
          "I am not available for money, housing, or crisis rescue without a recovery plan.",
        ],
      },
    ],
    thankYouTitle: "Your parent checklist is unlocked",
    thankYouDescription: "Use this before the next pressured yes, then bring the decision to Family Squares for support.",
  },
  {
    slug: "family-rules-after-rehab",
    hubSlugs: ["after-treatment"],
    categoryMatches: ["After Treatment", "Recovery"],
    title: "Family Rules After Rehab Worksheet",
    shortTitle: "After-Rehab Rules",
    description: "A simple worksheet for turning post-treatment hope into clear house rules, communication expectations, and relapse-response agreements.",
    formTitle: "Unlock the after-rehab family rules worksheet",
    bullets: ["house rules", "aftercare expectations", "relapse response"],
    guideSections: [
      {
        heading: "Rules that need to be named",
        items: [
          "What recovery commitments are expected each week?",
          "What does the family do if a commitment is missed?",
          "What privacy, transportation, money, and home-safety rules need to be clear before conflict starts?",
        ],
      },
      {
        heading: "Relapse-response agreement",
        items: [
          "Relapse will be addressed quickly and directly, not hidden or minimized.",
          "The family will not punish honesty, but it will respond to unsafe behavior.",
          "The next step after relapse is support, assessment, treatment contact, or a higher level of care.",
        ],
      },
    ],
    thankYouTitle: "Your after-rehab worksheet is unlocked",
    thankYouDescription: "Use this to write rules before the family is upset. Family Squares can help you pressure-test the plan.",
  },
  {
    slug: "treatment-refusal-plan",
    hubSlugs: ["treatment-resistance", "intervention"],
    categoryMatches: ["Treatment Resistance", "Intervention"],
    title: "Treatment Refusal Planning Guide",
    shortTitle: "Refusal Plan",
    description: "A planning guide for families who keep hearing no, not yet, I can handle it, or you are overreacting.",
    formTitle: "Unlock the treatment refusal planning guide",
    bullets: ["conversation prep", "family alignment", "intervention indicators"],
    guideSections: [
      {
        heading: "Before the next conversation",
        items: [
          "Write down the specific harms the family has observed.",
          "Agree on what support stops if treatment continues to be refused.",
          "Decide who should speak, who should stay quiet, and what the actual ask is.",
        ],
      },
      {
        heading: "When to raise the level of help",
        items: [
          "The same conversation has failed several times.",
          "Risk, consequences, or family division are escalating.",
          "The loved one briefly agrees, then backs out before any real assessment or treatment step.",
        ],
      },
    ],
    thankYouTitle: "Your refusal plan is unlocked",
    thankYouDescription: "Use this before another improvised talk. If refusal is entrenched, Family Squares or Freedom Interventions may be the next right level.",
  },
  {
    slug: "partner-safety-boundaries",
    hubSlugs: ["spouse-partner-addiction"],
    categoryMatches: ["Spouse or Partner Addiction", "Relationships"],
    title: "Partner Safety and Boundaries Checklist",
    shortTitle: "Partner Safety Checklist",
    description: "A checklist for spouses and partners trying to protect safety, children, money, and reality while addiction is active in the relationship.",
    formTitle: "Unlock the partner safety checklist",
    bullets: ["home safety", "children and money", "stay-or-leave clarity"],
    guideSections: [
      {
        heading: "Check safety before strategy",
        items: [
          "Is anyone being threatened, intimidated, driven while impaired, or exposed to unsafe substance use?",
          "Do children have a sober, safe adult and a clear place to go if things escalate?",
          "Is money being used in a way that keeps the addiction protected?",
        ],
      },
      {
        heading: "A boundary that protects reality",
        items: [
          "I will not pretend this is not affecting our home.",
          "I will talk about treatment and safety, but I will not argue with denial.",
          "If the home becomes unsafe, I will act on the safety plan instead of negotiating in the moment.",
        ],
      },
    ],
    thankYouTitle: "Your partner safety checklist is unlocked",
    thankYouDescription: "Use this as a calm reality check. Family Squares can help you sort support, safety, and next steps.",
  },
];

export const getLeadMagnetBySlug = (slug: string) =>
  leadMagnets.find((magnet) => magnet.slug === slug);

export const getLeadMagnetForHub = (hubSlug: string | undefined) =>
  leadMagnets.find((magnet) => hubSlug && magnet.hubSlugs.includes(hubSlug));

export const getLeadMagnetForArticle = (article: { categories: string[] } | null | undefined, hubSlugs: string[] = []) =>
  leadMagnets.find((magnet) => magnet.hubSlugs.some((hubSlug) => hubSlugs.includes(hubSlug))) ??
  leadMagnets.find((magnet) => article?.categories.some((category) => magnet.categoryMatches.includes(category))) ??
  null;
