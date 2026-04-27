export interface TopicHub {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  intro: string;
  bestFor: string;
  categories: string[];
  featuredSlugs: string[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export const topicHubs: TopicHub[] = [
  {
    slug: "enabling",
    title: "Enabling: when helping starts protecting the problem",
    shortTitle: "Enabling",
    description: "Understand the patterns that make families feel helpful while quietly protecting addiction from consequences.",
    intro: "This hub is for families who keep helping, rescuing, smoothing things over, or taking responsibility for what is not theirs to carry.",
    bestFor: "Best when you keep wondering whether your support is helping or making the pattern worse.",
    categories: ["Enabling", "Codependency", "Family Dynamics"],
    featuredSlugs: [
      "hidden-role-enabling-addiction",
      "helping-starts-hurting-enabling-addiction",
      "enabling-vs-helping-stop-enabling-support-real-recovery",
      "support-recovery-without-enabling",
    ],
    primaryCta: { label: "Take the helping vs enabling assessment", href: "/helping-or-enabling" },
    secondaryCta: { label: "Read the family support guide", href: "/family-support-guide" },
  },
  {
    slug: "boundaries",
    title: "Boundaries: clear limits that hold up under stress",
    shortTitle: "Boundaries",
    description: "Learn how to set clearer boundaries, follow through, and stop collapsing under guilt, fear, or emotional pressure.",
    intro: "This hub is for families who know they need stronger limits but keep getting pulled back into negotiation, rescuing, or second-guessing.",
    bestFor: "Best when your loved one keeps crossing lines and you are tired of repeating yourself.",
    categories: ["Boundaries", "Enabling", "Family Dynamics"],
    featuredSlugs: [
      "what-to-do-when-addicted-loved-one-breaks-boundaries",
      "how-to-set-boundaries-with-addicted-loved-one",
      "maintaining-boundaries-addicted-loved-one",
      "how-to-communicate-boundaries-addicted-loved-one",
    ],
    primaryCta: { label: "Start the free boundaries course", href: "/boundaries-course" },
    secondaryCta: { label: "Take the assessment first", href: "/helping-or-enabling" },
  },
  {
    slug: "codependency",
    title: "Codependency: when love gets fused with fear and over-responsibility",
    shortTitle: "Codependency",
    description: "See how codependency forms, why it feels like love, and how to recover your footing without abandoning your loved one.",
    intro: "This hub is for family members whose lives have become organized around monitoring, fixing, or emotionally managing someone else.",
    bestFor: "Best when exhaustion, guilt, hypervigilance, and over-functioning have become normal.",
    categories: ["Codependency", "Enabling", "Self-Worth", "Family Dynamics"],
    featuredSlugs: [
      "when-codependency-feels-like-love",
      "how-codependency-develops-addiction-families",
      "codependency-responsibility-trap-addiction-families",
      "breaking-codependency-cycle-addiction",
    ],
    primaryCta: { label: "Read the family support guide", href: "/family-support-guide" },
    secondaryCta: { label: "Get practical guidance by email", href: "/#newsletter" },
  },
  {
    slug: "family-dynamics",
    title: "Family dynamics: the system around addiction",
    shortTitle: "Family Dynamics",
    description: "Understand how addiction reshapes roles, communication, emotional balance, and decision-making across the whole family.",
    intro: "This hub is for families who can feel the whole house bending around addiction but do not yet have language for the pattern.",
    bestFor: "Best when everything feels confusing, emotionally loaded, and harder to explain than it should be.",
    categories: ["Family Dynamics", "Recovery", "Mental Health"],
    featuredSlugs: [
      "family-trauma-after-addiction",
      "addiction-changes-family-communication",
      "8-stages-family-addiction-journey",
      "what-happens-in-addiction-treatment-families",
    ],
    primaryCta: { label: "Start here", href: "/start-here" },
    secondaryCta: { label: "Read all family dynamics articles", href: "/category/family-dynamics" },
  },
  {
    slug: "intervention",
    title: "Intervention guidance: when waiting is no longer a plan",
    shortTitle: "Intervention",
    description: "Understand when professional intervention guidance may be appropriate, what families should prepare, and how to move from fear to a structured plan.",
    intro: "This hub is for families facing treatment refusal, escalating risk, repeated relapse, or the painful sense that every informal strategy has already been tried.",
    bestFor: "Best when your family is afraid of what happens next and needs a plan before the next crisis.",
    categories: ["Recovery", "Addiction", "Family Dynamics", "Boundaries"],
    featuredSlugs: [
      "when-is-it-time-for-a-professional-intervention",
      "choosing-right-addiction-treatment-center-families",
      "what-happens-in-addiction-treatment-families",
      "8-stages-family-addiction-journey",
    ],
    primaryCta: { label: "Request guidance from Matt", href: "/work-with-matt" },
    secondaryCta: { label: "Read signs you may need help", href: "/professional-guidance-signs" },
  },
  {
    slug: "recovery",
    title: "Recovery: what real support looks like after crisis and during change",
    shortTitle: "Recovery",
    description: "Learn how to support recovery without trying to control it, and how to respond more wisely during treatment, early sobriety, and relapse risk.",
    intro: "This hub is for families trying to stay helpful after treatment starts, during early recovery, or after repeated cycles of hope and disappointment.",
    bestFor: "Best when you are asking what support should look like now, not just what went wrong before.",
    categories: ["Recovery", "Addiction", "Boundaries"],
    featuredSlugs: [
      "support-recovery-without-enabling",
      "what-happens-in-addiction-treatment-families",
      "rebuilding-trust-addicted-loved-one-recovery",
      "sobriety-feels-worse-before-better",
    ],
    primaryCta: { label: "Read the family support guide", href: "/family-support-guide" },
    secondaryCta: { label: "Browse recovery articles", href: "/category/recovery" },
  },
];
