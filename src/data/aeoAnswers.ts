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
  concern?: string;
  whatToDo?: string[];
  whenToGetHelp?: string;
  revenuePath?: "support" | "coaching" | "intervention" | "assessment";
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  primaryCtaDescription?: string;
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
    concern: "The family is trying to decide whether a specific action is love or rescue.",
    whatToDo: [
      "Ask whether the help increases responsibility or removes it.",
      "Separate emotional support from money, housing, secrecy, or cleanup.",
      "Offer support that points toward treatment, honesty, and repair.",
    ],
    whenToGetHelp: "If the same rescue decision keeps repeating, the family may need coaching before the next crisis resets the pattern.",
    revenuePath: "assessment",
  },
  {
    id: "stop-enabling-without-abandoning",
    question: "How do I stop enabling without abandoning someone I love?",
    shortAnswer: "Stop doing what protects the addiction, but stay available for recovery-supporting action. The goal is not less love. The goal is cleaner support.",
    category: "Enabling",
    href: "/articles/letting-go-without-abandoning-enabling",
    nextStep: "Name what support remains available and what rescue ends.",
    tags: ["enabling", "abandonment", "support", "family"],
    concern: "The family is afraid that stopping rescue means stopping love.",
    revenuePath: "support",
  },
  {
    id: "first-boundary",
    question: "What is the first boundary a family should set?",
    shortAnswer: "Start with the behavior that is costing the most safety, honesty, money, or stability. A boundary should define what you will do if the behavior continues.",
    category: "Boundaries",
    href: "/family-support-guide",
    nextStep: "Write one boundary that you can actually hold under pressure.",
    tags: ["boundaries", "family dynamics", "safety"],
    concern: "The family knows something has to change but is not sure where to begin.",
    revenuePath: "support",
  },
  {
    id: "boundary-broken",
    question: "What should I do when an addicted loved one breaks a boundary?",
    shortAnswer: "Do not renegotiate the boundary in the heat of the moment. Follow through calmly, document the pattern, and review whether the boundary was specific enough to hold.",
    category: "Boundaries",
    href: "/articles/what-to-do-when-addicted-loved-one-breaks-boundaries",
    nextStep: "Decide the consequence before the next conversation.",
    tags: ["boundaries", "consequences", "enabling"],
    concern: "A boundary was set, but the follow-through is becoming the hard part.",
    revenuePath: "coaching",
  },
  {
    id: "money-help",
    question: "Should I give money to someone with addiction?",
    shortAnswer: "Money becomes enabling when it removes consequences, funds instability, or keeps the person from facing the reality of the addiction. Recovery-supporting help should be specific, transparent, and tied to treatment or safety.",
    category: "Financial enabling",
    href: "/articles/should-i-give-money-to-someone-with-addiction",
    nextStep: "Pause the payment and decide whether it supports recovery or protects the addiction.",
    tags: ["money", "financial", "adult child", "enabling"],
    concern: "The next payment may quiet the crisis while keeping the addiction system intact.",
    revenuePath: "assessment",
  },
  {
    id: "pay-rent",
    question: "Should I pay rent for my addicted adult child?",
    shortAnswer: "Paying rent may be enabling when it preserves active addiction without treatment, accountability, or a recovery plan. Housing support needs clear conditions and safety limits.",
    category: "Adult child addiction",
    href: "/articles/paying-rent-for-addicted-adult-child",
    nextStep: "Review the parent path before another housing decision.",
    tags: ["rent", "adult child", "money", "housing"],
    concern: "Housing support is becoming the family's main leverage point.",
    revenuePath: "coaching",
  },
  {
    id: "adult-child-home",
    question: "Should I let my addicted adult child live at home?",
    shortAnswer: "The question is not only whether they can live at home. The question is what conditions protect safety, recovery, children, money, and the rest of the family.",
    category: "Adult child addiction",
    href: "/articles/should-i-let-addicted-adult-child-live-at-home",
    nextStep: "Clarify home rules before the move-in or return conversation.",
    tags: ["adult child", "housing", "boundaries", "safety"],
    concern: "The family is trying to protect love, safety, money, and the home at the same time.",
    revenuePath: "coaching",
  },
  {
    id: "refuses-treatment",
    question: "What should I do when someone refuses addiction treatment?",
    shortAnswer: "Stop making the entire plan depend on their yes. The family can align, change rescue patterns, prepare options, and decide whether coaching or intervention guidance is needed.",
    category: "Treatment refusal",
    href: "/what-to-do-when-they-refuse-treatment",
    nextStep: "Use the treatment refusal page to decide between coaching and intervention readiness.",
    tags: ["refuses", "treatment", "intervention", "coaching"],
    concern: "The family is waiting for a yes that may not come without a different structure.",
    revenuePath: "intervention",
  },
  {
    id: "intervention-needed",
    question: "When is an addiction intervention necessary?",
    shortAnswer: "Intervention may be appropriate when treatment is repeatedly refused, consequences are escalating, safety risk is rising, or the family cannot stay aligned without professional structure.",
    category: "Intervention",
    href: "/intervention-help",
    nextStep: "Check the intervention help page if refusal and risk are escalating.",
    tags: ["intervention", "refusal", "safety", "treatment"],
    concern: "The family may be past ordinary conversations and into structured help.",
    revenuePath: "intervention",
  },
  {
    id: "alcohol-minimized",
    question: "What if my loved one says their drinking is normal?",
    shortAnswer: "Do not debate the label. Name the impact on safety, trust, parenting, work, money, driving, and emotional stability. Functioning does not erase harm.",
    category: "Alcohol",
    href: "/alcohol-intervention-help",
    nextStep: "Use the alcohol intervention page when drinking is minimized and treatment is refused.",
    tags: ["alcohol", "alcoholic", "minimization", "intervention"],
    concern: "Alcohol is being normalized while the impact is getting harder to ignore.",
    revenuePath: "intervention",
  },
  {
    id: "spouse-addiction",
    question: "How do I set boundaries with an addicted spouse?",
    shortAnswer: "Spouse boundaries must protect safety, money, children, emotional stability, and truth. A boundary is what you will do if the pattern continues, not a threat to control your partner.",
    category: "Spouse addiction",
    href: "/topic-hubs/spouse-partner-addiction",
    nextStep: "Use the spouse or partner hub before the next confrontation.",
    tags: ["spouse", "partner", "boundaries", "children"],
    concern: "The addiction is affecting partnership, parenting, money, trust, and emotional safety.",
    revenuePath: "coaching",
  },
  {
    id: "relapse-response",
    question: "How should a family respond to relapse without enabling?",
    shortAnswer: "Respond to relapse with safety, honesty, and structure. Do not erase the consequence, rewrite the story, or rebuild the old rescue pattern.",
    category: "Relapse",
    href: "/articles/respond-to-relapse-without-enabling",
    nextStep: "Separate relapse support from relapse rescue.",
    tags: ["relapse", "after treatment", "boundaries", "recovery"],
    concern: "The family wants to respond to relapse without rebuilding the old rescue pattern.",
    revenuePath: "coaching",
  },
  {
    id: "after-rehab-boundaries",
    question: "What boundaries should families set after rehab?",
    shortAnswer: "After rehab, boundaries should clarify housing, money, meetings, treatment follow-through, communication, relapse response, and what the family will not return to.",
    category: "After treatment",
    href: "/articles/boundaries-after-rehab",
    nextStep: "Use the after-treatment path before discharge or return home.",
    tags: ["after rehab", "after treatment", "boundaries", "relapse"],
    concern: "The family needs a post-treatment structure before old patterns return.",
    revenuePath: "coaching",
  },
  {
    id: "codependency-definition",
    question: "What is codependency in addiction families?",
    shortAnswer: "Codependency is the pattern where a family member becomes over-responsible for another person's addiction, emotions, consequences, or recovery.",
    category: "Codependency",
    href: "/articles/codependency-addiction-families-breaking-the-cycle",
    nextStep: "Look for where responsibility has shifted away from the person with addiction.",
    tags: ["codependency", "family dynamics", "enabling"],
    concern: "The family member has become over-responsible for another person's addiction, emotions, or recovery.",
    revenuePath: "support",
  },
  {
    id: "professional-guidance",
    question: "When should a family get professional guidance?",
    shortAnswer: "Get professional guidance when safety risk, treatment refusal, repeated relapse, family division, or collapsed boundaries make the next step too important to improvise.",
    category: "Professional guidance",
    href: "/professional-guidance-signs",
    nextStep: "Use the guidance signs page if the family keeps circling the same crisis.",
    tags: ["professional guidance", "coaching", "intervention", "safety"],
    concern: "The next step is too important to keep improvising alone.",
    revenuePath: "coaching",
  },
  {
    id: "family-assessment",
    question: "What is the fastest way to choose the right next step?",
    shortAnswer: "Use the family situation assessment to route the concern into education, free support, coaching, or intervention guidance.",
    category: "Next step",
    href: "/family-situation-assessment",
    nextStep: "Take the assessment before another late-night search spiral.",
    tags: ["assessment", "start here", "coaching", "intervention"],
    concern: "The family needs triage before choosing education, support, coaching, or intervention.",
    revenuePath: "assessment",
  },
  {
    id: "am-i-enabling-adult-child",
    question: "Am I enabling my addicted adult child?",
    shortAnswer: "You may be enabling if your help repeatedly shields your adult child from addiction-related consequences, especially through money, housing, excuses, cleanup, or crisis rescue without treatment or accountability.",
    category: "Adult child addiction",
    href: "/articles/how-to-stop-enabling-adult-child-addiction",
    nextStep: "Look at the last three times you stepped in and ask what consequence your adult child did not have to face.",
    tags: ["adult child", "enabling", "money", "housing", "parent"],
    concern: "A parent is trying to tell the difference between love and a rescue pattern.",
    whatToDo: [
      "List the help you provide most often: money, housing, transportation, legal help, or emotional cleanup.",
      "Ask which of those supports require treatment, honesty, work, or accountability.",
      "Keep emotional connection available while removing support that protects active addiction.",
    ],
    whenToGetHelp: "If your adult child is escalating, refusing treatment, living at home unsafely, or cycling through repeated crises, get outside guidance before changing everything alone.",
    revenuePath: "coaching",
  },
  {
    id: "should-i-kick-addicted-child-out",
    question: "Should I kick my addicted adult child out?",
    shortAnswer: "Do not make the housing decision as a sudden punishment. Decide what conditions protect safety, sobriety, children, money, and the household, then make the next step clear and realistic.",
    category: "Adult child addiction",
    href: "/articles/should-i-let-addicted-adult-child-live-at-home",
    nextStep: "Write the home conditions, the consequence if they are broken, and the safety plan before the conversation.",
    tags: ["adult child", "housing", "home", "safety", "boundaries"],
    concern: "The family home may no longer be safe or stable under the current rules.",
    revenuePath: "coaching",
  },
  {
    id: "spouse-wont-stop-drinking",
    question: "What do I do if my spouse will not stop drinking?",
    shortAnswer: "Stop trying to win a debate about whether the drinking is bad enough. Name the impact, protect money and children, stop covering consequences, and decide whether family coaching or intervention planning is needed.",
    category: "Alcohol",
    href: "/alcohol-intervention-help",
    nextStep: "Write down the concrete impacts of drinking before the next conversation.",
    tags: ["spouse", "alcohol", "drinking", "children", "intervention"],
    concern: "Alcohol is being minimized while the family consequences keep growing.",
    revenuePath: "intervention",
  },
  {
    id: "stop-giving-money",
    question: "How do I stop giving money to someone with addiction?",
    shortAnswer: "Stop by replacing open-ended money with clear recovery-supporting offers. You can pay a provider directly, offer a ride to treatment, or help with a specific safety need without handing over cash.",
    category: "Financial enabling",
    href: "/articles/should-i-give-money-to-someone-with-addiction",
    nextStep: "Choose one sentence you can repeat: 'I cannot give cash, but I can help you connect with treatment.'",
    tags: ["money", "financial", "cash", "enabling", "boundaries"],
    concern: "Money has become the fastest way to calm the crisis and the fastest way to keep the pattern alive.",
    revenuePath: "assessment",
  },
  {
    id: "using-drugs-in-my-house",
    question: "What should I do if my loved one is using drugs in my house?",
    shortAnswer: "Treat drug use in the home as a safety issue, not just a behavior issue. Protect children, medications, vehicles, valuables, and your own stability, then set a boundary the household can actually enforce.",
    category: "Safety",
    href: "/articles/loved-one-using-drugs-in-my-house",
    nextStep: "Decide what must change immediately to protect the home and who needs to be involved.",
    tags: ["drugs", "house", "home", "safety", "boundaries"],
    concern: "Substance use is now affecting the safety and integrity of the home.",
    revenuePath: "intervention",
  },
  {
    id: "call-an-interventionist",
    question: "When should I call an interventionist?",
    shortAnswer: "Call an interventionist when treatment is being refused, risk is escalating, the family is divided, or ordinary conversations have become another part of the cycle.",
    category: "Intervention",
    href: "/intervention-help",
    nextStep: "Use the intervention readiness path if the family cannot stay aligned without professional structure.",
    tags: ["interventionist", "intervention", "refusal", "family", "risk"],
    concern: "The family may need a structured process, not another emotional conversation.",
    revenuePath: "intervention",
  },
  {
    id: "what-to-say-refuses-rehab",
    question: "What should I say to someone who refuses rehab?",
    shortAnswer: "Keep it short, specific, and focused on impact. Avoid arguing about labels. State what you see, what you are willing to support, and what you will no longer protect.",
    category: "Treatment refusal",
    href: "/articles/what-to-do-when-someone-refuses-rehab",
    nextStep: "Prepare the message before the conversation so panic does not write it for you.",
    tags: ["rehab", "refuses", "treatment", "conversation", "intervention"],
    concern: "The family needs language that does not turn into begging, debating, or rescuing.",
    revenuePath: "coaching",
  },
  {
    id: "family-disagrees-boundaries",
    question: "What if my family disagrees about addiction boundaries?",
    shortAnswer: "Family disagreement often keeps addiction protected. Start by aligning around safety, money, children, and what nobody will cover up anymore, even if everyone is not ready for the same boundary.",
    category: "Family dynamics",
    href: "/family-addiction-consultation",
    nextStep: "Get the decision-makers into one conversation before announcing a major boundary.",
    tags: ["family", "boundaries", "alignment", "coaching", "intervention"],
    concern: "The addiction is benefiting from divided family responses.",
    revenuePath: "coaching",
  },
  {
    id: "boundaries-vs-ultimatums",
    question: "What is the difference between a boundary and an ultimatum?",
    shortAnswer: "A boundary defines what you will do to protect safety, honesty, money, or stability. An ultimatum tries to force someone else to change through pressure or threat.",
    category: "Boundaries",
    href: "/family-support-guide",
    nextStep: "Rewrite the statement so it starts with what you will do, not what they must do.",
    tags: ["boundaries", "ultimatum", "control", "family dynamics"],
    concern: "The family needs a clear limit without turning the conversation into a power struggle.",
    revenuePath: "support",
  },
  {
    id: "loved-one-overdosed-what-now",
    question: "What should a family do after a loved one overdoses?",
    shortAnswer: "Treat an overdose as a medical and family-system emergency. After immediate medical care, the family should stop minimizing the risk, align quickly, prepare treatment options, and get professional guidance before the next crisis.",
    category: "Safety",
    href: "/intervention-help",
    nextStep: "If overdose risk is present, move from education into intervention readiness or direct professional guidance.",
    tags: ["overdose", "safety", "fentanyl", "intervention", "treatment"],
    concern: "The family may be tempted to feel relief once the immediate danger passes, but the risk pattern is still active.",
    whatToDo: [
      "Handle immediate medical risk first, including emergency services when needed.",
      "Document what happened while details are still clear.",
      "Decide what the family will no longer normalize after the overdose.",
      "Prepare treatment or intervention guidance before another high-risk window opens.",
    ],
    whenToGetHelp: "If there has been an overdose, suspected overdose, fentanyl exposure, dangerous withdrawal, or repeated refusal of care, the family should get outside guidance immediately.",
    revenuePath: "intervention",
    primaryCtaLabel: "Book an intervention consultation",
    primaryCtaHref: "https://freedominterventions.com/book-intervention-consultation?utm_source=nomoreenabling&utm_medium=answer_page&utm_campaign=urgent_intervention_answer&utm_content=overdose#booking",
    primaryCtaDescription: "Best when overdose risk means the family needs professional structure now, not another article.",
  },
  {
    id: "family-meeting-before-confronting-addiction",
    question: "Should our family meet before confronting someone about addiction?",
    shortAnswer: "Yes. Families should align before a major conversation whenever safety, treatment refusal, money, housing, or children are involved. A divided family usually gives addiction more room to maneuver.",
    category: "Family dynamics",
    href: "/family-addiction-consultation",
    nextStep: "Use a support meeting or private guidance session before the family confronts the problem alone.",
    tags: ["family", "alignment", "conversation", "support", "intervention"],
    concern: "The family wants to act, but different relatives may still be protecting different parts of the pattern.",
    whatToDo: [
      "Name the shared concern before debating the solution.",
      "Agree on what the family will stop covering up.",
      "Choose one person to lead the conversation instead of everyone reacting at once.",
    ],
    whenToGetHelp: "If the family cannot align around money, housing, treatment, safety, or consequences, get support before the confrontation.",
    revenuePath: "support",
    primaryCtaLabel: "Join the free Family Squares support meeting",
    primaryCtaHref: "https://soberhelpline.com/family-squares?utm_source=nomoreenabling&utm_medium=answer_page&utm_campaign=family_alignment_answer",
    primaryCtaDescription: "Best when the family needs live support before a conversation turns into another fight.",
  },
  {
    id: "treatment-bed-ready-refuses-to-go",
    question: "What if treatment is available but my loved one refuses to go?",
    shortAnswer: "A treatment option does not help if the family has no plan for refusal. Stop pleading in the moment, align the family, clarify boundaries, and decide whether the situation now needs intervention structure.",
    category: "Treatment refusal",
    href: "/what-to-do-when-they-refuse-treatment",
    nextStep: "Move into the treatment refusal path and decide whether coaching or intervention planning is needed.",
    tags: ["treatment", "refuses", "rehab", "intervention", "boundaries"],
    concern: "The family may have done the research but not prepared for the predictable no.",
    whatToDo: [
      "Keep the treatment option ready, but stop making the whole plan depend on one emotional yes.",
      "Ask what consequence the family is still removing while treatment is refused.",
      "Prepare a unified response before the next window opens.",
    ],
    whenToGetHelp: "If the family has treatment available and the loved one still refuses, professional intervention guidance may be the missing structure.",
    revenuePath: "intervention",
    primaryCtaLabel: "Book an intervention consultation",
    primaryCtaHref: "https://freedominterventions.com/book-intervention-consultation?utm_source=nomoreenabling&utm_medium=answer_page&utm_campaign=urgent_intervention_answer&utm_content=treatment_refusal#booking",
    primaryCtaDescription: "Best when a treatment option exists but refusal keeps collapsing the plan.",
  },
  {
    id: "addiction-affecting-children-home",
    question: "What should I do if addiction is affecting children in the home?",
    shortAnswer: "When children are affected, the question changes from comfort to protection. The family needs immediate clarity around safety, exposure, emotional harm, supervision, transportation, and what adults will no longer excuse.",
    category: "Safety",
    href: "/family-addiction-consultation",
    nextStep: "Get a private family guidance session if children are being pulled into the addiction pattern.",
    tags: ["children", "home", "safety", "spouse", "boundaries"],
    concern: "Children may be adapting to chaos that adults have started calling normal.",
    whatToDo: [
      "Identify what the children have seen, heard, missed, or been asked to carry.",
      "Stop asking children to keep secrets or manage adult emotions.",
      "Set adult boundaries around intoxication, driving, conflict, and supervision.",
    ],
    whenToGetHelp: "If children are exposed to intoxication, unsafe driving, violence, neglect, frightening conflict, or emotional caretaking, get outside guidance quickly.",
    revenuePath: "coaching",
    primaryCtaLabel: "Book a private family consultation",
    primaryCtaHref: "https://freedominterventions.com/book-intervention-consultation?utm_source=nomoreenabling&utm_medium=answer_page&utm_campaign=urgent_family_safety_answer&utm_content=children_home#booking",
    primaryCtaDescription: "Best when children are being affected and the family needs a practical safety conversation.",
  },
  {
    id: "how-fast-should-family-act-addiction-crisis",
    question: "How fast should a family act when addiction is getting worse?",
    shortAnswer: "Act as soon as risk, refusal, or family exhaustion is escalating. You do not need to wait for a dramatic rock bottom. The first action may be support, coaching, assessment, or intervention planning.",
    category: "Next step",
    href: "/family-situation-assessment",
    nextStep: "Use the family situation assessment to choose the right level of action today.",
    tags: ["crisis", "risk", "assessment", "coaching", "intervention"],
    concern: "The family is trying to decide whether the situation is serious enough to stop waiting.",
    whatToDo: [
      "Look at the trend, not just the latest apology.",
      "Ask what has become more dangerous, expensive, dishonest, or unstable in the last 30 days.",
      "Choose the lowest effective next step, but do not choose inaction just because everyone is tired.",
    ],
    whenToGetHelp: "If the pattern is escalating faster than the family can respond, use assessment or professional guidance before the next crisis sets the timeline.",
    revenuePath: "assessment",
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
    href: "/answers/boundaries-vs-ultimatums",
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
export const answerDetailPath = (answer: AeoAnswer) => `/answers/${answer.id}`;
export const answerDetailPaths = aeoAnswers.map(answerDetailPath);

export const getRelatedAnswers = (answer: AeoAnswer): AeoAnswer[] => {
  const related = aeoAnswers
    .filter((candidate) => candidate.id !== answer.id)
    .map((candidate) => ({
      answer: candidate,
      score: candidate.tags.reduce((total, tag) => total + (answer.tags.includes(tag) ? 1 : 0), 0),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ answer: candidate }) => candidate);

  return related.slice(0, 3);
};

export const getRelatedGlossaryTerms = (answer: AeoAnswer): GlossaryTerm[] =>
  glossaryTerms
    .filter((term) => {
      const termNeedle = `${term.term} ${term.slug}`.toLowerCase();
      return answer.tags.some((tag) => termNeedle.includes(tag) || tag.includes(term.slug));
    })
    .slice(0, 3);
