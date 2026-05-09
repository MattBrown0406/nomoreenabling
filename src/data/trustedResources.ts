export interface TrustedResource {
  id: string;
  title: string;
  organization: string;
  description: string;
  href: string;
  tags: string[];
}

export const trustedResources: TrustedResource[] = [
  {
    id: "samhsa-national-helpline",
    title: "National Helpline",
    organization: "SAMHSA",
    description: "Treatment referral and information for individuals and families facing mental health or substance use concerns.",
    href: "https://www.samhsa.gov/find-help/national-helpline",
    tags: ["treatment", "family", "support", "refuses", "rehab", "intervention", "coaching"],
  },
  {
    id: "findtreatment",
    title: "FindTreatment.gov",
    organization: "SAMHSA",
    description: "Federal treatment locator for substance use and mental health services in the United States.",
    href: "https://findtreatment.gov/",
    tags: ["treatment", "rehab", "refuses", "intervention", "family"],
  },
  {
    id: "cdc-overdose-response",
    title: "What to Do If You Think Someone Is Overdosing",
    organization: "CDC",
    description: "Emergency overdose response guidance, including recognizing overdose and using naloxone.",
    href: "https://www.cdc.gov/stop-overdose/response/index.html",
    tags: ["overdose", "opioid", "fentanyl", "drugs", "safety", "crisis", "house"],
  },
  {
    id: "fda-naloxone",
    title: "Access to Naloxone Can Save a Life",
    organization: "FDA",
    description: "Consumer guidance on naloxone access and why families and caregivers may need to recognize overdose signs.",
    href: "https://www.fda.gov/consumers/consumer-updates/access-naloxone-can-save-life-during-opioid-overdose",
    tags: ["naloxone", "overdose", "opioid", "drugs", "safety", "crisis"],
  },
  {
    id: "niaaa-aud",
    title: "Alcohol Use Disorder",
    organization: "NIAAA",
    description: "Research-based overview of alcohol use disorder, risk, diagnosis, treatment, and recovery.",
    href: "https://www.niaaa.nih.gov/health-professionals-communities/core-resource-on-alcohol/alcohol-use-disorder-risk-diagnosis-recovery",
    tags: ["alcohol", "drinking", "spouse", "parent", "withdrawal"],
  },
  {
    id: "lifeline-988",
    title: "What to Expect When You Contact 988",
    organization: "988 Suicide & Crisis Lifeline",
    description: "What happens when someone calls, texts, or chats with 988 for suicide, mental health, or emotional crisis support.",
    href: "https://988lifeline.org/get-help/what-to-expect/",
    tags: ["crisis", "safety", "suicide", "danger", "violence", "emergency"],
  },
];

export const getTrustedResourcesForTags = (tags: string[], limit = 3) => {
  const normalizedTags = tags.map((tag) => tag.toLowerCase());

  return trustedResources
    .map((resource) => ({
      resource,
      score: resource.tags.reduce(
        (total, tag) => total + (normalizedTags.some((answerTag) => answerTag.includes(tag) || tag.includes(answerTag)) ? 1 : 0),
        0,
      ),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ resource }) => resource)
    .slice(0, limit);
};
