import { blogPosts } from "@/data/blogPosts";

const staticRoutes = [
  "/",
  "/about",
  "/articles",
  "/advertise",
  "/family-support-guide",
  "/helping-or-enabling",
  "/professional-guidance-signs",
  "/why-families-need-support",
  "/grounding-reminder",
  "/family-system-notes",
  "/boundaries-course",
  "/privacy",
  "/terms",
  "/cookies",
];

const categoryRoutes = Array.from(
  new Set(
    blogPosts.flatMap((post) => post.categories).map((category) =>
      `/category/${category.toLowerCase().replace(/\s+/g, "-")}`,
    ),
  ),
).sort();

const articleRoutes = blogPosts.map((post) => `/articles/${post.slug}`);

export const prerenderRoutes = [...staticRoutes, ...categoryRoutes, ...articleRoutes];
