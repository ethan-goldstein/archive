import {
  CultureYearSchema,
  PersonalYearSchema,
  type CultureYearInput,
  type PersonalYearInput,
  type YearData,
} from "./schema";
import { YEARS, eraForYear, isArchiveYear } from "./eras";
import { ageInYear, ageLabel, lifeStageFor } from "./age";
import { isPlaceholder } from "./placeholders";
import { personalRegistry } from "@/content/personal";
import { cultureRegistry } from "@/content/culture";
import generatedMedia from "@/content/generated/media.json";
import generatedMusic from "@/content/generated/music.json";

const cache = new Map<number, YearData>();

function countPlaceholders(value: unknown): number {
  if (isPlaceholder(value)) return 1;
  if (Array.isArray(value)) return value.reduce((n, v) => n + countPlaceholders(v), 0);
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).reduce<number>(
      (n, v) => n + countPlaceholders(v),
      0,
    );
  }
  return 0;
}

interface GeneratedYear { photos?: { id: string; src: string; width: number; height: number; blurDataURL?: string }[]; videos?: { id: string; src: string }[] }
const generated = generatedMedia as Record<string, GeneratedYear>;

/** Photos and videos processed by `npm run photos` that the personal file has not described yet. */
function withGeneratedMedia(personal: PersonalYearInput): PersonalYearInput {
  const g = generated[String(personal.year)];
  if (!g) return personal;
  const known = new Set((personal.photos ?? []).map((p) => (isPlaceholder(p) ? "" : (p as { src: string }).src)));
  const knownV = new Set((personal.videos ?? []).map((v) => (isPlaceholder(v) ? "" : (v as { src: string }).src)));
  const photos = (g.photos ?? []).filter((p) => !known.has(p.src)).map((p) => ({ ...p, alt: `Photo from ${personal.year}`, tags: [] }));
  const videos = (g.videos ?? []).filter((v) => !knownV.has(v.src)).map((v) => ({ id: v.id, src: v.src, tags: [] }));
  // described photos come first; generated ones follow, and placeholders are dropped once real media exists
  const hasReal = photos.length > 0 || (personal.photos ?? []).some((p) => !isPlaceholder(p));
  return {
    ...personal,
    photos: [...(personal.photos ?? []).filter((p) => !hasReal || !isPlaceholder(p)), ...photos],
    videos: [...(personal.videos ?? []).filter((v) => !(videos.length > 0) || !isPlaceholder(v)), ...videos],
  };
}

interface GeneratedTrack { id: string; title: string; artist: string; album?: string; plays?: number; replayRank?: number; season?: "winter" | "spring" | "summer" | "fall"; source?: { type: "apple"; url: string } }
const music = generatedMusic as Record<string, GeneratedTrack[]>;

/** Tracks read from the Music app by `npm run music`. Hand-written tracks come first; the placeholder goes once real ones exist. */
function withGeneratedMusic(personal: PersonalYearInput): PersonalYearInput {
  const g = music[String(personal.year)];
  if (!g?.length) return personal;
  const tracks = g.map((t) => ({ ...t, personal: true, // A Replay rank speaks for itself; lifetime counters reset when a song is re-added, so they would contradict it.
    note: t.replayRank ? `Replay #${t.replayRank}` : t.plays ? `${t.plays} plays` : undefined, tags: [] }));
  return { ...personal, music: [...(personal.music ?? []).filter((t) => !isPlaceholder(t)), ...tracks] };
}

export function buildYear(personalInput: PersonalYearInput, cultureInput: CultureYearInput): YearData {
  const personal = PersonalYearSchema.parse(withGeneratedMusic(withGeneratedMedia(personalInput)));
  const culture = CultureYearSchema.parse(cultureInput);
  if (personal.year !== culture.year) {
    throw new Error(`Year mismatch: personal ${personal.year} vs culture ${culture.year}`);
  }
  const year = personal.year;
  const era = eraForYear(year);
  const stage = lifeStageFor(year);
  const tags = Array.from(
    new Set([
      ...personal.tags,
      ...personal.memories.flatMap((m) => (isPlaceholder(m) ? [] : m.tags)),
      ...personal.photos.flatMap((p) => (isPlaceholder(p) ? [] : p.tags)),
      ...personal.interests.flatMap((i) => (isPlaceholder(i) ? [] : i.tags)),
    ]),
  );
  return {
    year,
    era: era.id,
    age: ageInYear(year),
    ageLabel: ageLabel(year),
    lifeStage: personal.lifeStage ?? stage.label,
    lifeStageIsPlaceholder: personal.lifeStage ? false : stage.placeholder,
    mode: personal.mode ?? (year <= 2008 ? "fragment" : "full"),
    location: personal.location ?? { placeholder: true, hint: "Where you lived this year", kind: "location" },
    intro: personal.intro ?? { placeholder: true, hint: "One or two sentences that sum up this year", kind: "text" },
    personal,
    culture,
    tags,
    placeholderCount: countPlaceholders(personal),
  };
}

export function getYear(year: number): YearData {
  if (!isArchiveYear(year)) throw new Error(`Year ${year} is outside the archive`);
  const cached = cache.get(year);
  if (cached) return cached;
  const personal = personalRegistry[year];
  const culture = cultureRegistry[year];
  if (!personal || !culture) throw new Error(`Missing content files for ${year}`);
  const data = buildYear(personal, culture);
  cache.set(year, data);
  return data;
}

export function getAllYears(): YearData[] {
  return YEARS.map(getYear);
}
