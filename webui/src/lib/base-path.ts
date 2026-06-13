/**
 * Resolve the URL path prefix the WebUI is currently served under.
 *
 * Under Home Assistant Ingress the app is served at
 * `/api/hassio_ingress/<token>/`, and every absolute request the browser issues
 * (REST, WebSocket, static assets) must include that prefix — HA strips it
 * again before proxying to the add-on's ingress port. When the WebUI is opened
 * directly (native deployment, `:8765`) or via the Vite dev server, there is no
 * prefix and this returns `""`, so non-ingress behaviour is unchanged.
 *
 * The app has no client-side router that rewrites `pathname`, so reading it is
 * stable for the lifetime of the page.
 */
export function getBasePath(): string {
  if (typeof window === "undefined") return "";
  const match = window.location.pathname.match(
    /^(.*\/api\/hassio_ingress\/[^/]+)(?:\/|$)/,
  );
  return match ? match[1] : "";
}
