/**
 * Tiny external store for user settings (sound, effects, entered).
 * Persists to localStorage; SSR snapshot is the defaults so hydration never mismatches.
 */
import { site } from "@/content/site";

export type OsSkin = "win" | "mac";
export interface Settings {
  sound: boolean;
  effects: boolean;
  entered: boolean;
  os: OsSkin;
}

const KEY = "archive:settings";
const defaults: Settings = { sound: site.soundDefault, effects: site.effectsDefault, entered: false, os: "win" };

let state: Settings = defaults;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { ...defaults, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    state = defaults;
  }
}

function persist() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* private mode etc. */
  }
}

export const settingsStore = {
  subscribe(cb: () => void) {
    load();
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  getSnapshot(): Settings {
    load();
    return state;
  },
  getServerSnapshot(): Settings {
    return defaults;
  },
  set(patch: Partial<Settings>) {
    state = { ...state, ...patch };
    persist();
    listeners.forEach((l) => l());
  },
};
