import type { Kid, Position, Team } from "./types";
import { POSITIONS, overall } from "./types";
import { Rng } from "./rng";

export interface DraftState {
  pool: Kid[];
  picks: { human: Kid[]; cpu: Kid[] };
  turn: "human" | "cpu";
  size: number;
  seed: number;
  done: boolean;
}

export function createDraft(pool: Kid[], seed: number, size = 7, humanFirst = true): DraftState {
  return { pool: [...pool], picks: { human: [], cpu: [] }, turn: humanFirst ? "human" : "cpu", size, seed, done: false };
}

export function pick(d: DraftState, kidId: string): DraftState {
  if (d.done) return d;
  const kid = d.pool.find((k) => k.id === kidId);
  if (!kid) return d;
  const pool = d.pool.filter((k) => k.id !== kidId);
  const picks = { ...d.picks, [d.turn]: [...d.picks[d.turn], kid] };
  const done = picks.human.length >= d.size && picks.cpu.length >= d.size;
  const turn = d.turn === "human" ? "cpu" : "human";
  return { ...d, pool, picks, turn: done ? d.turn : turn, done };
}

/** CPU drafts by overall rating with a little randomness, and likes speed early. */
export function cpuPick(d: DraftState): DraftState {
  if (d.done || d.turn !== "cpu" || !d.pool.length) return d;
  const rng = new Rng(d.seed);
  const scored = d.pool
    .map((k) => ({ k, s: overall(k) + rng.gauss() * 0.6 + (d.picks.cpu.length === 0 ? k.pitching * 0.1 : 0) }))
    .sort((a, b) => b.s - a.s);
  const next = pick(d, scored[0].k.id);
  return { ...next, seed: rng.seed };
}

/** Assigns positions by suitability: best pitcher pitches, best glove catches, fastest patrol the outfield. */
export function assignPositions(kids: Kid[]): Record<Position, string> {
  const taken = new Set<string>();
  const out = {} as Record<Position, string>;
  const take = (pos: Position, score: (k: Kid) => number) => {
    const best = kids.filter((k) => !taken.has(k.id)).sort((a, b) => score(b) - score(a))[0];
    if (best) { taken.add(best.id); out[pos] = best.id; }
  };
  take("P", (k) => k.pitching * 2 + k.fielding * 0.2);
  take("C", (k) => k.fielding * 1.5 - k.speed * 0.3);
  take("SS", (k) => k.fielding + k.speed * 0.6);
  take("CF", (k) => k.speed + k.fielding * 0.8);
  take("2B", (k) => k.fielding + k.speed * 0.3);
  take("3B", (k) => k.fielding * 0.8 + k.power * 0.3);
  take("1B", (k) => k.fielding * 0.6 + k.power * 0.4);
  take("LF", (k) => k.speed * 0.6 + k.fielding * 0.5);
  take("RF", (k) => k.speed * 0.5 + k.fielding * 0.5);
  // fewer than nine kids: the remaining positions are covered by whoever is closest (engine handles missing)
  for (const pos of POSITIONS) if (!out[pos]) out[pos] = kids[0]?.id ?? "";
  return out;
}

/** Batting order: contact and speed up top, power in the middle, the rest after. */
export function battingOrder(kids: Kid[]): string[] {
  const s = [...kids];
  s.sort((a, b) => b.batting + b.speed * 0.5 - (a.batting + a.speed * 0.5));
  const lead = s.slice(0, 2);
  const rest = s.slice(2).sort((a, b) => b.power + b.batting - (a.power + a.batting));
  return [...lead, ...rest].map((k) => k.id);
}

export function buildTeam(id: "home" | "away", name: string, color: string, colorAlt: string, kids: Kid[], human: boolean): Team {
  return { id, name, color, colorAlt, kids, lineup: battingOrder(kids), positions: assignPositions(kids), human };
}
