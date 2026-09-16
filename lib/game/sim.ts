/**
 * The game loop as a pure function: step(state, dt, inputs) -> state.
 * Everything random comes from state.seed through Rng, so a seeded game replays exactly.
 */
import {
  type GameState, type GameConfig, type Team, type Input, type Runner, type Fielder, type Pitch, type PitchKind,
  DEFAULT_FIELD_POS, FIELD, POSITIONS, baseCoord,
} from "./types";
import { Rng } from "./rng";
import { addOut, battingTeam, currentBatterId, fieldingTeam, gameShouldEnd, kidById, nextBatter, pitcherId, resetCount, scoreRun, stat, winner } from "./rules";
import { battedBall, dist, distanceFromHome, landingPoint, moveToward, stepBall, throwVelocity } from "./physics";
import { aiPitch, aiSwingPlan, aiThrowBase } from "./ai";
import { announcer } from "@/content/game/text";

const PLAY_TIME_CAP = 14;
const RESULT_PAUSE = 1.6;
const HALF_PAUSE = 2.2;

export function createGame(home: Team, away: Team, config: GameConfig): GameState {
  const s: GameState = {
    config, seed: config.seed, phase: "pitch-select", phaseT: 0,
    inning: 1, top: true, outs: 0, balls: 0, strikes: 0,
    score: { home: 0, away: 0 },
    teams: { home, away },
    batterIndex: { home: 0, away: 0 },
    ball: idleBall(), pitch: null, fielders: [], runners: [],
    log: [announcer.playBall[0]], events: [], needsInput: null, runnerMode: "auto", lastResult: "", stats: {},
  };
  placeFielders(s);
  return s;
}

function idleBall() {
  return { pos: { x: 0, y: FIELD.moundDist, z: 5 }, vel: { x: 0, y: 0, z: 0 }, live: false, onGround: false, heldBy: null, bounces: 0 };
}

function placeFielders(s: GameState) {
  const team = fieldingTeam(s);
  s.fielders = POSITIONS.filter((p) => team.positions[p]).map((p) => {
    const d = DEFAULT_FIELD_POS[p];
    return { kidId: team.positions[p], pos: p, x: d.x, y: d.y, targetX: d.x, targetY: d.y };
  });
}

function say(s: GameState, lines: string[], rng: Rng) {
  const line = rng.pick(lines);
  s.log = [...s.log.slice(-5), line];
  s.lastResult = line;
}

function speedOf(s: GameState, kidId: string) {
  return 14 + kidById(s, kidId).speed * 1.3;
}

export function step(input: GameState, dt: number, inputs: Input[]): GameState {
  const s: GameState = { ...input, events: [], runners: input.runners.map((r) => ({ ...r })), fielders: input.fielders.map((f) => ({ ...f })), ball: { ...input.ball, pos: { ...input.ball.pos }, vel: { ...input.ball.vel } }, score: { ...input.score }, batterIndex: { ...input.batterIndex }, stats: { ...input.stats } };
  const rng = new Rng(s.seed);
  s.phaseT += dt;

  for (const inp of inputs) {
    if (inp.type === "runners") s.runnerMode = inp.mode;
  }

  switch (s.phase) {
    case "pitch-select": pitchSelect(s, dt, inputs, rng); break;
    case "windup": if (s.phaseT >= 0.4) { setPhase(s, "pitch"); } break;
    case "pitch": pitchPhase(s, dt, inputs, rng); break;
    case "in-play": inPlay(s, dt, inputs, rng); break;
    case "throw-select": throwSelect(s, dt, inputs, rng); break;
    case "result":
      if (s.phaseT >= RESULT_PAUSE || inputs.some((i) => i.type === "continue")) afterResult(s, rng);
      break;
    case "half-end":
      if (s.phaseT >= HALF_PAUSE || inputs.some((i) => i.type === "continue")) switchSides(s, rng);
      break;
    case "game-over": break;
  }

  s.seed = rng.seed;
  return s;
}

function setPhase(s: GameState, phase: GameState["phase"]) {
  s.phase = phase;
  s.phaseT = 0;
}

/* ---------- pitching ---------- */

function pitchSelect(s: GameState, _dt: number, inputs: Input[], rng: Rng) {
  const team = fieldingTeam(s);
  const pitcher = kidById(s, pitcherId(s));
  s.ball = idleBall();
  if (team.human) {
    s.needsInput = "pitch";
    const inp = inputs.find((i) => i.type === "pitch");
    if (!inp || inp.type !== "pitch") return;
    startPitch(s, inp.kind, inp.aimX, inp.aimY, inp.meter, rng);
  } else if (s.phaseT >= 0.9) {
    const p = aiPitch(pitcher, s, rng, s.config.difficulty);
    startPitch(s, p.kind, p.aimX, p.aimY, p.meter, rng);
  }
}

function startPitch(s: GameState, kind: PitchKind, aimX: number, aimY: number, meter: number, rng: Rng) {
  const pitcher = kidById(s, pitcherId(s));
  s.needsInput = null;
  const sigma = 0.38 * (1 - pitcher.pitching / 12) + (1 - meter) * 0.45;
  let duration = kind === "fastball" ? 0.6 - pitcher.pitching * 0.012 : kind === "curve" ? 0.78 : kind === "changeup" ? 0.88 : 0.7;
  let breakX = 0, breakY = 0;
  if (kind === "curve") { breakX = -0.55; breakY = -0.45; }
  if (kind === "changeup") { breakY = -0.3; }
  if (kind === "special") {
    if (pitcher.trait === "rocket-arm") duration = 0.46;
    else if (pitcher.trait === "curveball") { breakX = -1.1; breakY = -0.7; duration = 0.8; }
    else { duration = 1.05; breakY = -0.8; } // the eephus
  }
  if (pitcher.trait === "curveball" && kind === "curve") { breakX *= 2; breakY *= 1.5; }
  const locX = Math.max(-2, Math.min(2, aimX + breakX + rng.gauss() * sigma));
  const locY = Math.max(-2, Math.min(2, aimY + breakY + rng.gauss() * sigma));
  const pitch: Pitch = { kind, aimX, aimY, locX, locY, duration, t: 0, breakX, breakY, swung: false, bunt: false };
  s.pitch = pitch;
  s.ball = { pos: { x: 0, y: FIELD.moundDist, z: 5.5 }, vel: { x: 0, y: 0, z: 0 }, live: false, onGround: false, heldBy: null, bounces: 0 };
  setPhase(s, "windup");
  // the CPU batter makes its plan at release
  const batting = battingTeam(s);
  if (!batting.human) {
    const batter = kidById(s, currentBatterId(s));
    const plan = aiSwingPlan(batter, locX, locY, rng, s.config.difficulty);
    (s as GameState & { aiPlan?: typeof plan }).aiPlan = plan;
  }
}

function pitchPhase(s: GameState, dt: number, inputs: Input[], rng: Rng) {
  const pitch = s.pitch!;
  pitch.t += dt;
  s.pitch = { ...pitch };
  const batting = battingTeam(s);
  const batter = kidById(s, currentBatterId(s));
  // render position of the ball along the pitch
  const p = Math.min(1, pitch.t / pitch.duration);
  s.ball.pos = { x: pitch.locX * 0.75 * p + (pitch.breakX ? -pitch.breakX * 0.75 * (1 - p) * p : 0), y: FIELD.moundDist * (1 - p), z: 5.5 - (5.5 - (2 + pitch.locY)) * p };

  let swingNow = false, bunt = false;
  if (batting.human) {
    const sw = inputs.find((i) => i.type === "swing");
    if (sw && sw.type === "swing" && !pitch.swung) { swingNow = true; bunt = !!sw.bunt; }
  } else {
    const plan = (s as GameState & { aiPlan?: { swing: boolean; err: number; bunt: boolean } }).aiPlan;
    if (plan?.swing && !pitch.swung && pitch.t >= pitch.duration + plan.err) { swingNow = true; bunt = plan.bunt; }
  }

  if (swingNow) {
    s.pitch = { ...pitch, swung: true, bunt };
    resolveSwing(s, pitch.t - pitch.duration, bunt, batter, rng);
    return;
  }

  if (pitch.t >= pitch.duration + 0.12 && !pitch.swung) {
    const inZone = Math.abs(pitch.locX) <= 1 && Math.abs(pitch.locY) <= 1;
    if (inZone) calledStrike(s, rng, false);
    else ballCall(s, rng);
  }
}

function resolveSwing(s: GameState, err: number, bunt: boolean, batter: ReturnType<typeof kidById>, rng: Rng) {
  const pitch = s.pitch!;
  const runnersOn = s.runners.length > 0;
  let batting: number = batter.batting;
  if (batter.trait === "clutch" && runnersOn) batting = Math.min(10, batting + 2);
  if (batter.trait === "wild-card") batting = Math.round(rng.range(2, 10));
  let window = bunt ? 0.16 : 0.045 + batting * 0.0065;
  if (batter.trait === "all-or-nothing") window *= 0.7;
  if (bunt && batter.trait === "bunt-queen") window = 0.25;
  const outside = Math.max(0, Math.abs(pitch.locX) - 1) + Math.max(0, Math.abs(pitch.locY) - 1);
  let quality = 1 - Math.abs(err) / window;
  quality -= outside * 0.5;
  if (quality <= 0) { calledStrike(s, rng, true); return; }
  const hit = battedBall({ quality, timingErr: err, power: batter.trait === "wild-card" ? Math.round(rng.range(2, 10)) : batter.power, rng, bunt, moonshot: batter.trait === "moonshot", allOrNothing: batter.trait === "all-or-nothing" });
  if (hit.foul) {
    if (s.strikes < 2) s.strikes += 1;
    s.events.push({ type: "foul" });
    say(s, announcer.foul, rng);
    setPhase(s, "result");
    return;
  }
  s.events.push({ type: "contact", quality, kind: hit.kind });
  say(s, announcer[hit.kind], rng);
  const st = stat(s, batter.id);
  st.ab += 1;
  s.ball = { pos: { x: 0, y: 1, z: 2.5 }, vel: hit.vel, live: true, onGround: false, heldBy: null, bounces: 0 };
  // the batter becomes a runner; existing runners decide
  const batterRunner: Runner = { kidId: batter.id, from: 0, to: 1, progress: 0, running: true, scored: false, out: false };
  const airborne = hit.kind === "fly" || hit.kind === "popup";
  for (const r of s.runners) {
    const forced = isForced(s, r);
    r.running = forced || !airborne || s.runnerMode === "send" || (s.runnerMode === "auto" && kidById(s, r.kidId).speed >= 7 && !airborne);
    if (airborne && !forced && s.runnerMode !== "send") r.running = false;
  }
  s.runners.push(batterRunner);
  (s as GameState & { play?: PlayInfo }).play = { kind: hit.kind, airborne, caughtChecked: false, hitCredited: false, batterId: batter.id, holder: null, holdT: 0, throwing: false, throwTo: 0, fielded: false, rbiPending: 0 };
  choosePursuit(s);
  setPhase(s, "in-play");
}

interface PlayInfo {
  kind: string; airborne: boolean; caughtChecked: boolean; hitCredited: boolean; batterId: string;
  holder: string | null; holdT: number; throwing: boolean; throwTo: number; fielded: boolean; rbiPending: number;
}
const playOf = (s: GameState) => (s as GameState & { play?: PlayInfo }).play!;

function isForced(s: GameState, r: Runner): boolean {
  // a runner is forced if every base behind them down to first is occupied (batter always occupies "0")
  const occupied = new Set(s.runners.filter((x) => !x.scored && !x.out).map((x) => (x.running ? x.from : x.to)));
  for (let b = r.from - 1; b >= 1; b--) if (!occupied.has(b)) return false;
  return true;
}

function calledStrike(s: GameState, rng: Rng, swinging: boolean) {
  s.strikes += 1;
  s.events.push({ type: "strike", swinging });
  say(s, swinging ? announcer.strikeSwinging : announcer.strikeLooking, rng);
  if (s.strikes >= 3) {
    const batter = currentBatterId(s);
    const st = stat(s, batter); st.ab += 1; st.k += 1;
    addOut(s, { type: "strikeout" });
    say(s, announcer.strikeout, rng);
    nextBatter(s);
  }
  setPhase(s, "result");
}

function ballCall(s: GameState, rng: Rng) {
  s.balls += 1;
  s.events.push({ type: "ball" });
  say(s, announcer.ball, rng);
  if (s.balls >= 4) {
    s.events.push({ type: "walk" });
    say(s, announcer.walk, rng);
    walk(s);
    nextBatter(s);
  }
  setPhase(s, "result");
}

function walk(s: GameState) {
  const batter = currentBatterId(s);
  // push forced runners
  const byBase = new Map(s.runners.map((r) => [r.to, r]));
  let base = 1;
  while (byBase.has(base)) base++;
  for (let b = base - 1; b >= 1; b--) {
    const r = byBase.get(b)!;
    r.from = b; r.to = b + 1; r.progress = 1; r.running = false;
    if (r.to === 4) { r.scored = true; scoreRun(s, r.kidId); }
  }
  s.runners = s.runners.filter((r) => !r.scored);
  s.runners.push({ kidId: batter, from: 0, to: 1, progress: 1, running: false, scored: false, out: false });
}

/* ---------- the ball is live ---------- */

function choosePursuit(s: GameState) {
  const b = s.ball;
  const land = b.onGround ? { x: b.pos.x + b.vel.x * 0.6, y: b.pos.y + b.vel.y * 0.6, t: 0 } : landingPoint(b.pos, b.vel);
  let best: Fielder | null = null, bestT = Infinity;
  for (const f of s.fielders) {
    const t = dist(f.x, f.y, land.x, land.y) / speedOf(s, f.kidId);
    if (t < bestT) { bestT = t; best = f; }
  }
  for (const f of s.fielders) {
    if (f === best) { f.targetX = land.x; f.targetY = land.y; continue; }
    // cover a base
    const cover: Record<string, number> = { "1B": 1, "2B": 2, SS: 2, "3B": 3, C: 4, P: 4 };
    const base = cover[f.pos];
    if (base) {
      const c = baseCoord(base);
      // second base is covered by whichever middle infielder is not chasing
      if ((f.pos === "2B" || f.pos === "SS") && best && (best.pos === "2B" || best.pos === "SS") && best !== f) { f.targetX = c.x; f.targetY = c.y; }
      else if (f.pos !== "2B" || !best || best.pos !== "SS") { f.targetX = c.x; f.targetY = c.y; }
      if (f.pos === "P" && best?.pos === "C") { f.targetX = 0; f.targetY = 0; }
      else if (f.pos === "P") { f.targetX = 0; f.targetY = FIELD.moundDist; }
    } else {
      f.targetX = (f.x + land.x) / 2; f.targetY = (f.y + land.y) / 2;
    }
  }
}

function inPlay(s: GameState, dt: number, inputs: Input[], rng: Rng) {
  const play = playOf(s);
  const ballWasAir = !s.ball.onGround;
  s.ball = stepBall(s.ball, dt, rng);

  // home run?
  if (!play.caughtChecked && ballWasAir && s.ball.onGround === false && distanceFromHome(s.ball.pos.x, s.ball.pos.y) >= FIELD.fence && s.ball.pos.z > 5) {
    const robber = s.fielders.find((f) => (f.pos === "LF" || f.pos === "CF" || f.pos === "RF") && kidById(s, f.kidId).trait === "robbed" && dist(f.x, f.y, s.ball.pos.x, s.ball.pos.y) < 22);
    if (robber && rng.chance(0.45)) {
      play.caughtChecked = true;
      say(s, announcer.robbed, rng);
      s.events.push({ type: "caught", by: robber.kidId });
      catchOut(s, robber.kidId, rng);
      return;
    }
    homeRun(s, rng);
    return;
  }
  if (!play.caughtChecked && ballWasAir && !s.ball.onGround && distanceFromHome(s.ball.pos.x, s.ball.pos.y) >= FIELD.fence + 6) { homeRun(s, rng); return; }

  if (s.ball.onGround && !play.fielded && !play.throwing) {
    if (!play.caughtChecked) { play.caughtChecked = true; releaseHolds(s); choosePursuit(s); }
    // a ball on the ground: fielders re-aim at where it is going
    if (Math.floor(s.phaseT * 4) !== Math.floor((s.phaseT - dt) * 4)) choosePursuit(s);
  }

  // fielders move
  for (const f of s.fielders) {
    if (play.holder === f.kidId) continue;
    const m = moveToward(f.x, f.y, f.targetX, f.targetY, speedOf(s, f.kidId) * 0.95, dt);
    f.x = m.x; f.y = m.y;
  }

  // catches and pickups
  if (!play.holder && !play.throwing) {
    for (const f of s.fielders) {
      const near = dist(f.x, f.y, s.ball.pos.x, s.ball.pos.y) < 3;
      if (!near) continue;
      const kid = kidById(s, f.kidId);
      if (!s.ball.onGround && s.ball.pos.z < 9 && s.ball.pos.z > 0 && s.ball.vel.z < 0) {
        const drop = kid.trait !== "sticky-glove" && kid.trait !== "homework" && rng.chance((1 - kid.fielding / 10) * 0.18);
        if (drop) { s.events.push({ type: "error", by: kid.id }); say(s, announcer.error, rng); s.ball.vel = { x: s.ball.vel.x * 0.3, y: s.ball.vel.y * 0.3, z: 0 }; s.ball.pos.z = 0; s.ball.onGround = true; play.caughtChecked = true; releaseHolds(s); continue; }
        play.caughtChecked = true;
        s.events.push({ type: "caught", by: kid.id });
        say(s, announcer.caught, rng);
        catchOut(s, kid.id, rng);
        return;
      }
      if (s.ball.onGround) {
        const bobble = kid.trait !== "sticky-glove" && kid.trait !== "homework" && rng.chance((1 - kid.fielding / 10) * 0.1);
        const lucky = play.batterId && kidById(s, play.batterId).trait === "lucky-bounce" && rng.chance(0.25);
        if (bobble || lucky) { if (bobble) { s.events.push({ type: "error", by: kid.id }); say(s, announcer.error, rng); } s.ball.vel = { x: rng.gauss() * 12, y: rng.gauss() * 12 + 6, z: 0 }; continue; }
        play.fielded = true;
        play.holder = kid.id;
        play.holdT = 0;
        s.ball.heldBy = kid.id;
        s.ball.vel = { x: 0, y: 0, z: 0 };
        s.events.push({ type: "fielded", by: kid.id });
        creditHit(s);
        break;
      }
    }
  }

  advanceRunners(s, dt, rng);

  // a fielder holds the ball: decide the throw
  if (play.holder && !play.throwing) {
    play.holdT += dt;
    const anyoneRunning = s.runners.some((r) => r.running && !r.scored && !r.out);
    if (!anyoneRunning) { endPlay(s, rng); return; }
    const team = fieldingTeam(s);
    const holder = s.fielders.find((f) => f.kidId === play.holder)!;
    if (team.human) {
      s.needsInput = "throw";
      setPhase(s, "throw-select");
      return;
    }
    if (play.holdT >= 0.25) startThrow(s, aiThrowBase(s, holder.x, holder.y), rng);
  }

  // a thrown ball arriving at a base
  if (play.throwing) {
    const b = baseCoord(play.throwTo);
    if (dist(s.ball.pos.x, s.ball.pos.y, b.x, b.y) < 3.5) {
      const coverer = s.fielders.find((f) => dist(f.x, f.y, b.x, b.y) < 6);
      play.throwing = false;
      if (coverer) {
        s.ball.heldBy = coverer.kidId; s.ball.vel = { x: 0, y: 0, z: 0 }; s.ball.pos = { x: b.x, y: b.y, z: 3 };
        play.holder = coverer.kidId; play.holdT = 0;
        const runner = s.runners.find((r) => r.running && !r.scored && !r.out && r.to === play.throwTo);
        if (runner && runner.progress < 0.97) {
          const forced = isForced(s, runner);
          const tagged = forced || rng.chance(0.7);
          const tough = kidById(s, runner.kidId).trait === "tough" && play.throwTo === 4;
          if (tagged && !tough) { runner.out = true; runner.running = false; addOut(s, { type: "out", runner: runner.kidId, base: play.throwTo }); say(s, announcer.out, rng); }
          else { s.events.push({ type: "safe", runner: runner.kidId, base: play.throwTo }); say(s, announcer.safe, rng); }
        }
      } else {
        // nobody there: the ball keeps going
        play.holder = null;
      }
      s.runners = s.runners.filter((r) => !r.out);
      if (s.outs >= 3) { endPlay(s, rng); return; }
    }
    if (s.phaseT > PLAY_TIME_CAP) { endPlay(s, rng); return; }
  }

  if (s.phaseT > PLAY_TIME_CAP) endPlay(s, rng);
  if (s.outs >= 3) endPlay(s, rng);
}

function releaseHolds(s: GameState) {
  for (const r of s.runners) if (!r.running && !r.scored && !r.out && r.progress < 1) r.running = true;
}

function creditHit(s: GameState) {
  const play = playOf(s);
  if (play.hitCredited) return;
  play.hitCredited = true;
  const st = stat(s, play.batterId);
  st.h += 1;
}

function catchOut(s: GameState, byKid: string, rng: Rng) {
  const play = playOf(s);
  const batter = s.runners.find((r) => r.kidId === play.batterId);
  if (batter) { batter.out = true; batter.running = false; }
  addOut(s, { type: "out", runner: play.batterId, base: 0 });
  // tag-up: runners who left early return
  for (const r of s.runners) {
    if (r.kidId === play.batterId) continue;
    if (r.running && r.progress < 0.6) { r.running = false; r.progress = 0; const t = r.to; r.to = r.from; r.from = t; r.progress = 1; r.from = r.to; }
  }
  s.runners = s.runners.filter((r) => !r.out);
  s.ball.heldBy = byKid; s.ball.vel = { x: 0, y: 0, z: 0 };
  play.holder = byKid;
  void rng;
  endPlay(s, rng);
}

function homeRun(s: GameState, rng: Rng) {
  const play = playOf(s);
  play.caughtChecked = true;
  const d = Math.round(distanceFromHome(s.ball.pos.x, s.ball.pos.y) + 25);
  s.events.push({ type: "homerun", distance: d });
  say(s, announcer.homerun, rng);
  creditHit(s);
  const st = stat(s, play.batterId); st.hr += 1;
  let rbi = 0;
  for (const r of s.runners) { if (!r.out) { r.scored = true; scoreRun(s, r.kidId); rbi += 1; } }
  st.rbi += rbi;
  s.runners = [];
  s.ball.live = false;
  nextBatter(s);
  s.lastResult = `HOME RUN · ${d} ft`;
  setPhase(s, "result");
}

function advanceRunners(s: GameState, dt: number, rng: Rng) {
  const play = playOf(s);
  for (const r of s.runners) {
    if (!r.running || r.scored || r.out) continue;
    const kid = kidById(s, r.kidId);
    r.progress += (speedOf(s, r.kidId) * dt) / FIELD.baseLen;
    if (r.progress >= 1) {
      r.progress = 1;
      if (r.to >= 4) {
        r.scored = true; r.running = false;
        scoreRun(s, r.kidId);
        stat(s, play.batterId).rbi += 1;
        say(s, announcer.score, rng);
        continue;
      }
      // keep going?
      const nextOcc = s.runners.some((o) => o !== r && !o.scored && !o.out && (o.running ? o.to : o.to) === r.to + 1);
      const ballFar = !s.ball.heldBy && dist(s.ball.pos.x, s.ball.pos.y, baseCoord(r.to + 1).x, baseCoord(r.to + 1).y) > 70;
      const jet = kid.trait === "stolen-base" && r.kidId === play.batterId && r.to === 1;
      const go = !nextOcc && (s.runnerMode === "send" || jet || (s.runnerMode === "auto" && (ballFar || (play.kind === "fly" && !s.ball.heldBy && distanceFromHome(s.ball.pos.x, s.ball.pos.y) > 120))));
      if (go && !(s.runnerMode === "hold")) { r.from = r.to; r.to += 1; r.progress = 0; }
      else { r.running = false; }
    }
  }
  s.runners = s.runners.filter((r) => !r.scored);
}

function startThrow(s: GameState, base: 1 | 2 | 3 | 4, rng: Rng) {
  const play = playOf(s);
  const holder = s.fielders.find((f) => f.kidId === play.holder);
  if (!holder) return;
  const kid = kidById(s, holder.kidId);
  const t = throwVelocity(holder.x, holder.y, base, kid.fielding, rng, kid.trait === "homework");
  if (t.error) { s.events.push({ type: "error", by: kid.id }); say(s, announcer.error, rng); }
  s.ball = { pos: { x: holder.x, y: holder.y, z: 4 }, vel: t.vel, live: true, onGround: false, heldBy: null, bounces: 0 };
  s.ball.vel.z = 0;
  play.throwing = true; play.throwTo = base; play.holder = null;
  s.events.push({ type: "throw", to: base });
  s.needsInput = null;
  // the ball travels flat: keep it in the air for the throw by disabling gravity via a tiny lift
  s.ball.pos.z = 4;
  if (s.phase === "throw-select") setPhase(s, "in-play");
}

function throwSelect(s: GameState, dt: number, inputs: Input[], rng: Rng) {
  const play = playOf(s);
  advanceRunners(s, dt, rng);
  const inp = inputs.find((i) => i.type === "throw");
  const holder = s.fielders.find((f) => f.kidId === play.holder);
  if (inp && inp.type === "throw") { startThrow(s, inp.base, rng); return; }
  if (!s.runners.some((r) => r.running && !r.scored && !r.out)) { s.needsInput = null; endPlay(s, rng); return; }
  if (s.phaseT >= 2.5 && holder) startThrow(s, aiThrowBase(s, holder.x, holder.y), rng);
}

function endPlay(s: GameState, rng: Rng) {
  const play = playOf(s);
  s.needsInput = null;
  for (const r of s.runners) { r.running = false; if (r.progress < 1) { r.to = r.from; r.progress = 1; } }
  s.runners = s.runners.filter((r) => !r.scored && !r.out);
  s.ball.live = false; s.ball.heldBy = null;
  if (play.batterId && !s.runners.some((r) => r.kidId === play.batterId)) {
    // the batter was put out (or scored): already handled
  }
  nextBatter(s);
  placeFielders(s);
  void rng;
  setPhase(s, s.outs >= 3 ? "half-end" : "result");
  if (s.outs >= 3) say(s, announcer.side, rng);
}

function afterResult(s: GameState, rng: Rng) {
  void rng;
  if (s.outs >= 3) { setPhase(s, "half-end"); return; }
  s.ball = idleBall();
  setPhase(s, "pitch-select");
}

function switchSides(s: GameState, rng: Rng) {
  if (gameShouldEnd(s)) {
    s.events.push({ type: "gameover", winner: winner(s) });
    setPhase(s, "game-over");
    return;
  }
  s.events.push({ type: "side" });
  s.outs = 0;
  resetCount(s);
  s.runners = [];
  if (s.top) s.top = false;
  else { s.top = true; s.inning += 1; }
  placeFielders(s);
  s.ball = idleBall();
  say(s, announcer.playBall, rng);
  setPhase(s, "pitch-select");
}
