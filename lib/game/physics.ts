import { FIELD, baseCoord, type Ball, type Vec3 } from "./types";
import type { Rng } from "./rng";

const DRAG = 0.0045;      // per foot/s, crude air resistance
const RESTITUTION = 0.35;
const ROLL_FRICTION = 8;  // ft/s^2 while rolling

export function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.hypot(ax - bx, ay - by);
}

export function moveToward(x: number, y: number, tx: number, ty: number, speed: number, dt: number) {
  const d = dist(x, y, tx, ty);
  if (d < 0.001) return { x: tx, y: ty, arrived: true };
  const step = speed * dt;
  if (step >= d) return { x: tx, y: ty, arrived: true };
  return { x: x + ((tx - x) / d) * step, y: y + ((ty - y) / d) * step, arrived: false };
}

/** Advances a live ball one tick: gravity, drag, bounces, rolling. */
export function stepBall(b: Ball, dt: number, rng: Rng): Ball {
  if (!b.live || b.heldBy) return b;
  const pos = { ...b.pos };
  const vel = { ...b.vel };
  if (!b.onGround) {
    const speed = Math.hypot(vel.x, vel.y, vel.z);
    const drag = 1 - DRAG * speed * dt;
    vel.x *= drag; vel.y *= drag; vel.z *= drag;
    vel.z -= FIELD.gravity * dt;
    pos.x += vel.x * dt; pos.y += vel.y * dt; pos.z += vel.z * dt;
    if (pos.z <= 0) {
      pos.z = 0;
      const bounces = b.bounces + 1;
      if (Math.abs(vel.z) > 6) {
        vel.z = -vel.z * RESTITUTION;
        // an uneven backyard: bounces wander a little
        vel.x += rng.gauss() * 2;
        vel.y += rng.gauss() * 2;
        return { ...b, pos, vel, bounces };
      }
      vel.z = 0;
      return { ...b, pos, vel, bounces, onGround: true };
    }
    return { ...b, pos, vel };
  }
  const speed = Math.hypot(vel.x, vel.y);
  if (speed < 0.5) return { ...b, vel: { x: 0, y: 0, z: 0 } };
  const ns = Math.max(0, speed - ROLL_FRICTION * dt);
  vel.x *= ns / speed; vel.y *= ns / speed;
  pos.x += vel.x * dt; pos.y += vel.y * dt;
  return { ...b, pos, vel };
}

/** Where a ball in flight first meets the ground, ignoring drag (good enough for fielders to aim). */
export function landingPoint(pos: Vec3, vel: Vec3): { x: number; y: number; t: number } {
  const g = FIELD.gravity;
  const disc = vel.z * vel.z + 2 * g * pos.z;
  const t = (vel.z + Math.sqrt(Math.max(0, disc))) / g;
  return { x: pos.x + vel.x * t * 0.92, y: pos.y + vel.y * t * 0.92, t };
}

/** Batted-ball velocity from contact quality, timing error and the batter's stats. */
export function battedBall(opts: {
  quality: number; timingErr: number; power: number; rng: Rng; bunt: boolean; moonshot: boolean; allOrNothing: boolean;
}): { vel: Vec3; kind: "grounder" | "liner" | "fly" | "popup" | "bunt"; foul: boolean; angle: number; launch: number } {
  const { quality, timingErr, power, rng, bunt } = opts;
  if (bunt) {
    const angle = rng.range(-35, 35);
    const launch = rng.range(3, 14);
    const v = rng.range(16, 26);
    return { vel: toVel(v, angle, launch), kind: "bunt", foul: Math.abs(angle) > 44, angle, launch };
  }
  const q = Math.max(0, Math.min(1, quality));
  const exit = (44 + power * 6.5) * (0.5 + 0.5 * q) * (opts.allOrNothing ? 1.15 : 1);
  let launch = 10 + 34 * (q - 0.45) + rng.gauss() * 9;
  if (opts.moonshot) launch += 6;
  if (q < 0.35 && rng.chance(0.4)) launch = rng.range(48, 70); // mis-hit pop-up
  // right-handed batters pull to the left (negative angle) when early
  const angle = timingErr * 280 + rng.gauss() * 10 + (1 - q) * rng.gauss() * 14;
  const foul = Math.abs(angle) > 45;
  const kind = launch < 8 ? "grounder" : launch < 24 ? "liner" : launch < 48 ? "fly" : "popup";
  return { vel: toVel(exit, angle, Math.max(-8, launch)), kind, foul, angle, launch };
}

function toVel(speed: number, angleDeg: number, launchDeg: number): Vec3 {
  const a = (angleDeg * Math.PI) / 180;
  const l = (launchDeg * Math.PI) / 180;
  const h = speed * Math.cos(l);
  return { x: h * Math.sin(a), y: h * Math.cos(a), z: speed * Math.sin(l) };
}

/** Throw from a fielder toward a base: fast, flat, with an error chance that scales with fielding. */
export function throwVelocity(fromX: number, fromY: number, base: number, fielding: number, rng: Rng, homework: boolean): { vel: Vec3; error: boolean } {
  const b = baseCoord(base);
  const d = dist(fromX, fromY, b.x, b.y);
  const speed = 62 + fielding * 3.2;
  const error = !homework && rng.chance((1 - fielding / 10) * 0.12);
  let tx = b.x, ty = b.y;
  if (error) { tx += rng.gauss() * 9; ty += rng.gauss() * 9; }
  const t = Math.max(0.05, d / speed);
  return { vel: { x: (tx - fromX) / t, y: (ty - fromY) / t, z: 0 }, error };
}

/** Distance from home plate (feet). */
export function distanceFromHome(x: number, y: number) {
  return Math.hypot(x, y);
}
