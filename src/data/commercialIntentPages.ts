export interface CommercialIntentPage {
  slug: string;
  eyebrow: string;
  title: string;
  metaTitle: string;
  description: string;
  keywords: string;
  audience: string;
  urgency: "urgent" | "high" | "steady";
  primaryOffer: "freedom-interventions" | "coaching" | "sober-helpline";
  defaultConcern: string;
  leadIntent: string;
  trustProof: string[];
  signs: string[];
  process: { title: string; body: string }[];
  relatedLinks: { label: string; href: string; description: string }[];
  faqs: { question: string; answer: string }[];
}

export const commercialIntentPages: CommercialIntentPage[] = [
  {
    slug: "intervention-help",
    eyebrow: "Intervention help",
    title: "Addiction intervention help for families who need a structured plan",
    metaTitle: "Addiction Intervention Help for Families | No More Enabling",
    description:
      "Learn when addiction intervention help may be appropriate, what families should prepare, and how to request private guidance from Matt Brown.",
    keywords:
      "addiction intervention help, professional interventionist, family addiction intervention, intervention help for families, treatment refusal help",
    audience:
      "families facing treatment refusal, repeated relapse, escalating consequences, or conversations that keep collapsing into promises and panic.",
    urgency: "high",
    primaryOffer: "freedom-interventions",
    defaultConcern: "We may need addiction intervention help",
    leadIntent: "intervention-help",
    trustProof: [
      "Built from intervention and family support experience since 2004",
      "Designed for families before the next confrontation happens",
      "Clear crisis boundaries: not a substitute for 911, 988, detox, or medical care",
    ],
    signs: [
      "Treatment keeps getting refused or delayed",
      "The family is divided about consequences, money, housing, or timing",
      "Your loved one agrees in the moment but nothing changes afterward",
      "Consequences are escalating and the family is improvising under pressure",
      "You need help deciding whether intervention, coaching, or treatment planning fits",
    ],
    process: [
      {
        title: "Clarify the real risk",
        body: "Before an intervention is planned, the family needs a grounded picture of substance use, safety, mental health concerns, treatment history, and the consequences already unfolding.",
      },
      {
        title: "Align the family system",
        body: "Interventions fail when the family sends mixed messages. The first work is often helping the family stop arguing with each other long enough to create a consistent plan.",
      },
      {
        title: "Choose the right level of help",
        body: "Some situations need coaching and preparation. Others need formal intervention support. The goal is to match the plan to the risk instead of forcing one answer onto every family.",
      },
    ],
    relatedLinks: [
      { label: "Treatment Resistance Hub", href: "/topic-hubs/treatment-resistance", description: "Read the structured path for refusal and repeated broken promises." },
      { label: "When Is an Intervention Necessary?", href: "/articles/when-is-an-addiction-intervention-necessary", description: "Understand the signs that informal conversations are no longer enough." },
      { label: "Work With Matt", href: "/work-with-matt", description: "Share what is happening and ask for private guidance." },
    ],
    faqs: [
      {
        question: "How do I know if my family needs an intervention?",
        answer:
          "An intervention may be appropriate when treatment is repeatedly refused, consequences are escalating, safety is deteriorating, or the family cannot stay aligned long enough to create a clear plan.",
      },
      {
        question: "Can Matt help if my loved one refuses treatment?",
        answer:
          "Yes. The family can still prepare, align, set boundaries, and decide whether professional intervention guidance is appropriate even before the loved one agrees to help.",
      },
      {
        question: "Is this a crisis service?",
        answer:
          "No. If someone is in immediate danger, call 911. If there is suicidal thinking or threat of self-harm in the United States, call or text 988.",
      },
    ],
  },
  {
    slug: "family-addiction-coaching",
    eyebrow: "Family addiction coaching",
    title: "Family addiction coaching for families stuck in enabling, relapse, or treatment refusal",
    metaTitle: "Family Addiction Coaching | Boundaries, Enabling & Treatment Refusal",
    description:
      "Private family addiction coaching for parents, spouses, and siblings who need help with enabling, boundaries, treatment refusal, relapse, money, and family alignment.",
    keywords:
      "family addiction coaching, addiction family coach, family recovery coaching, help for families of addicts, addiction boundaries coaching",
    audience:
      "parents, spouses, siblings, and loved ones who need practical guidance before the next crisis, relapse, money request, or treatment argument.",
    urgency: "steady",
    primaryOffer: "coaching",
    defaultConcern: "We need family addiction coaching",
    leadIntent: "family-addiction-coaching",
    trustProof: [
      "Led by a professional interventionist with family addiction experience since 2004",
      "Focused on family systems, not shame or lectures",
      "Useful before, during, or after treatment decisions",
      "Designed to turn article insight into decisions the family can hold",
    ],
    signs: [
      "You keep second-guessing whether you are helping or enabling",
      "Boundaries are clear in your head but collapse in real conversations",
      "Relapse, money, housing, or treatment questions keep taking over the family",
      "Different family members are making different promises or threats",
      "You need a calmer plan before deciding whether intervention is necessary",
    ],
    process: [
      {
        title: "Map the family pattern",
        body: "Coaching starts by naming what keeps repeating: rescuing, arguing, silence, money rescue, crisis response, or boundaries that disappear under guilt.",
      },
      {
        title: "Separate care from control",
        body: "Families usually need language that lets them stay loving without absorbing consequences that do not belong to them.",
      },
      {
        title: "Build the next right step",
        body: "The work is practical: what to say, what to stop doing, what to prepare, and when to move toward treatment planning or intervention support.",
      },
    ],
    relatedLinks: [
      { label: "Helping or Enabling Tool", href: "/helping-or-enabling", description: "Start with a quick pattern check." },
      { label: "Boundaries Hub", href: "/topic-hubs/boundaries", description: "Read the boundary path in a smarter order." },
      { label: "Work With Matt", href: "/work-with-matt", description: "Request private guidance when the family needs a plan." },
    ],
    faqs: [
      {
        question: "Who is family addiction coaching for?",
        answer:
          "It is for family members affected by a loved one's addiction who need help with boundaries, communication, treatment refusal, relapse, or family alignment.",
      },
      {
        question: "Is coaching only for families in crisis?",
        answer:
          "No. Coaching can help before a crisis, after treatment, during relapse concerns, or while deciding whether intervention support is needed.",
      },
      {
        question: "Does coaching replace therapy or treatment?",
        answer:
          "No. Coaching here is educational and consultative. It does not replace therapy, medical care, detox, legal advice, or emergency support.",
      },
    ],
  },
  {
    slug: "addiction-intervention-for-adult-child",
    eyebrow: "Adult child addiction",
    title: "Addiction intervention help when your adult child refuses treatment",
    metaTitle: "Addiction Intervention for Adult Child | Parent Guidance",
    description:
      "Guidance for parents considering addiction intervention help for an adult child who refuses treatment, keeps relapsing, or relies on money and housing rescue.",
    keywords:
      "addiction intervention for adult child, addicted adult child refuses treatment, intervention for adult son, intervention for adult daughter",
    audience:
      "parents whose adult child is caught in treatment refusal, money rescue, housing decisions, relapse, or escalating consequences.",
    urgency: "high",
    primaryOffer: "freedom-interventions",
    defaultConcern: "My adult child refuses treatment",
    leadIntent: "adult-child-intervention",
    trustProof: [
      "Parent-focused guidance that does not shame the love underneath the rescue",
      "Connects money, housing, boundaries, and treatment planning into one decision path",
      "Built to help parents act together instead of reacting separately",
    ],
    signs: [
      "Your adult child refuses treatment or backs out after agreeing",
      "You keep paying rent, bills, legal costs, repairs, or emergency expenses",
      "Housing has become the center of the conflict",
      "One parent or family member keeps rescuing while another wants limits",
      "You are afraid that setting a boundary means abandoning your child",
    ],
    process: [
      {
        title: "Stabilize the parent system first",
        body: "Parents often disagree because fear takes different forms. One rescues, one threatens, one withdraws. The first move is getting the adults aligned.",
      },
      {
        title: "Audit money and housing rescue",
        body: "Adult child addiction often uses family money and housing as oxygen. A plan needs to decide what support points toward recovery and what protects active addiction.",
      },
      {
        title: "Prepare a treatment or intervention path",
        body: "If treatment refusal continues, the family may need structured intervention guidance with clear options, boundaries, and follow-through.",
      },
    ],
    relatedLinks: [
      { label: "Adult Child Addiction Hub", href: "/topic-hubs/adult-child-addiction", description: "Start with the parent-specific reading path." },
      { label: "Financial Enabling Hub", href: "/topic-hubs/financial-enabling", description: "Clarify money, rent, and bills before the next request." },
      { label: "Request Guidance", href: "/work-with-matt", description: "Share the parent situation privately." },
    ],
    faqs: [
      {
        question: "Can parents stage an intervention for an adult child?",
        answer:
          "Parents can prepare a structured intervention plan when an adult child refuses treatment, but the family should be aligned, informed, and guided before moving into a formal intervention.",
      },
      {
        question: "Should I stop helping financially before an intervention?",
        answer:
          "Not every family should make the same move, but financial rescue should be reviewed. Support that protects active addiction usually needs to change.",
      },
      {
        question: "What if my adult child has nowhere to go?",
        answer:
          "Housing decisions are serious and should be planned carefully. The question is not simply whether to open the door, but what conditions, safety limits, and treatment expectations must exist.",
      },
    ],
  },
  {
    slug: "alcohol-intervention-help",
    eyebrow: "Alcohol intervention help",
    title: "Alcohol intervention help when drinking is being minimized",
    metaTitle: "Alcohol Intervention Help for Families | No More Enabling",
    description:
      "Guidance for families considering alcohol intervention help when drinking is denied, minimized, affecting children, or creating repeated broken promises.",
    keywords:
      "alcohol intervention help, alcoholic intervention, intervention for alcoholic spouse, family intervention for alcoholism, alcohol treatment refusal",
    audience:
      "families dealing with alcohol use that is normalized, minimized, hidden behind functioning, or harming the home.",
    urgency: "high",
    primaryOffer: "freedom-interventions",
    defaultConcern: "Alcohol is being minimized and treatment is refused",
    leadIntent: "alcohol-intervention-help",
    trustProof: [
      "Alcohol-specific guidance for families dealing with denial and normalization",
      "Clear distinction between social drinking concerns and harmful family impact",
      "Built for spouses, parents, and adult children trying to stop minimizing the pattern",
    ],
    signs: [
      "Drinking is repeatedly explained away as stress, social life, or normal use",
      "Promises to cut back keep turning into the same pattern",
      "Children, driving, work, money, or emotional safety are being affected",
      "Your loved one becomes defensive whenever treatment or assessment is mentioned",
      "The family has adjusted so much that the drinking now feels normal",
    ],
    process: [
      {
        title: "Name the impact instead of debating the label",
        body: "Families often get stuck trying to prove someone is an alcoholic. A better starting point is documenting the impact on safety, parenting, trust, money, work, and emotional stability.",
      },
      {
        title: "Stop negotiating with minimization",
        body: "Alcohol intervention planning requires the family to move from arguments about intent into clear statements about what the family can and cannot continue living with.",
      },
      {
        title: "Decide whether structured intervention fits",
        body: "If alcohol treatment is refused and consequences keep rising, professional intervention guidance can help the family prepare options and boundaries before the next confrontation.",
      },
    ],
    relatedLinks: [
      { label: "Alcoholic Family Member Hub", href: "/topic-hubs/alcoholic-family-member", description: "Read alcohol-specific family guidance." },
      { label: "Family Intervention for Alcoholism", href: "/articles/family-intervention-for-alcoholism", description: "Understand intervention planning for alcohol use." },
      { label: "Work With Matt", href: "/work-with-matt", description: "Ask for private guidance about alcohol refusal." },
    ],
    faqs: [
      {
        question: "Can you do an intervention for alcoholism?",
        answer:
          "Yes, families may consider intervention support when alcohol use is causing harm and treatment or assessment is refused. Planning should focus on facts, impact, options, and family alignment.",
      },
      {
        question: "What if my loved one is high-functioning?",
        answer:
          "Functioning does not erase family impact. Alcohol can still harm parenting, emotional safety, money, health, driving, and trust even when someone keeps a job or appears fine outside the home.",
      },
      {
        question: "Should we wait until things get worse?",
        answer:
          "Waiting can allow the family system to normalize more harm. If the pattern is escalating or treatment is refused, it is reasonable to seek guidance before the next crisis.",
      },
    ],
  },
  {
    slug: "what-to-do-when-they-refuse-treatment",
    eyebrow: "Treatment refusal",
    title: "What to do when someone refuses addiction treatment",
    metaTitle: "What to Do When Someone Refuses Addiction Treatment",
    description:
      "A practical next-step page for families facing addiction treatment refusal, denial, repeated promises, and the question of whether intervention help is needed.",
    keywords:
      "what to do when someone refuses addiction treatment, refuses rehab, loved one refuses treatment, treatment refusal addiction, family plan refusal",
    audience:
      "families who just heard no again and need a plan that does not depend on winning another argument.",
    urgency: "high",
    primaryOffer: "coaching",
    defaultConcern: "My loved one refuses addiction treatment",
    leadIntent: "treatment-refusal",
    trustProof: [
      "Refusal-focused path for families before the next argument",
      "Shows what the family can change even when the loved one says no",
      "Routes to coaching or intervention based on severity and safety",
    ],
    signs: [
      "They deny the problem or insist they can handle it alone",
      "They agree to help during a crisis and back out when pressure passes",
      "The family keeps using the same conversation with the same result",
      "Consequences keep growing while the loved one rejects assessment or treatment",
      "You are afraid the next step will either be too harsh or too passive",
    ],
    process: [
      {
        title: "Stop making the plan depend on their yes",
        body: "Families cannot control acceptance of treatment, but they can control preparation, boundaries, communication, money, housing, and whether the next conversation is improvised.",
      },
      {
        title: "Document the pattern calmly",
        body: "Refusal becomes easier to minimize when the family speaks only from emotion. A useful plan names the facts, risks, treatment history, and repeated consequences.",
      },
      {
        title: "Choose coaching or intervention guidance",
        body: "Some families need coaching to align and hold limits. Others need intervention guidance because refusal has become entrenched and consequences are escalating.",
      },
    ],
    relatedLinks: [
      { label: "Treatment Resistance Hub", href: "/topic-hubs/treatment-resistance", description: "Read the refusal path in order." },
      { label: "What to Do When Someone Refuses Rehab", href: "/articles/what-to-do-when-someone-refuses-rehab", description: "Start with the core refusal guide." },
      { label: "Family Situation Assessment", href: "/family-situation-assessment", description: "Use the assessment to route the next step." },
    ],
    faqs: [
      {
        question: "Can the family do anything if someone refuses treatment?",
        answer:
          "Yes. The family can align, stop rescuing the pattern, prepare treatment options, change boundaries, and seek guidance about whether intervention planning is appropriate.",
      },
      {
        question: "Should we keep trying to convince them?",
        answer:
          "More persuasion is not always more effective. If the same conversation keeps failing, the family may need a different structure rather than a louder version of the same argument.",
      },
      {
        question: "When does refusal become urgent?",
        answer:
          "Refusal becomes more urgent when safety, withdrawal risk, overdose risk, violence, children, driving, severe mental health concerns, or escalating legal and medical consequences are involved.",
      },
    ],
  },
  {
    slug: "family-addiction-consultation",
    eyebrow: "Private family consultation",
    title: "Family addiction consultation to decide the next right step",
    metaTitle: "Family Addiction Consultation | Private Guidance From Matt Brown",
    description:
      "Request a private family addiction consultation to sort enabling, treatment refusal, relapse, boundaries, and whether coaching or intervention help fits.",
    keywords:
      "family addiction consultation, addiction family guidance, private addiction consultation, family intervention consultation, addiction help for families",
    audience:
      "families who do not know whether they need coaching, intervention support, Sober Helpline, treatment planning, or a better boundary plan.",
    urgency: "steady",
    primaryOffer: "coaching",
    defaultConcern: "We need help deciding the next step",
    leadIntent: "family-consultation",
    trustProof: [
      "A routing page for families who are unsure where to start",
      "Designed to reduce panic and clarify the next decision",
      "Connects No More Enabling readers to the right level of support",
    ],
    signs: [
      "You have read enough to recognize the pattern but still do not know what to do",
      "The family disagrees about whether this is enabling, crisis, relapse, or treatment refusal",
      "You are unsure whether to set a boundary, call treatment, join support, or plan intervention",
      "The situation is not an immediate emergency, but it is not getting better",
      "You want an experienced outside perspective before making the next move",
    ],
    process: [
      {
        title: "Share the situation in one place",
        body: "A useful consultation request gathers the relationship, primary concern, treatment history, urgency, and what is happening now so the next step is not based on scattered details.",
      },
      {
        title: "Route the family by fit",
        body: "The right answer may be coaching, Family Squares, Freedom Interventions, a topic hub, or a crisis resource. The point is to match the next step to the actual pattern.",
      },
      {
        title: "Move from panic to sequence",
        body: "Families often try to solve every issue at once. Consultation helps decide what needs attention first and what can wait until the family is steadier.",
      },
    ],
    relatedLinks: [
      { label: "Start Here", href: "/start-here", description: "Choose a guided path based on what your family is facing." },
      { label: "Family Situation Assessment", href: "/family-situation-assessment", description: "Get a fast route before requesting guidance." },
      { label: "Work With Matt", href: "/work-with-matt", description: "Read the broader coaching and intervention overview." },
    ],
    faqs: [
      {
        question: "What should I include in a consultation request?",
        answer:
          "Include your relationship, primary concern, treatment history, current urgency, safety concerns, what the family has tried, and what decision you need help making.",
      },
      {
        question: "What if I do not know whether this is intervention-level?",
        answer:
          "That is a good reason to request guidance. The first step can be deciding whether coaching, treatment planning, support, or professional intervention makes sense.",
      },
      {
        question: "Can I use this if there is an emergency?",
        answer:
          "No. If someone is in immediate danger, call 911. If there is suicidal thinking or threat of self-harm in the United States, call or text 988.",
      },
    ],
  },
];

export const getCommercialIntentPage = (slug: string | undefined) =>
  commercialIntentPages.find((page) => page.slug === slug);

export const getCommercialIntentPageForContext = ({
  title = "",
  categories = [],
  hubSlug = "",
}: {
  title?: string;
  categories?: string[];
  hubSlug?: string;
}) => {
  const haystack = `${title} ${categories.join(" ")} ${hubSlug}`.toLowerCase();

  if (haystack.includes("adult child")) return getCommercialIntentPage("addiction-intervention-for-adult-child");
  if (haystack.includes("alcohol")) return getCommercialIntentPage("alcohol-intervention-help");
  if (haystack.includes("refus") || haystack.includes("treatment resistance")) return getCommercialIntentPage("what-to-do-when-they-refuse-treatment");
  if (haystack.includes("intervention")) return getCommercialIntentPage("intervention-help");
  if (haystack.includes("boundar") || haystack.includes("codependency") || haystack.includes("enabling")) return getCommercialIntentPage("family-addiction-coaching");

  return getCommercialIntentPage("family-addiction-consultation");
};
