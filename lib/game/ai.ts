import type { GameState, PitchKind, Kid, Difficulty } from "./types";
import { Rng } from "./rng";
import { baseCoord } from "./types";
import { dist } from "./physics";

/** CPU pitcher: works the zone, nibbles ahead in the count, mixes pitches by skill. */
export function aiPitch(pitcher: Kid, s: GameState, rng: Rng, difficulty: Difficulty = "normal"): { kind: PitchKind; aimX: number; aimY: number; meter: number } {
  const ahead = s.strikes > s.balls;
  const kinds: PitchKind[] = ["fastball", "fastball", "curve", "changeup"];
  if (pitcher.trait === "rocket-arm" || pitcher.trait === "curveball") kinds.push("special");
  const kind = rng.pick(kinds);
  const edge = ahead ? 0.85 : 0.5;
  const aimX = rng.range(-edge, edge);
  const aimY = rng.range(-edge, edge);
  const skill = difficulty === "easy" ? 0.45 : difficulty === "hard" ? 0.8 : 0.6;
  const meter = Math.min(1, skill + pitcher.pitching / 25 + rng.float() * 0.2);
  return { kind, aimX, aimY, meter };
}

/** CPU batter decides at release whether and when to swing. Returns the timing error in seconds, or null. */
export function aiSwingPlan(batter: Kid, locX: number, locY: number, rng: Rng, difficulty: Difficulty = "normal"): { swing: boolean; err: number; bunt: boolean } {
  const d = difficulty === "easy" ? 1.7 : difficulty === "hard" ? 0.6 : 1;
  const perception = 0.35 * (1 - batter.batting / 12) * d;
  const seenX = locX + rng.gauss() * perception;
  const seenY = locY + rng.gauss() * perception;
  const inZone = Math.abs(seenX) < 1.05 && Math.abs(seenY) < 1.05;
  const chase = !inZone && rng.chance(0.18 - batter.batting * 0.01);
  const swing = inZone ? rng.chance(0.82) : chase;
  const err = rng.gauss() * (0.028 + (10 - batter.batting) * 0.006) * d;
  const bunt = batter.trait === "bunt-queen" && rng.chance(0.35);
  return { swing, err, bunt };
}

/** Which base a CPU fielder throws to: get the lead runner if it is close, otherwise the sure out. */
export function aiThrowBase(s: GameState, fx: number, fy: number): 1 | 2 | 3 | 4 {
  const running = s.runners.filter((r) => r.running && !r.scored && !r.out);
  if (!running.length) return 1;
  // score each runner's target by how far they still have to go versus the throw distance
  let best: { base: number; margin: number } | null = null;
  for (const r of running) {
    const b = baseCoord(r.to);
    const throwT = dist(fx, fy, b.x, b.y) / 80;
    const runT = ((1 - r.progress) * 60) / 20;
    const margin = runT - throwT;
    if (margin > -0.15 && (!best || r.to > best.base)) best = { base: r.to, margin };
  }
  const target = best ? best.base : Math.min(...running.map((r) => r.to));
  return Math.max(1, Math.min(4, target)) as 1 | 2 | 3 | 4;
}
