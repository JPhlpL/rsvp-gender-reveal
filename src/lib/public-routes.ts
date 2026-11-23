/** Pages anyone can open without signing in. Everything else needs an admin session. */
export const PUBLIC_ROUTES = ["/login", "/rsvp", "/invitation", "/opengraph-image"] as const;

/** True for a public route itself or any path below it (whole segments only). */
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
