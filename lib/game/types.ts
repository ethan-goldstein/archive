/** Potomac Sandlot — shared types. The engine is pure: no DOM, no Date, no Math.random. */

export type Stat = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Trait =
  | "clutch" | "moonshot" | "stolen-base" | "rocket-arm" | "lucky-bounce" | "twin-telepathy"
  | "sticky-glove" | "bunt-queen" | "all-or-nothing" | "curveball" | "robbed" | "wild-card" | "tough" | "homework" | "none";

export interface Look {
  skin: 0 | 1 | 2 | 3;
  hair: 0 | 1 | 2 | 3 | 4 | 5;
  hairColor: string;
  size: "small" | "medium" | "big";
  accessory?: "cap" | "glasses" | "headband" | "cast" | "bandana" | "none";
}

export interface Kid {
  id: string;
  name: string;
  nickname?: string;
  age: number;
  bio: string;
  batting: Stat;
  power: Stat;
  speed: Stat;
  pitching: Stat;
  fielding: Stat;
  trait: Trait;
  look: Look;
  /** true for kids added by Ethan in content/game/roster.ts personalSlots */
  personal?: boolean;
  /** Optional Higgsfield-generated card under public/game/cards/<id>.png */
  card?: string;
}

export type Position = "P" | "C" | "1B" | "2B" | "3B" | "SS" | "LF" | "CF" | "RF";
export const POSITIONS: Position[] = ["P", "C", "1B", "2B", "3B", "SS", "LF", "CF", "RF"];

export interface Team {
  id: "home" | "away";
  name: string;
  color: string;
  colorAlt: string;
  kids: Kid[];
  /** kid ids by batting order */
  lineup: string[];
  /** position -> kid id */
  positions: Record<Position, string>;
  human: boolean;
}

export type PitchKind = "fastball" | "curve" | "changeup" | "special";

export interface Vec3 { x: number; y: number; z: number }

export interface Ball {
  pos: Vec3;
  vel: Vec3;
  live: boolean;
  onGround: boolean;
  /** who holds the ball, if anyone */
  heldBy: string | null;
  bounces: number;
}

export interface Fielder {
  kidId: string;
  pos: Position;
  x: number; y: number;
  targetX: number; targetY: number;
}

export interface Runner {
  kidId: string;
  /** 0 = home (batter), 1, 2, 3 = bases; progress 0..1 toward `to` */
  from: number;
  to: number;
  progress: number;
  /** committed to advancing on this play */
  running: boolean;
  scored: boolean;
  out: boolean;
}

export type Phase =
  | "pitch-select"   // pitcher chooses a pitch (human input or AI)
  | "windup"         // short pause before release
  | "pitch"          // ball flying to the plate; batter may swing
  | "in-play"        // ball is live; fielders and runners move
  | "throw-select"   // human fielder holding the ball chooses a base
  | "result"         // play resolved; pause to show the result
  | "half-end"       // three outs; side change screen
  | "game-over";

export interface Pitch {
  kind: PitchKind;
  /** aim in strike-zone units (-1..1 is the zone) */
  aimX: number; aimY: number;
  /** actual location after control error */
  locX: number; locY: number;
  /** seconds from release to plate */
  duration: number;
  t: number;
  breakX: number; breakY: number;
  /** batter already swung / decided on this pitch */
  swung: boolean;
  bunt: boolean;
}

export type PlayEvent =
  | { type: "ball" } | { type: "strike"; swinging: boolean } | { type: "foul" }
  | { type: "walk" } | { type: "strikeout" }
  | { type: "contact"; quality: number; kind: "grounder" | "liner" | "fly" | "popup" | "bunt" }
  | { type: "homerun"; distance: number } | { type: "caught"; by: string } | { type: "fielded"; by: string }
  | { type: "throw"; to: number } | { type: "out"; runner: string; base: number } | { type: "safe"; runner: string; base: number }
  | { type: "score"; runner: string } | { type: "error"; by: string } | { type: "steal"; runner: string; base: number }
  | { type: "side" } | { type: "gameover"; winner: "home" | "away" | "tie" };

export type Difficulty = "easy" | "normal" | "hard";
export interface GameConfig {
  innings: number;
  mercy: number;
  seed: number;
  difficulty?: Difficulty;
}

export interface GameState {
  config: GameConfig;
  seed: number;
  phase: Phase;
  phaseT: number;
  inning: number;
  top: boolean;
  outs: number;
  balls: number;
  strikes: number;
  score: { home: number; away: number };
  teams: { home: Team; away: Team };
  batterIndex: { home: number; away: number };
  ball: Ball;
  pitch: Pitch | null;
  fielders: Fielder[];
  runners: Runner[];
  /** last few announcer lines */
  log: string[];
  events: PlayEvent[];
  /** pending human decision */
  needsInput: "pitch" | "throw" | null;
  runnerMode: "auto" | "send" | "hold";
  lastResult: string;
  stats: Record<string, { ab: number; h: number; hr: number; rbi: number; k: number; r: number }>;
}

export type Input =
  | { type: "pitch"; kind: PitchKind; aimX: number; aimY: number; meter: number }
  | { type: "swing"; bunt?: boolean }
  | { type: "throw"; base: 1 | 2 | 3 | 4 }
  | { type: "runners"; mode: "auto" | "send" | "hold" }
  | { type: "continue" };

export const FIELD = {
  baseLen: 60,          // feet between bases
  moundDist: 44,        // pitcher rubber to plate
  fence: 175,           // distance to the fence (short: it is a backyard)
  gravity: 32.2,
} as const;

export function baseCoord(base: number): { x: number; y: number } {
  const d = FIELD.baseLen / Math.SQRT2;
  switch (base % 4) {
    case 1: return { x: d, y: d };
    case 2: return { x: 0, y: 2 * d };
    case 3: return { x: -d, y: d };
    default: return { x: 0, y: 0 };
  }
}

export const DEFAULT_FIELD_POS: Record<Position, { x: number; y: number }> = {
  P: { x: 0, y: FIELD.moundDist },
  C: { x: 0, y: -6 },
  "1B": { x: 50, y: 40 },
  "2B": { x: 25, y: 80 },
  SS: { x: -25, y: 80 },
  "3B": { x: -50, y: 40 },
  LF: { x: -85, y: 125 },
  CF: { x: 0, y: 150 },
  RF: { x: 85, y: 125 },
};

export function overall(k: Kid): number {
  return (k.batting * 1.2 + k.power + k.speed + k.pitching * 0.8 + k.fielding) / 5;
}
