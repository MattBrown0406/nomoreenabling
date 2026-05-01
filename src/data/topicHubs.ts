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
  searchIntent: string;
  sponsorCategory: string;
  keyQuestions: string[];
  guideSections: { heading: string; body: string }[];
}

export const topicHubs: TopicHub[] = [
  {
    slug: "adult-child-addiction",
    title: "Adult child addiction: how parents can help without carrying the addiction",
    shortTitle: "Adult Child Addiction",
    description: "Guidance for parents trying to support an addicted adult child without funding, housing, or rescuing the pattern that keeps repeating.",
    intro: "This hub is for parents whose adult child is struggling with addiction and whose family keeps getting pulled into money, housing, treatment refusal, relapse, or crisis decisions.",
    bestFor: "Best when you are asking how to stay loving without becoming the safety net for active addiction.",
    categories: ["Adult Child Addiction", "Enabling", "Boundaries", "Family Support"],
    featuredSlugs: [
      "how-to-stop-enabling-adult-child-addiction",
      "should-i-let-addicted-adult-child-live-at-home",
      "financial-boundaries-with-addicted-adult-child",
      "when-adult-child-refuses-addiction-treatment",
    ],
    primaryCta: { label: "Take the helping vs enabling assessment", href: "/helping-or-enabling" },
    secondaryCta: { label: "Request guidance from Matt", href: "/work-with-matt" },
    searchIntent: "Parents of adult children who are searching for practical help around enabling, housing, money, treatment refusal, and family boundaries.",
    sponsorCategory: "Parent-focused addiction education, treatment navigation, intervention services, family coaching, and recovery support.",
    keyQuestions: [
      "How do I stop enabling my addicted adult child?",
      "Should I let my addicted adult child live at home?",
      "Should I give money to my adult child if they are using?",
      "What do I do if my adult child refuses treatment?",
    ],
    guideSections: [
      {
        heading: "Parents need a different kind of clarity",
        body: "Adult child addiction creates a uniquely painful bind. Your child is grown, but your attachment system still responds like a parent. That is why generic advice like 'just stop helping' often fails. Parents need language, boundaries, and support that honor the love while changing the system that addiction has been using.",
      },
      {
        heading: "Why this cluster matters for search",
        body: "Searches about addicted adult children are usually urgent and specific. Parents are not browsing casually. They are deciding whether to send money, open the door, set a limit, call treatment, or involve an interventionist. That makes this cluster a high-intent entry point for education, coaching, Sober Helpline, and Freedom Interventions.",
      },
      {
        heading: "The path this hub should create",
        body: "The reading path moves from recognition to action: stop enabling, make the housing decision, set financial boundaries, then understand what to do when treatment is refused. Every article should help parents become calmer, more aligned, and more able to support recovery without absorbing the addiction.",
      },
    ],
  },
  {
    slug: "financial-enabling",
    title: "Financial enabling: when money keeps addiction protected",
    shortTitle: "Financial Enabling",
    description: "A practical hub for families deciding when to stop giving cash, paying rent, covering bills, or absorbing financial consequences tied to addiction.",
    intro: "This hub is for parents, spouses, siblings, and friends who keep getting pulled into money requests, rent emergencies, unpaid bills, legal costs, and promises that this will be the last time.",
    bestFor: "Best when you need to help without becoming the financial safety net that keeps the addiction cycle alive.",
    categories: ["Financial Enabling", "Enabling", "Boundaries", "Family Support"],
    featuredSlugs: [
      "should-i-give-money-to-someone-with-addiction",
      "paying-rent-for-addicted-adult-child",
      "financial-boundaries-with-addiction",
      "when-helping-with-bills-becomes-enabling",
    ],
    primaryCta: { label: "Take the helping vs enabling assessment", href: "/helping-or-enabling" },
    secondaryCta: { label: "Request guidance from Matt", href: "/work-with-matt" },
    searchIntent: "Families deciding whether to give money, pay bills, cover rent, or set financial boundaries with a loved one struggling with addiction.",
    sponsorCategory: "Treatment navigation, family recovery coaching, intervention services, sober living, financial wellness, and recovery-aligned family support.",
    keyQuestions: [
      "Should I give money to someone with addiction?",
      "Should I keep paying rent for my addicted adult child?",
      "How do I set financial boundaries with addiction?",
      "When does helping with bills become enabling?",
    ],
    guideSections: [
      {
        heading: "Money is where love and fear collide",
        body: "Financial enabling is one of the hardest patterns for families to change because the requests often sound practical. Rent, groceries, gas, a phone bill, a court fine, or one more repair can all feel urgent. But when the family repeatedly absorbs the cost of active addiction, money can become the structure that protects the pattern from consequences.",
      },
      {
        heading: "Why this cluster matters for search",
        body: "Money-related searches are high-intent because families are usually making a decision right now. They are not reading in theory. They are looking at a payment request, a missed bill, or an eviction warning and trying to decide what love requires. That makes this cluster valuable for organic traffic and highly relevant for ethical sponsors that support recovery, treatment access, and family education.",
      },
      {
        heading: "The path this hub should create",
        body: "The reading path starts with the broad cash question, then moves into rent, family-wide financial boundaries, and recurring bill rescue. Each article should help the reader slow down, remove panic from the decision, and redirect support toward treatment, safety, and recovery rather than repeated bailout.",
      },
    ],
  },
  {
    slug: "treatment-resistance",
    title: "Treatment resistance: what families can do when help is refused",
    shortTitle: "Treatment Resistance",
    description: "Guidance for families facing rehab refusal, denied addiction problems, repeated broken promises, and the question of when intervention becomes necessary.",
    intro: "This hub is for families who know their loved one needs help but keep hearing no, not yet, I can handle it, or you are overreacting.",
    bestFor: "Best when conversations about treatment keep failing and the family needs a calmer, more structured next move.",
    categories: ["Treatment Resistance", "Intervention", "Family Support", "Boundaries"],
    featuredSlugs: [
      "what-to-do-when-someone-refuses-rehab",
      "loved-one-refuses-addiction-treatment",
      "how-to-talk-to-someone-who-needs-treatment",
      "when-is-an-addiction-intervention-necessary",
      "addiction-treatment-refusal-family-plan",
    ],
    primaryCta: { label: "Request guidance from Matt", href: "/work-with-matt" },
    secondaryCta: { label: "Read the intervention guide", href: "/topic-hubs/intervention" },
    searchIntent: "Families searching for what to do when a loved one refuses rehab, denies the problem, avoids assessment, or rejects addiction treatment.",
    sponsorCategory: "Intervention services, treatment navigation, detox and assessment providers, family recovery coaching, and ethical treatment programs.",
    keyQuestions: [
      "What do I do when someone refuses rehab?",
      "How do I talk to someone who needs addiction treatment?",
      "When is an addiction intervention necessary?",
      "What family plan should we make if treatment is refused?",
    ],
    guideSections: [
      {
        heading: "Refusal does not mean the family is out of moves",
        body: "Treatment resistance often makes families feel powerless because they cannot force an adult to accept help. But the family can still change the structure around the addiction. It can stop rescuing, align boundaries, prepare real treatment options, and use professional guidance before the next crisis decides for everyone.",
      },
      {
        heading: "Why this cluster matters for search",
        body: "Searches about refusing rehab and refusing treatment are usually urgent. The reader may be looking at a loved one who just said no, backed out of detox, rejected an assessment, or promised to stop on their own again. That makes this cluster a strong bridge from education into Sober Helpline, intervention consults, and treatment navigation.",
      },
      {
        heading: "The path this hub should create",
        body: "The reading path moves from immediate refusal to better conversation, then to intervention timing and family planning. The goal is to help families stop repeating the same argument and start building a plan that can hold whether the loved one says yes or no today.",
      },
    ],
  },
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
    searchIntent: "Families who suspect their help has turned into rescue, protection, or consequence-removal.",
    sponsorCategory: "Family addiction education, coaching, treatment navigation, and ethical recovery support.",
    keyQuestions: [
      "Am I helping or enabling my loved one?",
      "Should I keep paying bills, rent, legal fees, or phone costs?",
      "How do I stop rescuing without abandoning someone I love?",
      "What does support look like when addiction is still active?",
    ],
    guideSections: [
      {
        heading: "What enabling usually looks like at home",
        body: "Enabling rarely starts as a bad decision. It usually begins as love under pressure: covering one bill, smoothing over one crisis, answering one late-night call, or protecting the family from one more frightening consequence. Over time, the pattern stops being temporary help and becomes part of the family system. This hub helps readers spot that shift without shaming the person who has been trying to hold everything together.",
      },
      {
        heading: "Why this topic brings high-intent search traffic",
        body: "People searching for enabling help are often past the awareness stage. They already feel that something is wrong, but they do not yet trust themselves to change it. That makes this hub one of the strongest entry points for assessments, coaching, family education, and ethical sponsor placements because the reader is actively looking for language and a next step.",
      },
      {
        heading: "The next step this hub should create",
        body: "The goal is not to make readers feel accused. The goal is to help them separate care from rescue, responsibility from control, and compassion from consequence-removal. From here, the best next step is usually the helping-versus-enabling assessment, the family support guide, or a private consult if the family feels stuck or unsafe.",
      },
    ],
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
    searchIntent: "Families trying to set limits with someone who keeps pushing, bargaining, relapsing, or escalating.",
    sponsorCategory: "Boundary coaching, family therapy, family recovery programs, intervention support, and treatment-adjacent education.",
    keyQuestions: [
      "How do I set boundaries with an addicted loved one?",
      "What do I do when my boundary gets broken?",
      "Are boundaries selfish when someone is struggling?",
      "How do I hold a boundary when guilt hits?",
    ],
    guideSections: [
      {
        heading: "Boundaries are about your behavior, not control",
        body: "Families often arrive here believing a boundary means getting their loved one to stop using, stop lying, stop disappearing, or stop hurting people. That framing creates constant failure because the family cannot directly control another person's choices. A usable boundary describes what the family member will do, what they will not do, and what changes when the line is crossed.",
      },
      {
        heading: "Why boundary searches convert",
        body: "Boundary-related searches are practical and urgent. The reader usually needs words, scripts, consequences, and reassurance right now. This makes the hub valuable for internal links to the boundaries course, family coaching, Sober Helpline support, and articles that answer specific long-tail questions.",
      },
      {
        heading: "How to make this hub stronger over time",
        body: "The strongest expansion path is a cluster around adult children, money, housing, relapse, treatment refusal, and returning home after treatment. Each article should answer one concrete boundary problem and link back here so this page becomes the authority center for family addiction boundaries.",
      },
    ],
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
    searchIntent: "Readers who feel over-responsible, exhausted, emotionally fused, or unable to stop monitoring someone else's addiction.",
    sponsorCategory: "Family systems therapy, codependency support, recovery coaching, books, courses, and educational programs.",
    keyQuestions: [
      "Am I codependent with my addicted loved one?",
      "Why do I feel responsible for their choices?",
      "How do I stop over-functioning for someone in addiction?",
      "Can I detach without becoming cold or abandoning them?",
    ],
    guideSections: [
      {
        heading: "Codependency is often a survival strategy",
        body: "Codependency is easy to misunderstand. Most families do not become over-involved because they are weak or controlling. They become over-involved because addiction creates fear, unpredictability, and emotional emergencies that reward constant vigilance. This hub should validate that survival logic while showing the cost of staying there.",
      },
      {
        heading: "The reader is often searching for identity, not just tactics",
        body: "A codependency reader may not be ready to buy intervention services today, but they may be ready to join an email list, take an assessment, read multiple articles, or return repeatedly. That repeat readership matters for traffic growth, newsletter growth, and advertiser value.",
      },
      {
        heading: "Best internal path from this hub",
        body: "The best route is from identity recognition to practical behavior change: read signs of codependency, understand how it develops, learn detachment with love, then move into boundaries or family support. This sequence keeps readers on the site longer while giving them a clearer recovery path.",
      },
    ],
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
    searchIntent: "Families who feel the whole household has reorganized around addiction but cannot yet name the pattern.",
    sponsorCategory: "Family education, family therapy, treatment programs with family tracks, and recovery support services.",
    keyQuestions: [
      "How does addiction affect the whole family?",
      "Why does our home feel organized around one person's addiction?",
      "How do family roles change around substance use?",
      "What should the family work on while someone is in treatment?",
    ],
    guideSections: [
      {
        heading: "Addiction changes the whole system",
        body: "Families often arrive thinking the problem belongs only to the person using substances. In reality, addiction changes communication, trust, money, parenting, sleep, emotional safety, and decision-making across the household. This hub gives readers a system-level lens without making them responsible for causing the addiction.",
      },
      {
        heading: "Why this hub matters for topical authority",
        body: "Family dynamics connects the rest of the site. It links enabling, boundaries, recovery, mental health, treatment, and intervention into one coherent map. Strengthening this hub helps search engines and readers understand that No More Enabling is not a collection of disconnected articles; it is a structured family addiction education library.",
      },
      {
        heading: "Best conversion path",
        body: "Readers here often need orientation before action. Start Here, the family support guide, topic hubs, and Sober Helpline are usually better next steps than immediate intervention language unless risk is escalating.",
      },
    ],
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
    searchIntent: "Families facing treatment refusal, dangerous escalation, repeated relapse, or a sense that informal conversations are no longer enough.",
    sponsorCategory: "Ethical intervention services, treatment navigation, family coaching, and treatment programs.",
    keyQuestions: [
      "When is it time for a professional intervention?",
      "What do we do if someone refuses addiction treatment?",
      "How do we prepare before confronting our loved one?",
      "What is the difference between a family conversation and an intervention?",
    ],
    guideSections: [
      {
        heading: "Intervention searches are high-trust searches",
        body: "A family researching intervention is often scared, ashamed, and worried about doing the wrong thing. This hub should not oversell. It should educate calmly, explain when professional structure helps, and give families a private next step when risk or resistance is rising.",
      },
      {
        heading: "The role of this hub in the business ecosystem",
        body: "This is the cleanest bridge from No More Enabling into Freedom Interventions. The articles should answer early questions and lower fear, while the calls to action should make it easy to request guidance when the family needs more than education.",
      },
      {
        heading: "How to expand the cluster",
        body: "The next articles should focus on treatment refusal, adult children, spouse addiction, safety concerns, intervention preparation, what not to say, and how to align divided family members before a formal process begins.",
      },
    ],
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
    searchIntent: "Families trying to support treatment, early sobriety, relapse response, aftercare, and trust rebuilding without returning to old enabling patterns.",
    sponsorCategory: "Aftercare services, sober living, outpatient care, family recovery programs, recovery coaching, and recovery technology.",
    keyQuestions: [
      "How do I support someone after rehab without enabling?",
      "What should the family do after relapse?",
      "How do we rebuild trust after addiction?",
      "What boundaries matter in early recovery?",
    ],
    guideSections: [
      {
        heading: "Recovery support is different from addiction management",
        body: "Families often breathe out when treatment starts and then quietly recreate the same monitoring patterns in early recovery. Support is not surveillance. It is structure, encouragement, honest communication, and a willingness to let the recovering person carry appropriate responsibility.",
      },
      {
        heading: "Why recovery content has sponsor value",
        body: "Recovery readers are often evaluating aftercare, sober living, outpatient support, coaching, family education, and technology tools. That makes this hub useful for ethical advertisers as long as placements stay transparent and do not imply clinical endorsement.",
      },
      {
        heading: "Best internal path",
        body: "This hub should route readers toward articles on treatment, relapse, trust, aftercare, and FamilyBridge-style accountability. It is also a natural place to point families toward Sober Helpline for ongoing support between crises.",
      },
    ],
  },
];
