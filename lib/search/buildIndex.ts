import { getAllYears } from "@/lib/content/getYear";
import { isPlaceholder } from "@/lib/content/placeholders";
import type { IconName } from "@/lib/content/schema";
import { iconFor } from "@/components/modules/ItemChip";

export type EntryType = "year" | "memory" | "photo" | "track" | "game" | "interest" | "screen" | "tech" | "internet" | "culture" | "milestone" | "tag";

export interface SearchEntry {
  id: string;
  type: EntryType;
  title: string;
  subtitle?: string;
  year: number;
  href: string;
  icon: IconName;
  keywords: string[];
  personal: boolean;
}

let cached: SearchEntry[] | null = null;

/** Builds the search index from the content files. Only real content is indexed, never placeholders. */
export function buildIndex(): SearchEntry[] {
  if (cached) return cached;
  const out: SearchEntry[] = [];
  const tags = new Map<string, Set<number>>();

  for (const y of getAllYears()) {
    const yr = y.year;
    out.push({ id: `year-${yr}`, type: "year", title: String(yr), subtitle: `${y.ageLabel} · ${y.lifeStage} · ${y.culture.headline}`, year: yr, href: `/year/${yr}`, icon: "folder", keywords: [y.culture.headline, y.lifeStage, y.era], personal: false });

    for (const m of y.personal.memories) if (!isPlaceholder(m)) {
      out.push({ id: `memory-${m.id}`, type: "memory", title: m.title, subtitle: m.body.slice(0, 90), year: yr, href: `/year/${yr}#${m.id}`, icon: "folder", keywords: m.tags, personal: true });
      m.tags.forEach((t) => tags.set(t, (tags.get(t) ?? new Set()).add(yr)));
    }
    for (const p of y.personal.photos) if (!isPlaceholder(p)) {
      out.push({ id: `photo-${p.id}`, type: "photo", title: p.caption ?? p.alt, subtitle: p.alt, year: yr, href: `/year/${yr}#photos`, icon: "camera", keywords: p.tags, personal: true });
      p.tags.forEach((t) => tags.set(t, (tags.get(t) ?? new Set()).add(yr)));
    }
    for (const t of y.personal.music) if (!isPlaceholder(t)) out.push({ id: `track-${t.id}`, type: "track", title: t.title, subtitle: t.artist, year: yr, href: `/year/${yr}#music`, icon: "music", keywords: [t.artist, t.album ?? "", ...t.tags], personal: true });
    for (const t of y.culture.music) out.push({ id: `track-${t.id}`, type: "track", title: t.title, subtitle: `${t.artist} · on the charts`, year: yr, href: `/year/${yr}#music`, icon: "music", keywords: [t.artist], personal: false });
    for (const it of y.personal.interests) if (!isPlaceholder(it)) {
      out.push({ id: `interest-${yr}-${it.label}`, type: "interest", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#interests`, icon: iconFor(it), keywords: [it.kind, ...it.tags], personal: true });
      it.tags.forEach((t) => tags.set(t, (tags.get(t) ?? new Set()).add(yr)));
    }
    for (const it of y.personal.onMyScreen) if (!isPlaceholder(it)) out.push({ id: `screen-${yr}-${it.label}`, type: "screen", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#screen`, icon: iconFor(it), keywords: [it.kind], personal: true });
    for (const it of y.personal.tech) if (!isPlaceholder(it)) out.push({ id: `tech-${yr}-${it.label}`, type: "tech", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#tech`, icon: iconFor(it), keywords: [it.kind], personal: true });
    for (const m of y.personal.milestones) if (!isPlaceholder(m)) out.push({ id: `milestone-${m.id}`, type: "milestone", title: m.title, subtitle: m.date, year: yr, href: `/year/${yr}#${m.id}`, icon: "flag", keywords: [m.kind, ...m.tags], personal: true });

    for (const it of y.culture.games) out.push({ id: `game-${yr}-${it.label}`, type: "game", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#games`, icon: iconFor(it), keywords: [it.kind], personal: false });
    for (const it of y.culture.onScreen) out.push({ id: `screen-${yr}-${it.label}`, type: "screen", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#screen`, icon: iconFor(it), keywords: [it.kind], personal: false });
    for (const it of y.culture.tech) out.push({ id: `tech-${yr}-${it.label}`, type: "tech", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#tech`, icon: iconFor(it), keywords: [it.kind], personal: false });
    for (const it of y.culture.internet) out.push({ id: `internet-${yr}-${it.label}`, type: "internet", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#internet`, icon: iconFor(it), keywords: [it.kind], personal: false });
    for (const it of y.culture.culture) out.push({ id: `culture-${yr}-${it.label}`, type: "culture", title: it.label, subtitle: it.note, year: yr, href: `/year/${yr}#culture`, icon: iconFor(it), keywords: [it.kind], personal: false });
  }

  for (const [tag, years] of tags) {
    const first = Math.min(...years);
    out.push({ id: `tag-${tag}`, type: "tag", title: `#${tag}`, subtitle: `${years.size} year${years.size > 1 ? "s" : ""}`, year: first, href: `/year/${first}`, icon: "star", keywords: [], personal: true });
  }

  cached = out;
  return out;
}

export const typeLabel: Record<EntryType, string> = {
  year: "Years", memory: "Memories", photo: "Photos", track: "Songs", game: "Games", interest: "Interests",
  screen: "On screen", tech: "Tech", internet: "The internet", culture: "Culture", milestone: "Milestones", tag: "Tags",
};
export const typeOrder: EntryType[] = ["year", "memory", "milestone", "photo", "track", "interest", "game", "screen", "tech", "internet", "culture", "tag"];
