import type { Memory, Milestone, Photo, Placeholder, Track, Video, YearData } from "./schema";
import { isPlaceholder } from "./placeholders";

/** The year as Ethan feels it: winter (his birthday), spring (baseball), summer (the pool), fall (the best one). */
export const SEASONS = ["winter", "spring", "summer", "fall"] as const;
export type Season = (typeof SEASONS)[number];

export const SEASON_META: Record<Season, { label: string; months: string; tagline: string; beat: string }> = {
  winter: { label: "Winter", months: "Dec – Feb", tagline: "Chill.", beat: "The birthday month. Snow on the street, warm windows, the year still new." },
  spring: { label: "Spring", months: "Mar – May", tagline: "Baseball.", beat: "Diamonds drying out, the first catch of the year, the season starting." },
  summer: { label: "Summer", months: "Jun – Aug", tagline: "Living.", beat: "The pool, the basement, long light, nowhere to be." },
  fall: { label: "Fall", months: "Sep – Nov", tagline: "The best one.", beat: "New grade, Halloween, leaves on the lawn, the good hoodie weather." },
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

/** 1–12 → season. */
export function seasonOfMonth(month: number): Season {
  if (month === 12 || month <= 2) return "winter";
  if (month <= 5) return "spring";
  if (month <= 8) return "summer";
  return "fall";
}

/** Reads a month out of "2009-02-10", "2016-06", "June 2012", "Oct 2019"; null when there is none. */
export function seasonOfDate(date?: string): Season | null {
  if (!date) return null;
  const iso = /^\d{4}-(\d{1,2})/.exec(date.trim());
  if (iso) {
    const m = Number(iso[1]);
    return m >= 1 && m <= 12 ? seasonOfMonth(m) : null;
  }
  const lower = date.toLowerCase();
  const idx = MONTHS.findIndex((m) => new RegExp(`\\b${m}[a-z]*\\b`).test(lower));
  return idx >= 0 ? seasonOfMonth(idx + 1) : null;
}

type Entry<T> = T | Placeholder;

/**
 * Splits one array by season. Dated entries follow their month. Undated real entries go to
 * `fallback` (fall by default, Ethan's season). Placeholders are dealt round-robin so every
 * chapter shows a slot to fill instead of one chapter hoarding them all.
 */
export function splitBySeason<T>(entries: Entry<T>[], dateOf: (e: T) => string | undefined, fallback: Season | "spread" = "fall"): Record<Season, Entry<T>[]> {
  const out: Record<Season, Entry<T>[]> = { winter: [], spring: [], summer: [], fall: [] };
  let slot = 0;
  let spread = 0;
  for (const e of entries) {
    if (isPlaceholder(e)) {
      out[SEASONS[slot++ % 4]].push(e);
      continue;
    }
    const s = seasonOfDate(dateOf(e));
    if (s) out[s].push(e);
    else if (fallback === "spread") out[SEASONS[spread++ % 4]].push(e);
    else out[fallback].push(e);
  }
  return out;
}

export interface SeasonSlice {
  season: Season;
  data: YearData;
  /** true when the personal arrays that vary by season are all empty (no real entries, no slots). */
  quiet: boolean;
}

/** One YearData per season with the personal arrays filtered; modules render it unchanged. */
export function sliceSeasons(data: YearData): Record<Season, SeasonSlice> {
  const p = data.personal;
  const memories = splitBySeason<Memory>(p.memories, (m) => m.date, "fall");
  const photos = splitBySeason<Photo>(p.photos, (x) => x.takenAt, "spread");
  const videos = splitBySeason<Video>(p.videos, (x) => x.takenAt, "summer");
  const milestones = splitBySeason<Milestone>(p.milestones, (m) => m.date, "fall");
  // Music lives in winter unless a track names its season (the fall and summer playlists do).
  const music: Record<Season, Entry<Track>[]> = { winter: [], spring: [], summer: [], fall: [] };
  for (const t of p.music) music[!isPlaceholder(t) && t.season ? t.season : "winter"].push(t);
  const out = {} as Record<Season, SeasonSlice>;
  for (const s of SEASONS) {
    const personal = { ...p, memories: memories[s], photos: photos[s], videos: videos[s], milestones: milestones[s], music: music[s] };
    const quiet = [personal.memories, personal.photos, personal.videos, personal.milestones].every((a) => a.length === 0);
    out[s] = { season: s, data: { ...data, personal }, quiet };
  }
  return out;
}
