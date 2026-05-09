import { blogPostsMeta } from "@/data/blogPostMeta";
import { topicHubs } from "@/data/topicHubs";
import { supportOffers } from "@/data/supportOffers";
import { commercialIntentPages } from "@/data/commercialIntentPages";
import { glossaryTermPaths } from "@/data/aeoAnswers";

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
  "/answers",
  "/enabling-answer-center",
  "/glossary",
  "/family-situation-assessment",
  "/topic-hubs",
  "/work-with-matt",
  "/privacy",
  "/terms",
  "/cookies",
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

export const prerenderRoutes = [...staticRoutes, ...glossaryTermPaths, ...commercialIntentRoutes, ...categoryRoutes, ...articleRoutes, ...topicHubRoutes, ...supportRoutes];
