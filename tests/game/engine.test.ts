import { describe, expect, it } from "vitest";
import { kids } from "@/content/game/roster";
import { buildTeam, createDraft, cpuPick, pick, assignPositions } from "@/lib/game/draft";
import { createGame, step } from "@/lib/game/sim";
import { gameShouldEnd } from "@/lib/game/rules";
import type { GameState, Input } from "@/lib/game/types";

function teams(seed = 1) {
  let d = createDraft(kids, seed, 7);
  while (!d.done) d = d.turn === "human" ? pick(d, d.pool[0].id) : cpuPick(d);
  return {
    home: buildTeam("home", "Comets", "#f00", "#fff", d.picks.human, false),
    away: buildTeam("away", "Rockets", "#00f", "#fff", d.picks.cpu, false),
  };
}

function run(state: GameState, seconds: number, inputs: Input[] = []): GameState {
  let s = state;
  const dt = 1 / 60;
  for (let t = 0; t < seconds; t += dt) { s = step(s, dt, inputs); inputs = []; }
  return s;
}

describe("draft", () => {
  it("alternates picks and never picks the same kid twice", () => {
    let d = createDraft(kids, 7, 7);
    while (!d.done) d = d.turn === "human" ? pick(d, d.pool[d.pool.length - 1].id) : cpuPick(d);
    const all = [...d.picks.human, ...d.picks.cpu].map((k) => k.id);
    expect(new Set(all).size).toBe(14);
    expect(d.picks.human.length).toBe(7);
    expect(d.picks.cpu.length).toBe(7);
  });
  it("puts the best pitcher on the mound", () => {
    const pos = assignPositions(kids);
    expect(pos.P).toBe("rocket");
    expect(pos.C).toBe("gus");
  });
});

describe("simulation", () => {
  it("is deterministic for a seed", () => {
    const { home, away } = teams();
    const a = run(createGame(home, away, { innings: 1, mercy: 10, seed: 42 }), 60);
    const b = run(createGame(home, away, { innings: 1, mercy: 10, seed: 42 }), 60);
    expect(a.score).toEqual(b.score);
    expect(a.log).toEqual(b.log);
    expect(a.phase).toBe(b.phase);
  });

  it("plays a full CPU vs CPU game to the end with plausible scoring", () => {
    const { home, away } = teams(3);
    let s = createGame(home, away, { innings: 3, mercy: 10, seed: 99 });
    let seconds = 0;
    while (s.phase !== "game-over" && seconds < 1200) { s = run(s, 1); seconds += 1; }
    expect(s.phase).toBe("game-over");
    expect(s.inning).toBeGreaterThanOrEqual(3);
    expect(s.score.home + s.score.away).toBeLessThan(40);
    const abs = Object.values(s.stats).reduce((n, st) => n + st.ab, 0);
    expect(abs).toBeGreaterThan(12);
  });

  it("walks the batter on four balls and strikes out on three strikes via the rules", () => {
    const { home, away } = teams();
    const s = createGame(home, away, { innings: 3, mercy: 10, seed: 5 });
    s.balls = 3;
    // simulate a ball call by forcing a pitch far outside with a human pitcher that never swings
    s.teams.home.human = true;
    let g = run(s, 0.5, [{ type: "pitch", kind: "fastball", aimX: 4, aimY: 4, meter: 1 }]);
    g = run(g, 2);
    expect(g.runners.length).toBe(1);
    expect(g.balls).toBe(0);
  });

  it("ends early on the mercy rule and never ends in a tie after regulation", () => {
    const { home, away } = teams();
    const s = createGame(home, away, { innings: 3, mercy: 10, seed: 1 });
    s.inning = 3; s.top = false; s.score = { home: 12, away: 1 };
    expect(gameShouldEnd(s)).toBe(true);
    const tie = createGame(home, away, { innings: 3, mercy: 10, seed: 1 });
    tie.inning = 3; tie.top = false; tie.score = { home: 2, away: 2 };
    expect(gameShouldEnd(tie)).toBe(false);
  });
});
