import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { AppRoutes, AppShell } from "./App";
import { ArticleContentContext, type InitialArticleContent } from "./lib/articleContentContext";
import { articleContentBySlug } from "./data/articleContentServer";

const getInitialArticleContent = (url: string): InitialArticleContent | null => {
  const pathname = url.split("?")[0].replace(/\/+$/, "") || "/";
  const match = pathname.match(/^\/articles\/([^/]+)$/);
  if (!match) return null;

  const slug = decodeURIComponent(match[1]);
  const content = articleContentBySlug[slug];
  return content ? { slug, content } : null;
};

export const render = (url: string) => {
  const initialArticleContent = getInitialArticleContent(url);

  const html = renderToString(
    <ArticleContentContext.Provider value={initialArticleContent}>
      <AppShell router={<StaticRouter location={url}><AppRoutes /></StaticRouter>} />
    </ArticleContentContext.Provider>,
  );

  const helmet = Helmet.renderStatic();

  return {
    html,
    head: [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString(),
    ].join("\n"),
  };
};
