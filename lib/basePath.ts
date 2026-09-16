/**
 * Base path support for static hosting under a sub-path (GitHub Pages project site).
 * next/link and the router add it automatically; raw <img>, next/image src, CSS urls and
 * history.pushState do not, so those go through these helpers.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefix a public asset path: asset("/game/field.png") */
export function asset(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//")) return path;
  return `${BASE_PATH}${path}`;
}

/** "/timeline/" -> "/timeline"; "/" stays "/". Static exports use trailing slashes. */
export function normalizePath(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

/** Turn a window.location.pathname into an app path without the base. */
export function stripBase(pathname: string): string {
  if (BASE_PATH && pathname.startsWith(BASE_PATH)) {
    const rest = pathname.slice(BASE_PATH.length);
    return normalizePath(rest || "/");
  }
  return normalizePath(pathname);
}
