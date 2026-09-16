import type { GameState, Kid } from "@/lib/game/types";
import { FIELD, baseCoord } from "@/lib/game/types";
import { currentBatterId, fieldingTeam, battingTeam, kidById, pitcherId } from "@/lib/game/rules";
import { project, VW, VH } from "./project";
import { landingPoint } from "@/lib/game/physics";
import { PALETTE, drawKid, type Pose } from "./sprites";

type Ctx = CanvasRenderingContext2D;

export interface DrawOpts {
  fontDisplay: string;
  fontPixel: string;
  time: number;
  aim: { x: number; y: number } | null;
  meter: number | null;
  reducedMotion: boolean;
  shake: number;
  backdrop: HTMLImageElement | null;
  callout: { text: string; color: string; t: number } | null;
  trail: { x: number; y: number; z: number }[];
  spectators: Kid[];
}

const rect = (c: Ctx, x: number, y: number, w: number, h: number, color: string) => { c.fillStyle = color; c.fillRect(x, y, w, h); };

export function drawField(c: Ctx, t: number, backdrop: HTMLImageElement | null = null) {
  if (backdrop) {
    // the Higgsfield field art: sky, houses and trees behind the fence
    c.drawImage(backdrop, 0, 0, backdrop.width, Math.round(backdrop.height * 0.52), 0, 0, VW, 92);
  } else {
  // sky and the backyard beyond the fence
  const g = c.createLinearGradient(0, 0, 0, 90);
  g.addColorStop(0, PALETTE.skyDeep); g.addColorStop(1, PALETTE.sky);
  c.fillStyle = g; c.fillRect(0, 0, VW, 92);
  // pixel clouds
  c.fillStyle = "#ffffff";
  const cx = ((t * 3) % 400) - 40;
  for (const [ox, oy] of [[0, 14], [130, 26], [250, 10]] as const) {
    const x = Math.round(((ox + cx) % 400) - 40);
    c.fillRect(x + 6, oy, 26, 5); c.fillRect(x + 10, oy - 4, 14, 4); c.fillRect(x, oy + 5, 38, 4);
  }
  // houses and trees behind the fence
  for (let i = 0; i < 8; i++) {
    const hx = 4 + i * 42;
    rect(c, hx, 60, 26, 22, i % 2 ? "#e2c9a3" : "#d5b58c");
    rect(c, hx - 2, 54, 30, 7, "#8b3a2b");
    rect(c, hx + 4, 66, 6, 6, "#7fb3ff"); rect(c, hx + 16, 66, 6, 6, "#7fb3ff");
    rect(c, hx + 32, 66, 8, 16, "#2f7d2a"); rect(c, hx + 30, 60, 12, 8, "#3f9a2a");
  }
  }
  // grass
  rect(c, 0, 82, VW, VH - 82, PALETTE.grass);
  for (let y = 84; y < VH; y += 6) rect(c, 0, y, VW, 2, PALETTE.grassDark);
  // fence arc
  c.strokeStyle = PALETTE.fence; c.lineWidth = 3; c.beginPath();
  for (let a = -48; a <= 48; a += 2) {
    const r = (a * Math.PI) / 180;
    const p = project(Math.sin(r) * FIELD.fence, Math.cos(r) * FIELD.fence);
    if (a === -48) c.moveTo(p.sx, p.sy); else c.lineTo(p.sx, p.sy);
  }
  c.stroke();
  c.strokeStyle = PALETTE.fenceLight; c.lineWidth = 1; c.beginPath();
  for (let a = -48; a <= 48; a += 2) {
    const r = (a * Math.PI) / 180;
    const p = project(Math.sin(r) * FIELD.fence, Math.cos(r) * FIELD.fence);
    if (a === -48) c.moveTo(p.sx, p.sy - 2); else c.lineTo(p.sx, p.sy - 2);
  }
  c.stroke();
  // dirt infield
  c.fillStyle = PALETTE.dirt; c.beginPath();
  const inf = [[0, -8], [70, 60], [0, 118], [-70, 60]].map(([x, y]) => project(x, y));
  c.moveTo(inf[0].sx, inf[0].sy); inf.slice(1).forEach((p) => c.lineTo(p.sx, p.sy)); c.closePath(); c.fill();
  // grass diamond inside the dirt
  c.fillStyle = PALETTE.grass; c.beginPath();
  const inn = [[0, 12], [30, 42], [0, 72], [-30, 42]].map(([x, y]) => project(x, y));
  c.moveTo(inn[0].sx, inn[0].sy); inn.slice(1).forEach((p) => c.lineTo(p.sx, p.sy)); c.closePath(); c.fill();
  // foul lines
  c.strokeStyle = PALETTE.line; c.lineWidth = 1; c.beginPath();
  const h = project(0, 0), l = project(-140, 140), r2 = project(140, 140);
  c.moveTo(h.sx, h.sy); c.lineTo(l.sx, l.sy); c.moveTo(h.sx, h.sy); c.lineTo(r2.sx, r2.sy); c.stroke();
  // bases and mound
  for (let b = 1; b <= 3; b++) { const p = project(baseCoord(b).x, baseCoord(b).y); rect(c, Math.round(p.sx - 2), Math.round(p.sy - 2), 5, 3, "#ffffff"); }
  const hp = project(0, 0); rect(c, Math.round(hp.sx - 3), Math.round(hp.sy - 1), 6, 3, "#ffffff");
  const m = project(0, FIELD.moundDist); rect(c, Math.round(m.sx - 5), Math.round(m.sy - 1), 10, 3, PALETTE.dirtDark);
}

export function drawGame(c: Ctx, s: GameState, o: DrawOpts) {
  c.imageSmoothingEnabled = false;
  c.save();
  if (o.shake > 0 && !o.reducedMotion) c.translate(Math.round((Math.sin(o.time * 90) * o.shake)), 0);
  drawField(c, o.time, o.backdrop);
  drawBench(c, s, o);

  const fielding = fieldingTeam(s), batting = battingTeam(s);
  const entities: { y: number; draw: () => void }[] = [];

  // fielders
  for (const f of s.fielders) {
    const kid = kidById(s, f.kidId);
    const p = project(f.x, f.y);
    const moving = Math.hypot(f.targetX - f.x, f.targetY - f.y) > 1 && s.phase === "in-play";
    let pose: Pose = moving ? "run" : "field";
    if (f.pos === "P" && (s.phase === "windup")) pose = "pitch-wind";
    if (f.pos === "P" && s.phase === "pitch" && s.pitch && s.pitch.t < 0.2) pose = "pitch-throw";
    if (s.ball.heldBy === f.kidId) pose = "catch";
    entities.push({ y: p.sy, draw: () => drawKid(c, kid, p.sx, p.sy, fielding.color, pose, Math.floor(o.time * 8), f.x < 0 ? -1 : 1) });
  }
  // runners
  for (const r of s.runners) {
    const kid = kidById(s, r.kidId);
    const a = baseCoord(r.from), b = baseCoord(r.to);
    const x = a.x + (b.x - a.x) * r.progress, y = a.y + (b.y - a.y) * r.progress;
    const p = project(x, y);
    entities.push({ y: p.sy + 0.1, draw: () => drawKid(c, kid, p.sx, p.sy, batting.color, r.running ? "run" : "idle", Math.floor(o.time * 10), b.x >= a.x ? 1 : -1) });
  }
  // batter at the plate
  if (s.phase === "pitch-select" || s.phase === "windup" || s.phase === "pitch" || (s.phase === "result" && s.phaseT < 0.4)) {
    const kid = kidById(s, currentBatterId(s));
    const p = project(-4, 0);
    const swing = s.pitch?.swung && s.phase !== "pitch-select";
    entities.push({ y: p.sy + 0.2, draw: () => drawKid(c, kid, p.sx, p.sy + 2, batting.color, swing ? "bat-swing" : "bat-ready", 0, 1) });
  }
  entities.sort((a, b) => a.y - b.y).forEach((e) => e.draw());

  // ball trail and where it will land
  if (s.ball.live && !s.ball.onGround && !s.ball.heldBy) {
    const lp = landingPoint(s.ball.pos, s.ball.vel);
    const m = project(lp.x, lp.y);
    c.strokeStyle = "rgba(255,255,255,0.7)"; c.lineWidth = 1; c.beginPath(); c.ellipse(m.sx, m.sy, 4, 2, 0, 0, Math.PI * 2); c.stroke();
    o.trail.forEach((tp, i) => { const p = project(tp.x, tp.y, tp.z); c.fillStyle = `rgba(255,255,255,${(i / o.trail.length) * 0.5})`; c.fillRect(Math.round(p.sx), Math.round(p.sy), 1, 1); });
  }
  // ball
  if (s.ball.live || s.phase === "pitch" || s.phase === "windup") {
    const p = project(s.ball.pos.x, s.ball.pos.y, s.ball.pos.z);
    if (s.ball.pos.z > 0.5) { c.fillStyle = PALETTE.ballShadow; c.fillRect(Math.round(p.sx - 1), Math.round(p.ground - 1), 3, 2); }
    const r = s.ball.pos.z > 20 ? 2 : 1.5;
    c.fillStyle = PALETTE.ball; c.beginPath(); c.arc(p.sx, p.sy, r, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#b52b2b"; c.lineWidth = 0.6; c.stroke();
  }

  drawHud(c, s, o);
  drawZone(c, s, o);
  drawCallout(c, o);
  c.restore();
}

function drawHud(c: Ctx, s: GameState, o: DrawOpts) {
  rect(c, 0, 0, VW, 14, "rgba(10,36,106,0.85)");
  c.fillStyle = "#ffffff";
  c.font = `8px ${o.fontPixel}`;
  c.textBaseline = "middle";
  const away = s.teams.away, home = s.teams.home;
  c.textAlign = "left";
  c.fillText(`${away.name.split(" ").pop()?.toUpperCase()} ${s.score.away}`, 4, 7);
  c.textAlign = "right";
  c.fillText(`${home.name.split(" ").pop()?.toUpperCase()} ${s.score.home}`, VW - 4, 7);
  c.textAlign = "center";
  const lbl = s.phase === "game-over" ? "FINAL" : `${s.top ? "TOP" : "BOT"} ${s.inning}`;
  c.fillText(lbl, VW / 2, 7);
  // count and outs
  const cx = VW / 2 - 40;
  c.textAlign = "left";
  c.fillText(`B ${s.balls}  S ${s.strikes}`, cx - 30, 7);
  for (let i = 0; i < 3; i++) rect(c, VW / 2 + 28 + i * 6, 5, 4, 4, i < s.outs ? "#ffcc00" : "rgba(255,255,255,0.3)");
  // runner diamond (top right, under the score)
  const dx = VW - 16, dy = 24;
  const on = new Set(s.runners.filter((r) => !r.scored && !r.out).map((r) => (r.running ? r.from : r.to)));
  const dot = (x: number, y: number, filled: boolean) => { c.fillStyle = filled ? "#ffcc00" : "rgba(255,255,255,0.35)"; c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + 3, y); c.lineTo(x, y + 3); c.lineTo(x - 3, y); c.closePath(); c.fill(); };
  dot(dx + 5, dy, on.has(1)); dot(dx, dy - 5, on.has(2)); dot(dx - 5, dy, on.has(3));
  // nameplates: batter and pitcher
  if (s.phase !== "game-over") {
    const bat = kidById(s, currentBatterId(s)), pit = kidById(s, pitcherId(s));
    c.font = `7px ${o.fontPixel}`; c.textAlign = "left";
    rect(c, 2, 16, 96, 9, "rgba(0,0,0,0.5)"); c.fillStyle = "#ffffff";
    c.fillText(`AB ${(bat.nickname ?? bat.name.split(" ")[0]).toUpperCase()}`, 5, 21);
    rect(c, 2, 26, 96, 9, "rgba(0,0,0,0.5)"); c.fillStyle = "#cfe8ff";
    c.fillText(`P  ${(pit.nickname ?? pit.name.split(" ")[0]).toUpperCase()}`, 5, 31);
  }
}

function drawBench(c: Ctx, s: GameState, o: DrawOpts) {
  // the batting team's bench sits along the third-base fence, in their colours, and bobs when something happens
  const team = battingTeam(s);
  const busy = new Set([currentBatterId(s), ...s.runners.map((r) => r.kidId)]);
  const bench = team.kids.filter((k) => !busy.has(k.id)).slice(0, 6);
  bench.forEach((k, i) => {
    const p = project(-118 + i * 11, 96 + (i % 2) * 6);
    const bob = o.callout && o.callout.t < 0.6 ? Math.floor(o.time * 8 + i) % 2 : 0;
    drawKid(c, k, p.sx, p.sy - bob, team.color, "idle", 0, 1);
  });
  // and a couple of neighbourhood kids on the first-base side
  o.spectators.slice(0, 3).forEach((k, i) => {
    const p = project(112 + i * 10, 92 + (i % 2) * 6);
    drawKid(c, k, p.sx, p.sy, i % 2 ? "#e6e6e6" : "#ffcc66", "idle", 0, -1);
  });
}

export function drawCallout(c: Ctx, o: DrawOpts) {
  if (!o.callout) return;
  const { text, color, t } = o.callout;
  const life = 1.1;
  if (t > life) return;
  const inT = Math.min(1, t / 0.12);
  const outT = t > life - 0.25 ? (life - t) / 0.25 : 1;
  const scale = o.reducedMotion ? 1 : 0.6 + 0.4 * inT;
  c.save();
  c.globalAlpha = Math.max(0, Math.min(inT, outT));
  c.translate(VW / 2, 60);
  c.scale(scale, scale);
  c.font = `bold 22px ${o.fontDisplay}`;
  c.textAlign = "center"; c.textBaseline = "middle";
  c.lineWidth = 4; c.strokeStyle = "#1a1a1a"; c.lineJoin = "round";
  c.strokeText(text, 0, 0);
  c.fillStyle = "#1a1a1a"; c.fillText(text, 3, 3);
  c.fillStyle = color; c.fillText(text, 0, 0);
  c.restore();
}

function drawZone(c: Ctx, s: GameState, o: DrawOpts) {
  const show = s.phase === "pitch-select" || s.phase === "windup" || s.phase === "pitch";
  if (!show) return;
  const bx = 6, by = VH - 62, size = 56;
  rect(c, bx, by, size, size, "rgba(0,0,0,0.55)");
  rect(c, bx + 12, by + 12, 32, 32, "rgba(255,255,255,0.12)");
  c.strokeStyle = "#ffffff"; c.lineWidth = 1; c.strokeRect(bx + 12.5, by + 12.5, 32, 32);
  const toPx = (x: number, y: number) => ({ x: bx + 28 + x * 16, y: by + 28 - y * 16 });
  if (o.aim && s.phase === "pitch-select") {
    const a = toPx(o.aim.x, o.aim.y);
    c.strokeStyle = "#ffcc00"; c.beginPath(); c.moveTo(a.x - 4, a.y); c.lineTo(a.x + 4, a.y); c.moveTo(a.x, a.y - 4); c.lineTo(a.x, a.y + 4); c.stroke();
  }
  if (s.pitch && (s.phase === "pitch" || s.phase === "windup")) {
    const p = Math.min(1, s.pitch.t / s.pitch.duration);
    const cur = toPx(s.pitch.locX * p + (s.pitch.breakX ? -s.pitch.breakX * (1 - p) * p : 0), s.pitch.locY * p + (s.pitch.breakY ? -s.pitch.breakY * (1 - p) * p : 0));
    const r = 1 + p * 4;
    c.fillStyle = "#ffffff"; c.beginPath(); c.arc(cur.x, cur.y, r, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#b52b2b"; c.lineWidth = 0.8; c.stroke();
  }
  if (o.meter !== null) {
    rect(c, bx + size + 4, by, 6, size, "rgba(0,0,0,0.55)");
    const h = Math.round(o.meter * (size - 4));
    rect(c, bx + size + 6, by + size - 2 - h, 2, h, o.meter > 0.85 ? "#6cff8a" : "#ffcc00");
  }
}

export function drawKidPreview(c: Ctx, kid: Kid, color: string) {
  c.imageSmoothingEnabled = false;
  c.clearRect(0, 0, c.canvas.width, c.canvas.height);
  c.save(); c.scale(3, 3);
  drawKid(c, kid, c.canvas.width / 6, c.canvas.height / 3 - 1, color, "idle", 0, 1);
  c.restore();
}
