import { parseYearParam } from "@/lib/content/eras";
import { normalizePath } from "@/lib/basePath";

/** Page title shown in the window's title bar, derived from the path. */
export function titleForPath(rawPath: string): string {
  const pathname = normalizePath(rawPath);
  if (pathname === "/") return "Ethan Goldstein — Archive";
  if (pathname.startsWith("/year/")) {
    const y = parseYearParam(pathname.split("/")[2]);
    return y ? `${y} — Ethan Goldstein Archive` : "Not found — Ethan Goldstein Archive";
  }
  const map: Record<string, string> = {
    "/timeline": "Timeline — Ethan Goldstein Archive",
    "/search": "Find — Ethan Goldstein Archive",
    "/about": "About This Computer",
    "/random": "Random Memory…",
    "/backyard": "backyard.exe",
    "/stats": "My Life in Data — Ethan Goldstein Archive",
    "/map": "Memory Map — Ethan Goldstein Archive",
  };
  // every real route is listed above, so anything else is the 404 page (the static 404 is rendered at /_not-found)
  return map[pathname] ?? "Not found — Ethan Goldstein Archive";
}

export const HOST = "ethan.goldstein";

export function addressForPath(rawPath: string): string {
  const pathname = normalizePath(rawPath);
  return `http://${HOST}${pathname === "/" ? "" : pathname}`;
}

/** Turns whatever was typed in the address bar into a path, or null to fall back to search. */
export function resolveAddress(input: string): string | null {
  let s = input.trim();
  if (!s) return null;
  s = s.replace(/^https?:\/\//i, "").replace(new RegExp(`^${HOST}`), "");
  if (/^\d{4}$/.test(s)) return parseYearParam(s) ? `/year/${s}` : null;
  if (!s.startsWith("/")) s = `/${s}`;
  s = normalizePath(s);
  const known = ["/timeline", "/search", "/about", "/random", "/backyard", "/stats", "/map", "/"];
  if (known.includes(s)) return s;
  const m = s.match(/^\/year\/(\d{4})$/);
  if (m) return parseYearParam(m[1]) ? s : null;
  return null;
}
