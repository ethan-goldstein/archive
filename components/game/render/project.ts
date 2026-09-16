/** 320×180 virtual screen. World: feet, home plate at the origin, +y toward centre field. */
export const VW = 320;
export const VH = 180;
const K = 0.78;

export function project(x: number, y: number, z = 0) {
  return { sx: 160 + x * K, sy: 166 - y * K * 0.52 - z * 0.55, ground: 166 - y * K * 0.52 };
}

/** Screen → world on the ground plane (for pointer aiming). */
export function unproject(sx: number, sy: number) {
  return { x: (sx - 160) / K, y: (166 - sy) / (K * 0.52) };
}
