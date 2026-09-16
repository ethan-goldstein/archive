/**
 * The music player's brain. One hidden <audio> element, a queue, and an adapter per source type.
 *  - local / preview: real playback through <audio>
 *  - spotify / apple / youtube: "external" — shown in the player with an Open link (YouTube playback is phase 2)
 *  - no source: "unavailable" — shown, but nothing to play
 * Never autoplays: play() is only ever called from a user gesture.
 */
import type { Track } from "@/lib/content/schema";
import { settingsStore } from "@/lib/settings/store";
import { youtubeId, type YtController } from "./adapters/youtube";
import { asset } from "@/lib/basePath";

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "external" | "unavailable" | "error";
export type Backend = "audio" | "youtube" | "none";

export interface PlayerState {
  queue: Track[];
  index: number;
  status: PlayerStatus;
  progress: number;
  duration: number;
  volume: number;
  backend: Backend;
  youtubeId: string | null;
}

const serverState: PlayerState = { queue: [], index: -1, status: "idle", progress: 0, duration: 0, volume: 0.8, backend: "none", youtubeId: null };
let yt: YtController | null = null;
let ytMuted = false;
let state: PlayerState = serverState;
const listeners = new Set<() => void>();
let audio: HTMLAudioElement | null = null;

function emit() {
  listeners.forEach((l) => l());
}
function patch(p: Partial<PlayerState>) {
  state = { ...state, ...p };
  emit();
}

function ensureAudio() {
  if (audio || typeof window === "undefined") return audio;
  audio = new Audio();
  audio.preload = "metadata";
  audio.volume = state.volume;
  audio.addEventListener("timeupdate", () => { if (state.backend === "audio") patch({ progress: audio!.currentTime }); });
  audio.addEventListener("durationchange", () => patch({ duration: Number.isFinite(audio!.duration) ? audio!.duration : 0 }));
  audio.addEventListener("play", () => patch({ status: "playing" }));
  audio.addEventListener("pause", () => { if (state.status === "playing" && state.backend === "audio") patch({ status: "paused" }); });
  audio.addEventListener("waiting", () => patch({ status: "loading" }));
  audio.addEventListener("ended", () => playerStore.next());
  audio.addEventListener("error", () => patch({ status: "error" }));
  return audio;
}

export function isPlayable(track: Track | undefined) {
  const t = track?.source?.type;
  return t === "local" || t === "preview" || (t === "youtube" && !!youtubeId(track!.source!.url));
}
export function isYouTube(track: Track | undefined) {
  return track?.source?.type === "youtube";
}
export function externalUrl(track: Track | undefined) {
  const s = track?.source;
  if (!s) return null;
  if (s.type === "spotify" || s.type === "apple" || s.type === "youtube") return s.url;
  return null;
}
export function externalLabel(track: Track | undefined) {
  const t = track?.source?.type;
  if (t === "spotify") return "Open in Spotify";
  if (t === "apple") return "Open in Apple Music";
  if (t === "youtube") return "Open on YouTube";
  return null;
}

async function load(track: Track) {
  const a = ensureAudio();
  if (!a) return;
  if (isYouTube(track)) {
    a.pause(); a.removeAttribute("src");
    const id = track.source?.type === "youtube" ? youtubeId(track.source.url) : null;
    if (!id) { patch({ status: "unavailable", backend: "none", youtubeId: null }); return; }
    patch({ status: "loading", progress: 0, duration: 0, backend: "youtube", youtubeId: id });
    if (yt) { yt.load(id); yt.play(); }
    return;
  }
  if (yt) { yt.pause(); }
  patch({ backend: "audio", youtubeId: null });
  if (isPlayable(track)) {
    const src = (track.source as { src: string }).src;
    a.src = asset(src);
    a.muted = !settingsStore.getSnapshot().sound;
    patch({ status: "loading", progress: 0, duration: 0 });
    try {
      await a.play();
    } catch {
      patch({ status: "paused" });
    }
  } else {
    a.pause();
    a.removeAttribute("src");
    patch({ status: externalUrl(track) ? "external" : "unavailable", progress: 0, duration: 0 });
  }
}

export const playerStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => state,
  getServer: () => serverState,
  current: () => state.queue[state.index] as Track | undefined,

  /** Start a track. If a queue is given it replaces the current one. */
  play(track: Track, queue?: Track[]) {
    const q = queue ?? (state.queue.some((t) => t.id === track.id) ? state.queue : [track]);
    const index = Math.max(0, q.findIndex((t) => t.id === track.id));
    patch({ queue: q, index });
    void load(track);
  },
  toggle() {
    const a = ensureAudio();
    const t = playerStore.current();
    if (!a || !t) return;
    if (state.backend === "youtube") { if (!yt) return; if (state.status === "playing") yt.pause(); else yt.play(); return; }
    if (!isPlayable(t)) return;
    if (state.status === "playing") a.pause();
    else void a.play().catch(() => patch({ status: "paused" }));
  },
  pause() {
    audio?.pause();
    yt?.pause();
  },
  /** The visible YouTube host registers its controller here. */
  attachYouTube(ctrl: YtController | null) {
    yt = ctrl;
    if (ctrl) { ctrl.volume(state.volume); ctrl.mute(ytMuted); if (state.backend === "youtube") { ctrl.play(); } }
  },
  reportYouTube(progress: number, duration: number, status: "playing" | "paused" | "ended" | "loading") {
    if (state.backend !== "youtube") return;
    if (status === "ended") { playerStore.next(); return; }
    patch({ progress, duration, status: status === "loading" ? "loading" : status });
  },
  next() {
    if (!state.queue.length) return;
    const index = (state.index + 1) % state.queue.length;
    patch({ index });
    void load(state.queue[index]);
  },
  prev() {
    if (!state.queue.length) return;
    if (audio && audio.currentTime > 3 && isPlayable(playerStore.current())) {
      audio.currentTime = 0;
      return;
    }
    const index = (state.index - 1 + state.queue.length) % state.queue.length;
    patch({ index });
    void load(state.queue[index]);
  },
  seek(seconds: number) {
    const s = Math.max(0, Math.min(state.duration || 0, seconds));
    if (state.backend === "youtube") { yt?.seek(s); patch({ progress: s }); return; }
    if (!audio) return;
    audio.currentTime = s;
    patch({ progress: audio.currentTime });
  },
  setVolume(v: number) {
    const volume = Math.max(0, Math.min(1, v));
    if (audio) audio.volume = volume;
    yt?.volume(volume);
    patch({ volume });
  },
  /** Called by the sound toggle: mutes actual playback without losing position. */
  setMuted(muted: boolean) {
    if (audio) audio.muted = muted;
    ytMuted = muted;
    yt?.mute(muted);
  },
  jumpTo(index: number) {
    if (index < 0 || index >= state.queue.length) return;
    patch({ index });
    void load(state.queue[index]);
  },
};
