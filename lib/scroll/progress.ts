import { SEASONS, type Season } from "@/lib/content/seasons";

/**
 * Scroll state for the year journey, kept OUT of React state: the 3D scene reads it every
 * frame, and only a coarse snapshot (active chapter) is exposed as a store for the 2D side.
 * Chapters register their element; `measure()` caches document offsets; `update()` runs on scroll.
 */
export interface Chapter {
  id: string;
  season: Season;
  el: HTMLElement;
  top: number;
  height: number;
}

export interface ScrollState {
  y: number;
  vh: number;
  velocity: number;
  /** 0–1 across the whole journey (title → world). */
  progress: number;
  /** Continuous chapter cursor: 0 at the top of the first chapter, N at the end of the last. */
  u: number;
  /** How much of the viewport each season currently owns, 0–1, summing to ~1 between chapters. */
  weights: Record<Season, number>;
  active: string;
  activeT: number;
  /** Local 0–1 progress of every registered chapter, by id. */
  ts: Record<string, number>;
}

const state: ScrollState = {
  y: 0, vh: 1, velocity: 0, progress: 0, u: 0,
  weights: { winter: 1, spring: 0, summer: 0, fall: 0 },
  active: "title", activeT: 0, ts: {},
};
const chapters: Chapter[] = [];
const listeners = new Set<() => void>();
let lastY = 0;
let lastT = 0;

function emit() { for (const l of listeners) l(); }

export const scrollStore = {
  state,
  chapters,
  register(id: string, season: Season, el: HTMLElement) {
    const existing = chapters.findIndex((c) => c.id === id);
    const c: Chapter = { id, season, el, top: 0, height: 1 };
    if (existing >= 0) chapters[existing] = c; else chapters.push(c);
    chapters.sort((a, b) => a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
    scrollStore.measure();
    return () => {
      const i = chapters.findIndex((x) => x.id === id);
      if (i >= 0) chapters.splice(i, 1);
    };
  },
  measure() {
    if (typeof window === "undefined") return;
    const y = window.scrollY;
    state.vh = window.innerHeight || 1;
    for (const c of chapters) {
      const r = c.el.getBoundingClientRect();
      c.top = r.top + y;
      c.height = Math.max(1, r.height);
    }
    scrollStore.update(y, performance.now());
  },
  update(y: number, now: number) {
    state.y = y;
    const dt = Math.max(1, now - lastT);
    state.velocity = (y - lastY) / dt;
    lastY = y; lastT = now;
    const vh = state.vh;
    const mid = y + vh * 0.5;
    const weights: Record<Season, number> = { winter: 0, spring: 0, summer: 0, fall: 0 };
    let u = 0;
    let active = state.active;
    let activeT = state.activeT;
    let found = false;
    for (const c of chapters) {
      const t = clamp((mid - c.top) / c.height);
      state.ts[c.id] = t;
      u += t;
      const overlap = Math.max(0, Math.min(y + vh, c.top + c.height) - Math.max(y, c.top));
      weights[c.season] += overlap / vh;
      if (!found && mid >= c.top && mid < c.top + c.height) { active = c.id; activeT = t; found = true; }
    }
    if (chapters.length) {
      const first = chapters[0], last = chapters[chapters.length - 1];
      if (!found) { if (mid < first.top) { active = first.id; activeT = 0; } else { active = last.id; activeT = 1; } }
      const span = Math.max(1, last.top + last.height - first.top - vh);
      state.progress = clamp((y - first.top) / span);
    }
    const sum = SEASONS.reduce((n, s) => n + weights[s], 0) || 1;
    for (const s of SEASONS) state.weights[s] = weights[s] / sum;
    state.u = u;
    if (active !== state.active) { state.active = active; state.activeT = activeT; emit(); }
    else state.activeT = activeT;
  },
  subscribe(l: () => void) { listeners.add(l); return () => { listeners.delete(l); }; },
  getActive() { return state.active; },
};

function clamp(v: number) { return v < 0 ? 0 : v > 1 ? 1 : v; }
