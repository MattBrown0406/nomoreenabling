const NOINDEX_ROUTES = new Set([
  "/admin",
  "/the-mirror/embed",
]);

const normalizePath = (pathname: string) => {
  if (!pathname || pathname === "/") return "/";
  return pathname.replace(/\/+$/, "");
};

export function isNoIndexRoute(pathname: string): boolean {
  return NOINDEX_ROUTES.has(normalizePath(pathname));
}
