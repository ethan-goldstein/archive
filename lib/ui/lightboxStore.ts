import type { Photo } from "@/lib/content/schema";

export interface LightboxState { open: boolean; photos: Photo[]; index: number; year: number }
const serverState: LightboxState = { open: false, photos: [], index: 0, year: 2005 };
let state = serverState;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const lightboxStore = {
  subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); },
  get: () => state,
  getServer: () => serverState,
  open(photos: Photo[], index: number, year: number) { state = { open: true, photos, index, year }; emit(); },
  close() { state = { ...state, open: false }; emit(); },
  go(delta: number) {
    if (!state.photos.length) return;
    state = { ...state, index: (state.index + delta + state.photos.length) % state.photos.length };
    emit();
  },
  set(index: number) { state = { ...state, index }; emit(); },
};
