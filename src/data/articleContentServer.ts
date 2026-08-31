type ArticleContentModule = { default: string };

const modules = import.meta.glob<ArticleContentModule>("./article-content/*.ts", {
  eager: true,
});

export const articleContentBySlug: Record<string, string> = Object.fromEntries(
  Object.entries(modules).map(([modulePath, module]) => {
    const slug = modulePath.replace("./article-content/", "").replace(/\.ts$/, "");
    return [slug, module.default];
  }),
);

articleContentBySlug["codependency-spouses-parents-siblings-addiction"] =
  articleContentBySlug["codependency-spouses-parents-siblings"];

export const getServerArticleContent = (slug: string | undefined) =>
  slug ? articleContentBySlug[slug] ?? null : null;
