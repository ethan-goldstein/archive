/** Square-wave music and SFX for the sandlot. All synthesized; nothing sampled. */
import { unlockAudio } from "@/lib/audio/chime";
import { settingsStore } from "@/lib/settings/store";

function on() { return settingsStore.getSnapshot().sound; }

function voice(ctx: AudioContext, type: OscillatorType, freq: number, start: number, len: number, gain: number, slide = 0) {
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, start);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), start + len);
  g.gain.setValueAtTime(0.0001, start); g.gain.linearRampToValueAtTime(gain, start + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, start + len);
  o.connect(g).connect(ctx.destination); o.start(start); o.stop(start + len + 0.02);
}
function noise(ctx: AudioContext, start: number, len: number, gain: number, hp = 800) {
  const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate);
  const d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource(); src.buffer = buf;
  const f = ctx.createBiquadFilter(); f.type = "highpass"; f.frequency.value = hp;
  const g = ctx.createGain(); g.gain.setValueAtTime(gain, start); g.gain.exponentialRampToValueAtTime(0.0001, start + len);
  src.connect(f).connect(g).connect(ctx.destination); src.start(start); src.stop(start + len);
}

export const sfx = {
  crack() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.12, 0.35, 1500); voice(c, "square", 220, t, 0.08, 0.08, -150); },
  bunt() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.05, 0.15, 2000); },
  catchBall() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.06, 0.2, 400); voice(c, "square", 140, t, 0.05, 0.05); },
  whiff() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.18, 0.12, 3000); },
  strike() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 330, t, 0.1, 0.06); voice(c, "square", 262, t + 0.1, 0.16, 0.06); },
  ball() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 262, t, 0.1, 0.05); },
  out() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 392, t, 0.08, 0.06); voice(c, "square", 330, t + 0.09, 0.08, 0.06); voice(c, "square", 262, t + 0.18, 0.2, 0.06); },
  safe() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 523, t, 0.08, 0.06); voice(c, "square", 659, t + 0.09, 0.16, 0.06); },
  cheer() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.9, 0.12, 600); },
  homer() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; [523, 659, 784, 1047, 1319].forEach((f, i) => voice(c, "square", f, t + i * 0.09, 0.3, 0.07)); noise(c, t + 0.2, 1.2, 0.14, 500); },
  pitch() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; noise(c, t, 0.15, 0.06, 2500); },
  select() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 880, t, 0.05, 0.04); },
  pick() { if (!on()) return; const c = unlockAudio(); if (!c) return; const t = c.currentTime; voice(c, "square", 440, t, 0.06, 0.05); voice(c, "square", 660, t + 0.07, 0.1, 0.05); },
};

/** A looping 8-bar square-wave theme. Returns a stop function. */
export function playTheme(kind: "title" | "game"): () => void {
  if (!on()) return () => {};
  const c = unlockAudio();
  if (!c) return () => {};
  const bpm = kind === "title" ? 132 : 148;
  const beat = 60 / bpm;
  // pentatonic bounce; every number is a MIDI note, 0 is a rest
  const lead = kind === "title"
    ? [72, 0, 76, 79, 0, 76, 72, 0, 74, 0, 77, 81, 0, 79, 76, 0, 72, 0, 76, 79, 84, 0, 79, 76, 74, 77, 79, 0, 76, 0, 72, 0]
    : [67, 0, 67, 70, 72, 0, 70, 67, 65, 0, 65, 67, 70, 0, 67, 65, 63, 0, 63, 65, 67, 0, 70, 67, 65, 63, 62, 0, 60, 0, 60, 0];
  const bass = kind === "title" ? [48, 48, 55, 55, 50, 50, 57, 57] : [43, 43, 41, 41, 39, 39, 38, 36];
  const hz = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
  let stopped = false;
  let nextBar = c.currentTime + 0.05;
  const schedule = () => {
    if (stopped) return;
    const t0 = nextBar;
    lead.forEach((n, i) => { if (n) voice(c, "square", hz(n), t0 + i * beat * 0.5, beat * 0.45, 0.035); });
    bass.forEach((n, i) => { voice(c, "triangle", hz(n), t0 + i * beat * 2, beat * 1.6, 0.05); });
    for (let i = 0; i < 16; i++) noise(c, t0 + i * beat, 0.03, i % 2 ? 0.05 : 0.02, 4000);
    nextBar = t0 + beat * 16;
  };
  schedule();
  const timer = setInterval(() => { if (c.currentTime > nextBar - beat * 4) schedule(); }, 250);
  return () => { stopped = true; clearInterval(timer); };
}
