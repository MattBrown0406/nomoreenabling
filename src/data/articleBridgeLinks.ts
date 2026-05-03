export interface ArticleBridgeLink {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  intent: string;
}

const bridgeLinks: ArticleBridgeLink[] = [
  {
    slug: "what-to-do-when-someone-refuses-rehab",
    eyebrow: "Live family support",
    title: "If treatment refusal has the family stuck, bring it to Family Squares.",
    description:
      "Use this article to get oriented, then join a live family support conversation before another high-pressure talk turns into the same fight.",
    ctaLabel: "Go to the Sober Helpline bridge",
    intent: "treatment_refusal",
  },
  {
    slug: "loved-one-refuses-addiction-treatment",
    eyebrow: "Next step after refusal",
    title: "Do not carry treatment refusal alone.",
    description:
      "When someone keeps saying no, the family needs calm outside structure. Sober Helpline is the support lane for families who need a live place to start.",
    ctaLabel: "Open the live support lane",
    intent: "treatment_refusal",
  },
  {
    slug: "when-is-an-addiction-intervention-necessary",
    eyebrow: "Before you stage an intervention",
    title: "Talk through the family pattern before forcing the next move.",
    description:
      "If the situation may require an intervention, use Family Squares as a lower-friction first step for clarity, language, and support.",
    ctaLabel: "Start with Sober Helpline",
    intent: "intervention",
  },
  {
    slug: "addiction-treatment-refusal-family-plan",
    eyebrow: "Family plan support",
    title: "Turn the plan into a supported next step.",
    description:
      "A written plan helps, but families usually need accountability and steadier voices around it. The Sober Helpline bridge gives you that next step.",
    ctaLabel: "Get live family support",
    intent: "family_plan",
  },
  {
    slug: "when-is-it-time-for-a-professional-intervention",
    eyebrow: "Intervention decision point",
    title: "Use live support before the family commits to an intervention.",
    description:
      "If you are weighing whether this has become intervention-level, route the question through a live support setting before you act under pressure.",
    ctaLabel: "Open the bridge to Sober Helpline",
    intent: "intervention",
  },
  {
    slug: "how-to-stop-enabling-adult-child-addiction",
    eyebrow: "Parent support lane",
    title: "Parents need support that does not collapse into rescue.",
    description:
      "When the pattern involves an adult child, isolation and guilt can drive the next bad yes. Family Squares gives parents a steadier place to sort the next step.",
    ctaLabel: "Join the family support path",
    intent: "adult_child",
  },
  {
    slug: "should-i-let-addicted-adult-child-live-at-home",
    eyebrow: "Housing boundary support",
    title: "Before the next housing decision, get outside structure.",
    description:
      "Living arrangements can become the whole battlefield. Use the Sober Helpline bridge to talk through what support, safety, and boundaries need to look like.",
    ctaLabel: "Talk through the next step",
    intent: "adult_child_housing",
  },
  {
    slug: "when-adult-child-refuses-addiction-treatment",
    eyebrow: "Treatment refusal support",
    title: "Parents do not have to keep negotiating alone.",
    description:
      "When an adult child refuses treatment, the next family move needs to be clear and supported. Sober Helpline gives families a live place to begin.",
    ctaLabel: "Open Sober Helpline",
    intent: "adult_child_refusal",
  },
  {
    slug: "what-to-do-when-addicted-loved-one-breaks-boundaries",
    eyebrow: "Boundary support",
    title: "If boundaries keep breaking, bring the pattern into support.",
    description:
      "Reading helps name the pattern. Live family support helps you decide what you will actually hold when pressure returns.",
    ctaLabel: "Get support around the boundary",
    intent: "boundaries",
  },
  {
    slug: "maintaining-boundaries-addicted-loved-one",
    eyebrow: "Boundary follow-through",
    title: "Do not make the boundary alone and then defend it alone.",
    description:
      "The hard part is not knowing the boundary. It is holding it when guilt, fear, anger, and hope all show up at once.",
    ctaLabel: "Use the live support lane",
    intent: "boundaries",
  },
  {
    slug: "codependency-signs-loved-one-addiction",
    eyebrow: "Codependency support",
    title: "If this sounds familiar, get support before shame takes over.",
    description:
      "Codependency patterns are easier to change when the family has language, support, and a next step that is not another rescue.",
    ctaLabel: "Start the support bridge",
    intent: "codependency",
  },
  {
    slug: "helping-starts-hurting-enabling-addiction",
    eyebrow: "Helping vs enabling",
    title: "When helping starts hurting, the family needs a new room.",
    description:
      "If support has turned into exhaustion, Sober Helpline gives families a live place to slow the pattern down and choose the next move.",
    ctaLabel: "Open Family Squares support",
    intent: "enabling",
  },
  {
    slug: "enabling-vs-helping-stop-enabling-support-real-recovery",
    eyebrow: "Next step for families",
    title: "Move from insight into supported action.",
    description:
      "The difference between helping and enabling becomes clearer when the family is not trying to decide everything in crisis mode.",
    ctaLabel: "Continue with Sober Helpline",
    intent: "enabling",
  },
  {
    slug: "how-to-stop-enabling-an-addict",
    eyebrow: "Support that does not rescue",
    title: "Stopping enabling is easier with outside support.",
    description:
      "Use the article for clarity, then use the Sober Helpline bridge for a live next step that keeps the family from slipping back into the old pattern.",
    ctaLabel: "Go to Sober Helpline",
    intent: "enabling",
  },
  {
    slug: "living-with-an-alcoholic-spouse",
    eyebrow: "Partner support",
    title: "When addiction is inside the relationship, do not sort it alone.",
    description:
      "A spouse or partner situation carries emotional, financial, and safety pressure. Family Squares gives you a supported place to talk through the next step.",
    ctaLabel: "Find live family support",
    intent: "spouse_alcohol",
  },
  {
    slug: "family-intervention-for-alcoholism",
    eyebrow: "Alcohol intervention support",
    title: "Before the family pushes harder, get the room steadier.",
    description:
      "Alcohol interventions can go sideways when the family is divided or exhausted. Use Sober Helpline as a first support lane.",
    ctaLabel: "Open the support bridge",
    intent: "alcohol_intervention",
  },
  {
    slug: "how-to-stop-enabling-an-alcoholic",
    eyebrow: "Alcohol family support",
    title: "If alcohol keeps getting minimized, bring the pattern into support.",
    description:
      "Families often need help naming what is real without escalating every conversation. Sober Helpline gives you a live place to begin.",
    ctaLabel: "Start with live support",
    intent: "alcohol_enabling",
  },
  {
    slug: "loved-one-using-drugs-in-my-house",
    eyebrow: "Household safety support",
    title: "If use is happening in the home, get supported before the next confrontation.",
    description:
      "Household drug use can involve safety, boundaries, children, money, and fear. Bring the question into a live support lane before making the next move alone.",
    ctaLabel: "Open Sober Helpline support",
    intent: "household_safety",
  },
  {
    slug: "addicted-loved-one-stealing-from-you",
    eyebrow: "Theft and boundaries",
    title: "When stealing enters the pattern, the family needs outside structure.",
    description:
      "This is not just a money issue. It is a safety, trust, and boundary issue that is easier to face with support around the family.",
    ctaLabel: "Use the live support bridge",
    intent: "theft_boundaries",
  },
  {
    slug: "addiction-threats-violence-home",
    eyebrow: "Safety first",
    title: "If threats or violence are present, do not rely on a website alone.",
    description:
      "If anyone is in immediate danger, call emergency services. For non-immediate family support, use Sober Helpline as a calmer next step after safety is addressed.",
    ctaLabel: "Find family support",
    intent: "safety",
  },
];

const bridgeLinkBySlug = new Map(bridgeLinks.map((link) => [link.slug, link]));

export const buildSoberHelplineBridgeUrl = (slug: string, source = "article_bridge") => {
  const params = new URLSearchParams({
    utm_source: "nomoreenabling",
    utm_medium: source,
    utm_campaign: "soberhelpline_bridge",
    utm_content: slug,
  });

  return `https://soberhelpline.com/from-no-more-enabling?${params.toString()}`;
};

export const getArticleBridgeLink = (slug?: string | null) => {
  if (!slug) return null;
  return bridgeLinkBySlug.get(slug) ?? null;
};

export const articleBridgeLinks = bridgeLinks;
