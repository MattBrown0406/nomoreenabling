import type { BlogPostMeta } from "@/data/blogPostMeta";
import type { CommercialIntentPage } from "@/data/commercialIntentPages";

export interface AeoAnswer {
  id: string;
  question: string;
  shortAnswer: string;
  category: string;
  href: string;
  nextStep: string;
  tags: string[];
}

export interface GlossaryTerm {
  slug: string;
  term: string;
  plainDefinition: string;
  expandedAnswer: string;
  relatedLinks: { label: string; href: string }[];
}

export interface ComparisonAnswer {
  title: string;
  plainAnswer: string;
  leftLabel: string;
  leftDefinition: string;
  rightLabel: string;
  rightDefinition: string;
  href: string;
}

export const aeoAnswers: AeoAnswer[] = [
  {
    id: "helping-or-enabling",
    question: "How do I know if I am helping or enabling?",
    shortAnswer: "Helping supports responsibility, truth, treatment, and repair. Enabling protects addiction from consequences, usually through money, excuses, housing, secrecy, or emotional rescue.",
    category: "Enabling",
    href: "/helping-or-enabling",
    nextStep: "Use the Helping or Enabling tool before the next rescue decision.",
    tags: ["enabling", "helping", "boundaries", "codependency"],
  },
  {
    id: "stop-enabling-without-abandoning",
    question: "How do I stop enabling without abandoning someone I love?",
    shortAnswer: "Stop doing what protects the addiction, but stay available for recovery-supporting action. The goal is not less love. The goal is cleaner support.",
    category: "Enabling",
    href: "/articles/letting-go-without-abandoning-enabling",
    nextStep: "Name what support remains available and what rescue ends.",
    tags: ["enabling", "abandonment", "support", "family"],
  },
  {
    id: "first-boundary",
    question: "What is the first boundary a family should set?",
    shortAnswer: "Start with the behavior that is costing the most safety, honesty, money, or stability. A boundary should define what you will do if the behavior continues.",
    category: "Boundaries",
    href: "/family-support-guide",
    nextStep: "Write one boundary that you can actually hold under pressure.",
    tags: ["boundaries", "family dynamics", "safety"],
  },
  {
    id: "boundary-broken",
    question: "What should I do when an addicted loved one breaks a boundary?",
    shortAnswer: "Do not renegotiate the boundary in the heat of the moment. Follow through calmly, document the pattern, and review whether the boundary was specific enough to hold.",
    category: "Boundaries",
    href: "/articles/what-to-do-when-addicted-loved-one-breaks-boundaries",
    nextStep: "Decide the consequence before the next conversation.",
    tags: ["boundaries", "consequences", "enabling"],
  },
  {
    id: "money-help",
    question: "Should I give money to someone with addiction?",
    shortAnswer: "Money becomes enabling when it removes consequences, funds instability, or keeps the person from facing the reality of the addiction. Recovery-supporting help should be specific, transparent, and tied to treatment or safety.",
    category: "Financial enabling",
    href: "/articles/should-i-give-money-to-someone-with-addiction",
    nextStep: "Pause the payment and decide whether it supports recovery or protects the addiction.",
    tags: ["money", "financial", "adult child", "enabling"],
  },
  {
    id: "pay-rent",
    question: "Should I pay rent for my addicted adult child?",
    shortAnswer: "Paying rent may be enabling when it preserves active addiction without treatment, accountability, or a recovery plan. Housing support needs clear conditions and safety limits.",
    category: "Adult child addiction",
    href: "/articles/paying-rent-for-addicted-adult-child",
    nextStep: "Review the parent path before another housing decision.",
    tags: ["rent", "adult child", "money", "housing"],
  },
  {
    id: "adult-child-home",
    question: "Should I let my addicted adult child live at home?",
    shortAnswer: "The question is not only whether they can live at home. The question is what conditions protect safety, recovery, children, money, and the rest of the family.",
    category: "Adult child addiction",
    href: "/articles/should-i-let-addicted-adult-child-live-at-home",
    nextStep: "Clarify home rules before the move-in or return conversation.",
    tags: ["adult child", "housing", "boundaries", "safety"],
  },
  {
    id: "refuses-treatment",
    question: "What should I do when someone refuses addiction treatment?",
    shortAnswer: "Stop making the entire plan depend on their yes. The family can align, change rescue patterns, prepare options, and decide whether coaching or intervention guidance is needed.",
    category: "Treatment refusal",
    href: "/what-to-do-when-they-refuse-treatment",
    nextStep: "Use the treatment refusal page to decide between coaching and intervention readiness.",
    tags: ["refuses", "treatment", "intervention", "coaching"],
  },
  {
    id: "intervention-needed",
    question: "When is an addiction intervention necessary?",
    shortAnswer: "Intervention may be appropriate when treatment is repeatedly refused, consequences are escalating, safety risk is rising, or the family cannot stay aligned without professional structure.",
    category: "Intervention",
    href: "/intervention-help",
    nextStep: "Check the intervention help page if refusal and risk are escalating.",
    tags: ["intervention", "refusal", "safety", "treatment"],
  },
  {
    id: "alcohol-minimized",
    question: "What if my loved one says their drinking is normal?",
    shortAnswer: "Do not debate the label. Name the impact on safety, trust, parenting, work, money, driving, and emotional stability. Functioning does not erase harm.",
    category: "Alcohol",
    href: "/alcohol-intervention-help",
    nextStep: "Use the alcohol intervention page when drinking is minimized and treatment is refused.",
    tags: ["alcohol", "alcoholic", "minimization", "intervention"],
  },
  {
    id: "spouse-addiction",
    question: "How do I set boundaries with an addicted spouse?",
    shortAnswer: "Spouse boundaries must protect safety, money, children, emotional stability, and truth. A boundary is what you will do if the pattern continues, not a threat to control your partner.",
    category: "Spouse addiction",
    href: "/topic-hubs/spouse-partner-addiction",
    nextStep: "Use the spouse or partner hub before the next confrontation.",
    tags: ["spouse", "partner", "boundaries", "children"],
  },
  {
    id: "relapse-response",
    question: "How should a family respond to relapse without enabling?",
    shortAnswer: "Respond to relapse with safety, honesty, and structure. Do not erase the consequence, rewrite the story, or rebuild the old rescue pattern.",
    category: "Relapse",
    href: "/articles/respond-to-relapse-without-enabling",
    nextStep: "Separate relapse support from relapse rescue.",
    tags: ["relapse", "after treatment", "boundaries", "recovery"],
  },
  {
    id: "after-rehab-boundaries",
    question: "What boundaries should families set after rehab?",
    shortAnswer: "After rehab, boundaries should clarify housing, money, meetings, treatment follow-through, communication, relapse response, and what the family will not return to.",
    category: "After treatment",
    href: "/articles/boundaries-after-rehab",
    nextStep: "Use the after-treatment path before discharge or return home.",
    tags: ["after rehab", "after treatment", "boundaries", "relapse"],
  },
  {
    id: "codependency-definition",
    question: "What is codependency in addiction families?",
    shortAnswer: "Codependency is the pattern where a family member becomes over-responsible for another person's addiction, emotions, consequences, or recovery.",
    category: "Codependency",
    href: "/articles/codependency-addiction-families-breaking-the-cycle",
    nextStep: "Look for where responsibility has shifted away from the person with addiction.",
    tags: ["codependency", "family dynamics", "enabling"],
  },
  {
    id: "professional-guidance",
    question: "When should a family get professional guidance?",
    shortAnswer: "Get professional guidance when safety risk, treatment refusal, repeated relapse, family division, or collapsed boundaries make the next step too important to improvise.",
    category: "Professional guidance",
    href: "/professional-guidance-signs",
    nextStep: "Use the guidance signs page if the family keeps circling the same crisis.",
    tags: ["professional guidance", "coaching", "intervention", "safety"],
  },
  {
    id: "family-assessment",
    question: "What is the fastest way to choose the right next step?",
    shortAnswer: "Use the family situation assessment to route the concern into education, free support, coaching, or intervention guidance.",
    category: "Next step",
    href: "/family-situation-assessment",
    nextStep: "Take the assessment before another late-night search spiral.",
    tags: ["assessment", "start here", "coaching", "intervention"],
  },
];

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "enabling",
    term: "Enabling",
    plainDefinition: "Enabling is help that protects addiction from consequences.",
    expandedAnswer: "Enabling usually starts as love, fear, guilt, or crisis management. It becomes harmful when the family repeatedly softens reality, covers consequences, provides money or housing without accountability, or keeps the addiction system comfortable enough to continue.",
    relatedLinks: [
      { label: "Helping or Enabling?", href: "/helping-or-enabling" },
      { label: "Enabling Answer Center", href: "/enabling-answer-center" },
    ],
  },
  {
    slug: "boundary",
    term: "Boundary",
    plainDefinition: "A boundary is a clear statement of what you will do to protect safety, honesty, and stability.",
    expandedAnswer: "A boundary is not a speech, a threat, or a way to control another person. It defines your own action if a behavior continues. In addiction families, boundaries work best when they are specific, realistic, and connected to follow-through.",
    relatedLinks: [
      { label: "Family Support Guide", href: "/family-support-guide" },
      { label: "Boundaries Course", href: "/boundaries-course" },
    ],
  },
  {
    slug: "codependency",
    term: "Codependency",
    plainDefinition: "Codependency is over-responsibility for another person's addiction, emotions, choices, or recovery.",
    expandedAnswer: "In addiction families, codependency often looks like monitoring, rescuing, over-functioning, making excuses, absorbing consequences, or tying your own peace to whether the addicted person is okay today.",
    relatedLinks: [
      { label: "Codependency Signs", href: "/articles/codependency-signs-loved-one-addiction" },
      { label: "Family Addiction Coaching", href: "/family-addiction-coaching" },
    ],
  },
  {
    slug: "treatment-refusal",
    term: "Treatment Refusal",
    plainDefinition: "Treatment refusal is the repeated rejection, delay, or avoidance of addiction assessment or care.",
    expandedAnswer: "Treatment refusal becomes more serious when consequences escalate, safety risk rises, promises keep breaking, or the family continues adjusting life around a problem the loved one will not address.",
    relatedLinks: [
      { label: "Treatment Refusal Page", href: "/what-to-do-when-they-refuse-treatment" },
      { label: "Treatment Resistance Hub", href: "/topic-hubs/treatment-resistance" },
    ],
  },
  {
    slug: "intervention",
    term: "Intervention",
    plainDefinition: "An intervention is a structured process that helps a family present treatment options, impact, and boundaries with professional guidance.",
    expandedAnswer: "A good intervention is not a surprise attack. It is preparation, family alignment, treatment planning, boundary clarity, and a carefully guided conversation when addiction has outgrown informal talks.",
    relatedLinks: [
      { label: "Intervention Help", href: "/intervention-help" },
      { label: "Adult Child Intervention", href: "/addiction-intervention-for-adult-child" },
    ],
  },
  {
    slug: "financial-enabling",
    term: "Financial Enabling",
    plainDefinition: "Financial enabling is money support that reduces the pressure to face addiction-related consequences.",
    expandedAnswer: "Examples include paying rent, bills, legal costs, fines, debts, repairs, or emergencies in ways that allow active addiction to continue without a recovery-supporting plan.",
    relatedLinks: [
      { label: "Financial Enabling Hub", href: "/topic-hubs/financial-enabling" },
      { label: "Should I Give Money?", href: "/articles/should-i-give-money-to-someone-with-addiction" },
    ],
  },
  {
    slug: "emotional-enabling",
    term: "Emotional Enabling",
    plainDefinition: "Emotional enabling is managing another person's feelings so they do not have to face discomfort, shame, grief, or responsibility.",
    expandedAnswer: "Families often emotionally enable by calming every crisis, absorbing every mood swing, avoiding honest conversations, or making themselves responsible for the addicted person's emotional state.",
    relatedLinks: [
      { label: "Emotional Enabling", href: "/articles/emotional-enabling-family-regulator-burnout" },
      { label: "Family Support Guide", href: "/family-support-guide" },
    ],
  },
  {
    slug: "natural-consequence",
    term: "Natural Consequence",
    plainDefinition: "A natural consequence is the real-world result of a person's behavior when the family does not intercept it.",
    expandedAnswer: "Natural consequences are not punishments created by the family. They are the effects of missed obligations, broken trust, unpaid bills, unsafe behavior, or treatment refusal when rescue does not erase reality.",
    relatedLinks: [
      { label: "Consequences vs Lectures", href: "/articles/consequences-vs-lectures-addiction" },
      { label: "Helping or Enabling?", href: "/helping-or-enabling" },
    ],
  },
  {
    slug: "family-system",
    term: "Family System",
    plainDefinition: "The family system is the pattern of roles, reactions, rescues, silences, and rules that forms around addiction.",
    expandedAnswer: "Addiction changes more than one person. It trains the whole family to adapt. Understanding the system helps families stop treating each crisis as isolated and start changing the pattern underneath it.",
    relatedLinks: [
      { label: "Family System Notes", href: "/family-system-notes" },
      { label: "Start Here", href: "/start-here" },
    ],
  },
  {
    slug: "family-addiction-coaching",
    term: "Family Addiction Coaching",
    plainDefinition: "Family addiction coaching is practical guidance for loved ones who need help with boundaries, treatment decisions, communication, and next steps.",
    expandedAnswer: "Coaching does not replace treatment, therapy, medical care, or crisis support. It helps families make steadier decisions and stop reacting from panic, guilt, or exhaustion.",
    relatedLinks: [
      { label: "Family Addiction Coaching", href: "/family-addiction-coaching" },
      { label: "Family Consultation", href: "/family-addiction-consultation" },
    ],
  },
  {
    slug: "recovery-support",
    term: "Recovery Support",
    plainDefinition: "Recovery support is help that points toward accountability, treatment, honesty, safety, and long-term stability.",
    expandedAnswer: "Recovery support is different from rescue. It can include rides to treatment, emotional encouragement, meeting participation, safe housing with clear expectations, and family support that does not remove responsibility.",
    relatedLinks: [
      { label: "Support Recovery Without Enabling", href: "/articles/support-recovery-without-enabling" },
      { label: "Family Support Guide", href: "/family-support-guide" },
    ],
  },
  {
    slug: "crisis-support",
    term: "Crisis Support",
    plainDefinition: "Crisis support is immediate help when safety, overdose, violence, suicidal thinking, or dangerous withdrawal may be present.",
    expandedAnswer: "No More Enabling is educational and not a crisis service. If someone is in immediate danger, call emergency services. If there is suicidal thinking or threat of self-harm in the United States, call or text 988.",
    relatedLinks: [
      { label: "Crisis and Safety Hub", href: "/topic-hubs/crisis-and-safety" },
      { label: "Professional Guidance Signs", href: "/professional-guidance-signs" },
    ],
  },
];

export const comparisonAnswers: ComparisonAnswer[] = [
  {
    title: "Helping vs. enabling",
    plainAnswer: "Helping supports responsibility. Enabling protects addiction from consequences.",
    leftLabel: "Helping",
    leftDefinition: "Specific support that points toward treatment, honesty, accountability, safety, or recovery.",
    rightLabel: "Enabling",
    rightDefinition: "Rescue that removes discomfort, conceals consequences, or lets the addiction keep running the family system.",
    href: "/helping-or-enabling",
  },
  {
    title: "Boundaries vs. ultimatums",
    plainAnswer: "A boundary defines your action. An ultimatum tries to force someone else's action.",
    leftLabel: "Boundary",
    leftDefinition: "What I will do to protect safety, honesty, money, children, or my own stability.",
    rightLabel: "Ultimatum",
    rightDefinition: "A threat meant to pressure someone else into changing immediately.",
    href: "/articles/boundaries-vs-ultimatums",
  },
  {
    title: "Support vs. rescue",
    plainAnswer: "Support stays connected to recovery. Rescue erases reality.",
    leftLabel: "Support",
    leftDefinition: "Care that helps someone move toward responsibility, treatment, or stability.",
    rightLabel: "Rescue",
    rightDefinition: "Taking over consequences so the addiction does not have to face them.",
    href: "/articles/support-vs-sacrifice-addiction-families",
  },
  {
    title: "Coaching vs. intervention",
    plainAnswer: "Coaching helps the family get clear. Intervention helps the family act when addiction has outgrown ordinary conversations.",
    leftLabel: "Coaching",
    leftDefinition: "A private strategy session for boundaries, communication, treatment questions, and family alignment.",
    rightLabel: "Intervention",
    rightDefinition: "A structured professional process when treatment refusal, escalating risk, or family division requires a formal plan.",
    href: "/family-addiction-consultation",
  },
];

export const getAeoArticleAnswer = (article: BlogPostMeta): AeoAnswer => {
  const haystack = `${article.title} ${article.excerpt} ${article.categories.join(" ")}`.toLowerCase();

  const matchingAnswer = aeoAnswers.find((answer) =>
    answer.tags.some((tag) => haystack.includes(tag)),
  );

  return matchingAnswer ?? aeoAnswers[0];
};

export const getNextBestAnswerLinks = (article: BlogPostMeta): AeoAnswer[] => {
  const haystack = `${article.title} ${article.excerpt} ${article.categories.join(" ")}`.toLowerCase();
  const scored = aeoAnswers.map((answer) => ({
    answer,
    score: answer.tags.reduce((total, tag) => total + (haystack.includes(tag) ? 1 : 0), 0),
  }));

  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ answer }) => answer)
    .slice(0, 4);
};

export const getCommercialHowToSteps = (page: CommercialIntentPage) =>
  page.process.map((step) => ({
    name: step.title,
    text: step.body,
  }));

export const glossaryTermPaths = glossaryTerms.map((term) => `/glossary/${term.slug}`);
