import type { EraId } from "./schema";

export const FIRST_YEAR = 2005;
export const LAST_YEAR = 2026;
export const YEARS: number[] = Array.from(
  { length: LAST_YEAR - FIRST_YEAR + 1 },
  (_, i) => FIRST_YEAR + i,
);

export interface EraMeta {
  id: EraId;
  name: string;
  from: number;
  to: number;
  tagline: string;
  /** Representative palette used by the scrubber for continuous interpolation. */
  palette: { bg: string; fg: string; accent: string; accent2: string; glow: string };
}

export const ERAS: EraMeta[] = [
  {
    id: "xp", name: "The Desktop Years", from: 2005, to: 2008,
    tagline: "Glossy blue, grass green, and a CRT hum.",
    palette: { bg: "#3a6ea5", fg: "#f4f1e6", accent: "#6cb33f", accent2: "#f7a11a", glow: "#8fc9ff" },
  },
  {
    id: "aero", name: "The Gloss Years", from: 2009, to: 2012,
    tagline: "Aqua highlights, black glass, brushed aluminium.",
    palette: { bg: "#0d1b2a", fg: "#eef6ff", accent: "#39c3f2", accent2: "#a5c8ff", glow: "#5ad6ff" },
  },
  {
    id: "flat", name: "The Flat Years", from: 2013, to: 2016,
    tagline: "Navy dashboards and colour that never stopped.",
    palette: { bg: "#1c2e4a", fg: "#ffffff", accent: "#ff6b6b", accent2: "#ffb347", glow: "#ff8fa3" },
  },
  {
    id: "dark", name: "The Streaming Years", from: 2017, to: 2020,
    tagline: "Charcoal, neon green, everything in a queue.",
    palette: { bg: "#121212", fg: "#f2f2f2", accent: "#1ed760", accent2: "#b388ff", glow: "#4dffa0" },
  },
  {
    id: "glass", name: "The Glass Years", from: 2021, to: 2026,
    tagline: "Black, graphite, white, and quiet depth.",
    palette: { bg: "#0a0a0b", fg: "#fafafa", accent: "#7cb7ff", accent2: "#c9c9d1", glow: "#9cc8ff" },
  },
];

export function eraForYear(year: number): EraMeta {
  const era = ERAS.find((e) => year >= e.from && year <= e.to);
  if (!era) throw new Error(`No era for year ${year}`);
  return era;
}

export function eraById(id: EraId): EraMeta {
  return ERAS.find((e) => e.id === id)!;
}

export function isArchiveYear(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= FIRST_YEAR && value <= LAST_YEAR;
}

export function parseYearParam(param: string | undefined): number | null {
  if (!param || !/^\d{4}$/.test(param)) return null;
  const year = Number(param);
  return isArchiveYear(year) ? year : null;
}

export function clampYear(year: number): number {
  return Math.min(LAST_YEAR, Math.max(FIRST_YEAR, Math.round(year)));
}
