import { blogPostsMeta } from "@/data/blogPostMeta";
import { topicHubs } from "@/data/topicHubs";
import { supportOffers } from "@/data/supportOffers";
import { commercialIntentPages } from "@/data/commercialIntentPages";
import { answerDetailPaths, glossaryTermPaths } from "@/data/aeoAnswers";
import { legacyArticleSlugRedirects, legacyPageRedirects } from "@/lib/legacyRedirects";

const staticRoutes = [
  "/",
  "/about",
  "/articles",
  "/advertise",
  "/advertise/media-kit",
  "/family-support-guide",
  "/helping-or-enabling",
  "/professional-guidance-signs",
  "/why-families-need-support",
  "/grounding-reminder",
  "/family-system-notes",
  "/boundaries-course",
  "/start-here",
  "/two-households",
  "/answers",
  "/enabling-answer-center",
  "/glossary",
  "/the-mirror",
  "/family-situation-assessment",
  "/topic-hubs",
  "/work-with-matt",
  "/trusted-tools",
  "/enabling-cost-calculator",
  "/tools",
  "/press",
  "/privacy",
  "/terms",
  "/cookies",
  "/admin",
  "/the-mirror/embed",
  "/404",
];

const categoryRoutes = Array.from(
  new Set(
    blogPostsMeta.flatMap((post) => post.categories).map((category) =>
      `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
    ),
  ),
).sort();

const articleRoutes = blogPostsMeta.map((post) => `/articles/${post.slug}`);
const topicHubRoutes = topicHubs.map((hub) => `/topic-hubs/${hub.slug}`);
const supportRoutes = supportOffers.map((offer) => `/support/${offer.slug}`);
const commercialIntentRoutes = commercialIntentPages.map((page) => `/${page.slug}`);

export const prerenderRoutes = [...staticRoutes, ...answerDetailPaths, ...glossaryTermPaths, ...commercialIntentRoutes, ...categoryRoutes, ...articleRoutes, ...topicHubRoutes, ...supportRoutes];

export const prerenderAliases: Record<string, string> = {
  ...legacyPageRedirects,
  ...Object.fromEntries(
    blogPostsMeta.flatMap((post) => [
      [`/article/${post.slug}`, `/articles/${post.slug}`],
      [`/blog/${post.slug}`, `/articles/${post.slug}`],
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(legacyArticleSlugRedirects).flatMap(([from, to]) => [
      [`/article/${from}`, `/articles/${to}`],
      [`/blog/${from}`, `/articles/${to}`],
    ]),
  ),
};
