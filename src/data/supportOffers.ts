export type SupportOfferSlug =
  | "sober-helpline"
  | "freedom-interventions"
  | "family-bridge"
  | "party-wreckers"
  | "no-more-enabling"
  | "boundaries-course";

export interface SupportOffer {
  slug: SupportOfferSlug;
  name: string;
  eyebrow: string;
  headline: string;
  description: string;
  bestFor: string[];
  whatHappensNext: string[];
  notFor: string[];
  whyItFits: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  external: boolean;
  keywords: string;
}

export const supportOffers: SupportOffer[] = [
  {
    slug: "sober-helpline",
    name: "Sober Helpline",
    eyebrow: "Support platform",
    headline: "A calmer first place to ask for help",
    description:
      "Sober Helpline is the bridge for families who need live orientation, practical support, and a place to ask the questions that feel too messy for one article.",
    bestFor: [
      "Families who need a next step but are not ready for formal intervention",
      "Early recovery questions, relapse concerns, and aftercare confusion",
      "Loved ones who need support without making a crisis call",
      "Readers who need to talk through options before choosing treatment, coaching, or boundaries",
    ],
    whatHappensNext: [
      "Bring the situation into one place instead of scattering it across more searching",
      "Clarify whether the problem is support, boundaries, treatment resistance, or safety",
      "Use the conversation to choose the next right level of help",
    ],
    notFor: [
      "Immediate danger or medical emergency",
      "Replacing detox, clinical treatment, legal advice, or emergency support",
      "Forcing someone into recovery from the outside",
    ],
    whyItFits:
      "No More Enabling can educate the family, but many readers need a human support layer after the article. Sober Helpline is the natural next step for those families.",
    primaryLabel: "Open the Sober Helpline bridge",
    primaryHref: "https://soberhelpline.com/from-no-more-enabling",
    secondaryLabel: "Take the family assessment",
    secondaryHref: "/family-situation-assessment",
    external: true,
    keywords: "sober helpline, family addiction support, addiction support platform, relapse family support",
  },
  {
    slug: "freedom-interventions",
    name: "Freedom Interventions",
    eyebrow: "Intervention and treatment refusal",
    headline: "When the family needs a structured plan",
    description:
      "Freedom Interventions is the right bridge when education alone is not enough: treatment keeps getting refused, consequences are escalating, or the family needs professional intervention guidance.",
    bestFor: [
      "Treatment refusal and repeated broken promises",
      "Family members who are divided about what to do next",
      "Escalating risk, relapse, or consequences that keep getting minimized",
      "Situations where a professional intervention may be appropriate",
    ],
    whatHappensNext: [
      "Clarify the risk level and the family pattern",
      "Decide whether coaching, treatment planning, or intervention support fits",
      "Move the family away from another improvised confrontation",
    ],
    notFor: [
      "Immediate danger, overdose, violence, or active self-harm",
      "A casual conversation when the family has not gathered basic facts",
      "A guarantee that someone will accept treatment",
    ],
    whyItFits:
      "The highest-intent No More Enabling readers are often searching because the old conversations have failed. Freedom Interventions gives those families a more structured path.",
    primaryLabel: "Open the Freedom Interventions bridge",
    primaryHref: "https://freedominterventions.com/from-no-more-enabling",
    secondaryLabel: "Request guidance from Matt",
    secondaryHref: "/work-with-matt",
    external: true,
    keywords: "freedom interventions, professional interventionist, treatment refusal help, addiction intervention planning",
  },
  {
    slug: "family-bridge",
    name: "Family Bridge",
    eyebrow: "After-treatment coordination",
    headline: "Keep the family organized after treatment",
    description:
      "Family Bridge is the bridge for the fragile after-treatment window, when everyone wants recovery to work but old roles, unclear rules, and scattered communication can pull the family backward.",
    bestFor: [
      "Families preparing for a loved one to return from treatment",
      "Aftercare, house rules, accountability, and communication planning",
      "Parents, partners, and siblings who need a shared structure",
      "Relapse prevention conversations that need more than good intentions",
    ],
    whatHappensNext: [
      "Create a shared place for family expectations and recovery support",
      "Reduce side conversations, mixed messages, and emotional scrambling",
      "Support recovery without rebuilding the old rescue pattern",
    ],
    notFor: [
      "Emergency monitoring or crisis response",
      "Replacing therapy, treatment, sponsorship, or clinical aftercare",
      "Controlling every move your loved one makes after treatment",
    ],
    whyItFits:
      "The after-treatment articles bring in families at a perfect moment for structure. Family Bridge can turn that traffic into a practical recovery support workflow.",
    primaryLabel: "Visit Family Bridge",
    primaryHref: "https://familybridgeapp.com",
    secondaryLabel: "Read the after-treatment path",
    secondaryHref: "/topic-hubs/after-treatment",
    external: true,
    keywords: "family bridge app, after treatment family support, rehab aftercare family, relapse prevention family",
  },
  {
    slug: "party-wreckers",
    name: "Party Wreckers",
    eyebrow: "Prevention and sober culture",
    headline: "Support healthier choices before the crisis gets louder",
    description:
      "Party Wreckers is the bridge for families, schools, and communities that want prevention, substance-free momentum, and a stronger alternative to drinking or drug-centered social pressure.",
    bestFor: [
      "Parents worried about teen or young adult substance use",
      "Schools, groups, or communities looking for prevention messaging",
      "Families who want to interrupt risky social patterns earlier",
      "Readers who need a prevention-minded resource, not only crisis guidance",
    ],
    whatHappensNext: [
      "Move the conversation upstream before addiction is the only topic",
      "Create language around social pressure, parties, drinking, and risk",
      "Point younger audiences toward healthier belonging and identity",
    ],
    notFor: [
      "A replacement for treatment when a substance use disorder is already active",
      "Emergency help, detox, or crisis intervention",
      "Shame-based scare tactics",
    ],
    whyItFits:
      "No More Enabling reaches parents who are trying to understand risk. Party Wreckers gives that prevention traffic a more youth-facing next step.",
    primaryLabel: "Visit Party Wreckers",
    primaryHref: "https://partywreckers.com",
    secondaryLabel: "Read family prevention articles",
    secondaryHref: "/articles",
    external: true,
    keywords: "party wreckers, youth substance use prevention, sober events, addiction prevention families",
  },
  {
    slug: "no-more-enabling",
    name: "No More Enabling",
    eyebrow: "Education and routing",
    headline: "The SEO engine and family decision hub",
    description:
      "No More Enabling is the education engine: it attracts families through search, helps them name the pattern, and routes them to the right business or next step.",
    bestFor: [
      "Families who are still trying to understand what is happening",
      "Readers who need article-based education before taking action",
      "People unsure whether they are helping, enabling, rescuing, or abandoning",
      "Traffic that should be routed to Sober Helpline, Freedom Interventions, Family Bridge, or Party Wreckers",
    ],
    whatHappensNext: [
      "Use the assessment to identify the family situation",
      "Read the most relevant hub instead of wandering through articles",
      "Move into the right offer when the reader is ready",
    ],
    notFor: [
      "Immediate crisis response",
      "Medical, legal, or clinical diagnosis",
      "Replacing direct support when the family is stuck or unsafe",
    ],
    whyItFits:
      "This site should stay the top-of-funnel authority. Its job is traffic, trust, education, email capture, and routing.",
    primaryLabel: "Take the family assessment",
    primaryHref: "/family-situation-assessment",
    secondaryLabel: "Start with guided paths",
    secondaryHref: "/start-here",
    external: false,
    keywords: "no more enabling, family addiction education, helping vs enabling, addiction family decision tool",
  },
  {
    slug: "boundaries-course",
    name: "Boundaries Course",
    eyebrow: "Email course",
    headline: "Turn insight into limits that hold",
    description:
      "The Boundaries Course is the bridge when the family already knows the pattern but keeps losing the limit under guilt, fear, anger, or pressure.",
    bestFor: [
      "Families whose boundaries collapse after the next emotional conversation",
      "Parents and partners who keep rescuing, paying, explaining, or negotiating",
      "Readers who need a low-friction email offer before direct services",
      "Situations that need practice and language, not only one article",
    ],
    whatHappensNext: [
      "Join the weekly email course",
      "Practice clearer limits and less reactive support",
      "Use the lessons as a bridge toward coaching, support, or intervention if needed",
    ],
    notFor: [
      "Immediate danger or medical emergency",
      "A substitute for treatment or family therapy",
      "A way to control someone else into recovery",
    ],
    whyItFits:
      "Boundaries content is one of the cleanest conversion points on the site. The course turns search traffic into an owned audience.",
    primaryLabel: "Start the course",
    primaryHref: "/boundaries-course",
    secondaryLabel: "Take the family assessment",
    secondaryHref: "/family-situation-assessment",
    external: false,
    keywords: "addiction boundaries course, family boundaries email course, stop enabling course, boundary help for families",
  },
];

export const getSupportOffer = (slug: string | undefined) =>
  supportOffers.find((offer) => offer.slug === slug);
