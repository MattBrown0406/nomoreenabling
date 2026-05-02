export interface InternalMoneyPageLink {
  articleSlug: string;
  href: string;
  label: string;
  description: string;
}

export const internalMoneyPageLinks: InternalMoneyPageLink[] = [
  {
    articleSlug: "what-to-do-when-someone-refuses-rehab",
    href: "/what-to-do-when-they-refuse-treatment",
    label: "What to do when they refuse treatment",
    description: "Use the treatment-refusal page if your family needs a plan that does not depend on another argument.",
  },
  {
    articleSlug: "loved-one-refuses-addiction-treatment",
    href: "/what-to-do-when-they-refuse-treatment",
    label: "Build a treatment-refusal plan",
    description: "If refusal keeps repeating, this page helps you sort coaching, boundaries, and intervention next steps.",
  },
  {
    articleSlug: "when-is-an-addiction-intervention-necessary",
    href: "/intervention-help",
    label: "See when intervention help fits",
    description: "For families who may need a structured intervention plan before the next confrontation.",
  },
  {
    articleSlug: "addiction-treatment-refusal-family-plan",
    href: "/intervention-help",
    label: "Get intervention help for the family plan",
    description: "When treatment refusal is entrenched, the family usually needs more than a loose conversation.",
  },
  {
    articleSlug: "family-intervention-for-alcoholism",
    href: "/alcohol-intervention-help",
    label: "Alcohol intervention help",
    description: "Use the alcohol-specific page when drinking is minimized, denied, or affecting the household.",
  },
  {
    articleSlug: "how-to-stop-enabling-an-alcoholic",
    href: "/alcohol-intervention-help",
    label: "When alcohol enabling needs outside help",
    description: "If alcohol treatment is refused or the family keeps adapting, start with this dedicated next-step page.",
  },
  {
    articleSlug: "living-with-an-alcoholic-spouse",
    href: "/alcohol-intervention-help",
    label: "Plan around alcohol, safety, and treatment refusal",
    description: "A focused page for families dealing with alcohol minimization and repeated broken promises.",
  },
  {
    articleSlug: "high-functioning-alcoholic-family-signs",
    href: "/alcohol-intervention-help",
    label: "Alcohol intervention help for high-functioning drinking",
    description: "If functioning is being used to dismiss real impact, this page gives the family a clearer next step.",
  },
  {
    articleSlug: "how-to-stop-enabling-adult-child-addiction",
    href: "/addiction-intervention-for-adult-child",
    label: "Adult child intervention guidance",
    description: "For parents who need help with treatment refusal, money, housing, and family alignment.",
  },
  {
    articleSlug: "should-i-let-addicted-adult-child-live-at-home",
    href: "/addiction-intervention-for-adult-child",
    label: "When housing and intervention overlap",
    description: "Use this page if housing has become part of treatment refusal or repeated rescue.",
  },
  {
    articleSlug: "financial-boundaries-with-addicted-adult-child",
    href: "/addiction-intervention-for-adult-child",
    label: "Adult child addiction next steps",
    description: "A parent-focused path for money, housing, treatment refusal, and possible intervention planning.",
  },
  {
    articleSlug: "when-adult-child-refuses-addiction-treatment",
    href: "/addiction-intervention-for-adult-child",
    label: "Adult child refuses treatment",
    description: "If your adult child keeps refusing help, this page helps parents decide what to do next.",
  },
  {
    articleSlug: "should-i-give-money-to-someone-with-addiction",
    href: "/family-addiction-coaching",
    label: "Get coaching around money and boundaries",
    description: "If money decisions keep pulling the family into crisis, coaching may help you create a steadier plan.",
  },
  {
    articleSlug: "paying-rent-for-addicted-adult-child",
    href: "/addiction-intervention-for-adult-child",
    label: "Parent guidance for rent, housing, and treatment",
    description: "When rent keeps becoming rescue, use the parent-focused page to sort the next step.",
  },
  {
    articleSlug: "what-to-do-when-addicted-loved-one-breaks-boundaries",
    href: "/family-addiction-coaching",
    label: "Family addiction coaching for boundaries",
    description: "If the boundary keeps breaking, coaching can help turn insight into follow-through.",
  },
  {
    articleSlug: "how-to-set-boundaries-with-addicted-loved-one",
    href: "/family-addiction-coaching",
    label: "Coaching for boundaries that hold",
    description: "Use this page if your family needs help holding limits under guilt, fear, or pushback.",
  },
  {
    articleSlug: "maintaining-boundaries-addicted-loved-one",
    href: "/family-addiction-coaching",
    label: "Get help maintaining boundaries",
    description: "When the issue is follow-through, family coaching may be the next right step.",
  },
  {
    articleSlug: "codependency-signs-loved-one-addiction",
    href: "/family-addiction-coaching",
    label: "Family addiction coaching for codependency",
    description: "If codependency is driving the family pattern, this page helps route the next step.",
  },
  {
    articleSlug: "helping-starts-hurting-enabling-addiction",
    href: "/family-addiction-consultation",
    label: "Ask for a family addiction consultation",
    description: "If helping has started hurting and you are unsure what to do next, use this consultation path.",
  },
  {
    articleSlug: "enabling-vs-helping-stop-enabling-support-real-recovery",
    href: "/family-addiction-consultation",
    label: "Decide the next right step",
    description: "A private consultation can help sort support, boundaries, coaching, or intervention fit.",
  },
  {
    articleSlug: "loved-one-using-drugs-in-my-house",
    href: "/intervention-help",
    label: "When home safety may need intervention help",
    description: "If substance use in the home is escalating, use this page to consider the next structured move.",
  },
  {
    articleSlug: "addicted-loved-one-stealing-from-you",
    href: "/intervention-help",
    label: "Intervention help for escalating consequences",
    description: "Theft, safety, and treatment refusal often require a more structured family plan.",
  },
  {
    articleSlug: "addiction-threats-violence-home",
    href: "/intervention-help",
    label: "Intervention help after safety is addressed",
    description: "If immediate danger is handled and the family needs a plan, start with this intervention page.",
  },
];

export const getInternalMoneyPageLink = (articleSlug: string | undefined) =>
  internalMoneyPageLinks.find((link) => link.articleSlug === articleSlug);
