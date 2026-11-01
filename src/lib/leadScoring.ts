export interface LeadScoreInput {
  source?: string;
  relationship?: string;
  concern?: string;
  treatmentHistory?: string;
  urgency?: string;
  message?: string;
  leadIntent?: string;
  pagePath?: string;
}

export interface LeadScoreResult {
  score: number;
  tier: "priority" | "warm" | "nurture";
  reasons: string[];
}

// Match terms at the start of a word so "rent" doesn't fire on "parent" or
// "son" on "person"/"reason"/"lesson" (plurals like "sons" still match).
// No lookbehind: Safari < 16.4 throws a SyntaxError constructing it.
const escapeRegExp = (term: string) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const includesAny = (value: string, terms: string[]) =>
  terms.some((term) => new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(term)}`).test(value));

export const scoreLead = (input: LeadScoreInput): LeadScoreResult => {
  const haystack = [
    input.source,
    input.relationship,
    input.concern,
    input.treatmentHistory,
    input.urgency,
    input.message,
    input.leadIntent,
    input.pagePath,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  let score = 20;
  const reasons: string[] = [];

  if (includesAny(haystack, ["safety", "unsafe", "violence", "threat", "911", "overdose", "suicide", "self-harm", "driving"])) {
    score += 35;
    reasons.push("Safety or crisis language");
  }

  if (includesAny(haystack, ["intervention", "refuses", "refusal", "refuse", "won't go", "will not go", "treatment resistance"])) {
    score += 25;
    reasons.push("Treatment refusal or intervention intent");
  }

  if (includesAny(haystack, ["adult child", "son", "daughter", "spouse", "husband", "wife", "partner"])) {
    score += 12;
    reasons.push("Close family decision-maker");
  }

  if (includesAny(haystack, ["relapse", "rehab", "detox", "treatment", "outpatient", "sober living"])) {
    score += 10;
    reasons.push("Treatment history or recovery transition");
  }

  if (includesAny(haystack, ["money", "rent", "bills", "housing", "legal", "stealing", "theft"])) {
    score += 10;
    reasons.push("Consequences affecting money, housing, or safety");
  }

  if (includesAny(haystack, ["getting worse", "soon", "urgent", "escalating", "considering a professional intervention"])) {
    score += 10;
    reasons.push("Time-sensitive language");
  }

  if (includesAny(haystack, ["consultation", "work-with-matt", "intervention-help", "alcohol-intervention", "family-addiction-consultation"])) {
    score += 8;
    reasons.push("High-intent page source");
  }

  const normalizedScore = Math.max(0, Math.min(score, 100));
  const tier = normalizedScore >= 70 ? "priority" : normalizedScore >= 45 ? "warm" : "nurture";

  return {
    score: normalizedScore,
    tier,
    reasons: reasons.length ? reasons.slice(0, 4) : ["General family support request"],
  };
};
