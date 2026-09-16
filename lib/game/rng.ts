/** Mulberry32: tiny, seedable, deterministic. The engine never touches Math.random. */
export function next(seed: number): { seed: number; value: number } {
  const t = (seed + 0x6d2b79f5) | 0;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
  return { seed: t, value: ((r ^ (r >>> 14)) >>> 0) / 4294967296 };
}

/** A stateful cursor around `next` for use inside one step; write `rng.seed` back into the state. */
export class Rng {
  constructor(public seed: number) {}
  float(): number {
    const r = next(this.seed);
    this.seed = r.seed;
    return r.value;
  }
  range(min: number, max: number): number {
    return min + (max - min) * this.float();
  }
  /** approximately normal(0,1) via sum of 3 uniforms */
  gauss(): number {
    return (this.float() + this.float() + this.float() - 1.5) * 2;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.float() * arr.length) % arr.length];
  }
  chance(p: number): boolean {
    return this.float() < p;
  }
}
