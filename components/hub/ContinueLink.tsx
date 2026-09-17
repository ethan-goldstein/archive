"use client";

import { useSyncExternalStore } from "react";
import { YearLink } from "./YearLink";
import { parseYearParam } from "@/lib/content/eras";

const noop = () => () => {};
const read = () => { try { return localStorage.getItem("archive:last-year"); } catch { return null; } };

/** "Continue in 2014", shown only to someone who has been here before. */
export function ContinueLink() {
  const raw = useSyncExternalStore(noop, read, () => null);
  const year = raw ? parseYearParam(raw) : null;
  if (!year) return null;
  return <YearLink year={year} className="btn-ghost">Continue in {year}</YearLink>;
}
