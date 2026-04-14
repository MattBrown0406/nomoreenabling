import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from "react-helmet";
import { AppRoutes, AppShell } from "./App";

export const render = (url: string) => {
  const html = renderToString(
    <AppShell router={<StaticRouter location={url}><AppRoutes /></StaticRouter>} />,
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
