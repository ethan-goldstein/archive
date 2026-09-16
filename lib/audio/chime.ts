/**
 * Our own synthesized boot chime and UI clicks. No copyrighted OS sounds.
 * Everything runs through one AudioContext created on the first user gesture.
 */
import { settingsStore } from "@/lib/settings/store";

let ctx: AudioContext | null = null;

export function unlockAudio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, length: number, gain = 0.08, type: OscillatorType = "sine") {
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(g).connect(ctx.destination);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

function soundOn() {
  return settingsStore.getSnapshot().sound;
}

/** A warm two-chord rise, about 1.6s. Plays only when sound is on. */
export function playBootChime() {
  if (!soundOn()) return;
  const c = unlockAudio();
  if (!c) return;
  const t = c.currentTime + 0.05;
  tone(261.63, t, 1.4, 0.05, "triangle");
  tone(329.63, t + 0.08, 1.3, 0.05, "triangle");
  tone(392.0, t + 0.16, 1.2, 0.05, "triangle");
  tone(523.25, t + 0.5, 1.1, 0.06, "sine");
  tone(659.25, t + 0.62, 1.0, 0.045, "sine");
  tone(783.99, t + 0.74, 0.9, 0.04, "sine");
}

/** A tiny click for year changes. */
export function playClick() {
  if (!soundOn()) return;
  const c = unlockAudio();
  if (!c) return;
  const t = c.currentTime;
  tone(1200, t, 0.05, 0.025, "square");
  tone(600, t + 0.01, 0.06, 0.02, "sine");
}

/** A soft two-note "memory unlocked". */
export function playUnlock() {
  if (!soundOn()) return;
  const c = unlockAudio();
  if (!c) return;
  const t = c.currentTime;
  tone(880, t, 0.25, 0.04, "sine");
  tone(1318.5, t + 0.12, 0.35, 0.04, "sine");
}
