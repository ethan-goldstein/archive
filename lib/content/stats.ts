import { getAllYears } from "./getYear";
import { isPlaceholder } from "./placeholders";
import { ERAS } from "./eras";

export interface ArchiveStats {
  years: number;
  memories: number;
  photos: number;
  tracks: number;
  milestones: number;
  interests: number;
  culturalNotes: number;
  slotsLeft: number;
  filledYears: number;
  mostDocumented: { year: number; count: number } | null;
  topTags: { tag: string; count: number }[];
  byEra: { id: string; name: string; from: number; to: number; culture: number; personal: number; slots: number }[];
  perYear: { year: number; personal: number; culture: number; slots: number }[];
}

/** Only counts what is actually in the content files; placeholders are reported as slots, not content. */
export function computeStats(): ArchiveStats {
  const years = getAllYears();
  const tagCount = new Map<string, number>();
  let memories = 0, photos = 0, tracks = 0, milestones = 0, interests = 0, culturalNotes = 0, slotsLeft = 0;
  const perYear = years.map((y) => {
    const p = y.personal;
    const real = <T,>(arr: Array<T | { placeholder: true }>) => arr.filter((x) => !isPlaceholder(x)).length;
    const m = real(p.memories), ph = real(p.photos), t = real(p.music), ms = real(p.milestones), it = real(p.interests) + real(p.onMyScreen) + real(p.tech);
    memories += m; photos += ph; tracks += t; milestones += ms; interests += it;
    const c = y.culture;
    const cul = c.internet.length + c.tech.length + c.games.length + c.onScreen.length + c.music.length + c.culture.length + c.capsule.length;
    culturalNotes += cul;
    slotsLeft += y.placeholderCount;
    y.tags.forEach((tag) => tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1));
    return { year: y.year, personal: m + ph + t + ms + it, culture: cul, slots: y.placeholderCount };
  });
  const documented = [...perYear].sort((a, b) => b.personal - a.personal)[0];
  const byEra = ERAS.map((e) => {
    const rows = perYear.filter((r) => r.year >= e.from && r.year <= e.to);
    return { id: e.id, name: e.name, from: e.from, to: e.to, culture: rows.reduce((n, r) => n + r.culture, 0), personal: rows.reduce((n, r) => n + r.personal, 0), slots: rows.reduce((n, r) => n + r.slots, 0) };
  });
  return {
    years: years.length, memories, photos, tracks, milestones, interests, culturalNotes, slotsLeft,
    filledYears: perYear.filter((r) => r.personal > 0).length,
    mostDocumented: documented && documented.personal > 0 ? { year: documented.year, count: documented.personal } : null,
    topTags: [...tagCount].map(([tag, count]) => ({ tag, count })).sort((a, b) => b.count - a.count).slice(0, 8),
    byEra, perYear,
  };
}
