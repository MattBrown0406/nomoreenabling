// Keep retired article URLs useful for readers and search engines while the
// canonical article collection lives under /articles/:slug.
export const legacyArticleSlugRedirects: Record<string, string> = {
  "addiction-family-communication": "addiction-reshapes-family-communication",
  "addiction-changes-communication": "addiction-changes-family-communication",
  "codependency-endurance-love": "families-confuse-endurance-with-love-codependency",
  "emotional-distance-families-help": "emotional-distance-before-families-seek-help",
  "families-lose-themselves-helping": "families-lose-themselves-trying-to-help",
  "peacekeeping-self-sacrifice": "enabling-hides-behind-good-intentions",
  "letting-go-control-abandonment": "letting-go-control-feels-like-abandonment",
  "enabling-peacekeeping": "enabling-masquerades-as-peacekeeping",
  "keeping-peace-addiction": "keeping-peace-teaches-addiction-to-stay",
  "letting-go-not-abandonment": "letting-go-is-not-abandonment",
  "caved-on-boundary-how-to-reset-addiction-family": "what-to-do-when-addicted-loved-one-breaks-boundaries",
  "guilt-after-setting-boundaries-addicted-loved-one": "guilt-after-holding-boundary-addicted-loved-one",
  "what-is-enabling-in-addiction": "how-to-stop-enabling-an-addict",
};

export const legacyPageRedirects: Record<string, string> = {
  "/split-house": "/two-households",
  "/divorced-parents": "/two-households",
  "/are-you-an-enabler": "/helping-or-enabling",
  "/help-an-addict": "/family-support-guide",
  "/enabling-after-treatment": "/articles/hidden-role-enabling-addiction",
  "/powerlessness": "/articles/letting-go-without-collapse",
  "/forgiveness-in-addiction": "/articles/family-trauma-after-addiction",
  "/how-to-support-someone-in-drug-rehab": "/family-support-guide",
  "/author/rzimmers": "/about",
  "/author/ericbutton": "/about",
  "/providers": "/advertise",
  "/detaching-with-love-addiction-family": "/articles/detaching-with-love-addiction-family",
  "/enabling-cycle-addiction-families": "/articles/enabling-cycle-addiction-families",
  "/how-to-set-boundaries-with-addicted-loved-one": "/articles/how-to-set-boundaries-with-addicted-loved-one",
  "/what-is-enabling-in-addiction": "/articles/how-to-stop-enabling-an-addict",

  "/articles/addiction-family-communication": "/articles/addiction-reshapes-family-communication",
  "/articles/addiction-changes-communication": "/articles/addiction-changes-family-communication",
  "/articles/codependency-endurance-love": "/articles/families-confuse-endurance-with-love-codependency",
  "/articles/emotional-distance-families-help": "/articles/emotional-distance-before-families-seek-help",
  "/articles/families-lose-themselves-helping": "/articles/families-lose-themselves-trying-to-help",
  "/articles/peacekeeping-self-sacrifice": "/articles/enabling-hides-behind-good-intentions",
  "/articles/letting-go-control-abandonment": "/articles/letting-go-control-feels-like-abandonment",
  "/articles/enabling-peacekeeping": "/articles/enabling-masquerades-as-peacekeeping",
  "/articles/keeping-peace-addiction": "/articles/keeping-peace-teaches-addiction-to-stay",
  "/articles/letting-go-not-abandonment": "/articles/letting-go-is-not-abandonment",
};

export const resolveLegacyArticleSlug = (slug: string) =>
  legacyArticleSlugRedirects[slug] || slug;
