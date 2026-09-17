import { ERAS, FIRST_YEAR, LAST_YEAR, eraForYear } from "@/lib/content/eras";
import type { EraId } from "@/lib/content/schema";

/**
 * How the 3D scene is rendered for a given year: the technology of the frontend growing up.
 * Each era has a base look; within an era the numbers slide with the year so 2011 sits between
 * 2009 and 2012 instead of snapping. Nothing here touches React state; the canvas reads it once per year.
 */
export type MaterialLook = "flat" | "gloss" | "pastel" | "pbr" | "cinematic";

export interface RenderProfile {
  era: EraId;
  /** 0 at 2005, 1 at 2026. */
  techLevel: number;
  /** 0 within the era's first year, 1 within its last. */
  eraT: number;
  /** Pixelation granularity in screen pixels; 0 = off. */
  pixelSize: number;
  /** Colour levels per channel for the posterize pass; 0 = off. */
  posterize: number;
  material: MaterialLook;
  bloom: number;
  grain: number;
  vignette: number;
  dof: boolean;
  chroma: number;
  fogDensity: number;
  shadows: boolean;
  particles: number;
  saturation: number;
  antialias: boolean;
}

const BASE: Record<EraId, Omit<RenderProfile, "era" | "techLevel" | "eraT">> = {
  xp: { pixelSize: 6, posterize: 9, material: "flat", bloom: 0, grain: 0, vignette: 0, dof: false, chroma: 0, fogDensity: 0.03, shadows: false, particles: 0.4, saturation: 1.05, antialias: false },
  aero: { pixelSize: 2, posterize: 0, material: "gloss", bloom: 0.5, grain: 0, vignette: 0.2, dof: false, chroma: 0, fogDensity: 0.025, shadows: false, particles: 0.7, saturation: 1.15, antialias: false },
  flat: { pixelSize: 0, posterize: 0, material: "pastel", bloom: 0, grain: 0, vignette: 0, dof: false, chroma: 0, fogDensity: 0.012, shadows: false, particles: 0.8, saturation: 1.2, antialias: true },
  dark: { pixelSize: 0, posterize: 0, material: "pbr", bloom: 0.7, grain: 0.18, vignette: 0.45, dof: false, chroma: 0, fogDensity: 0.03, shadows: false, particles: 1, saturation: 0.9, antialias: true },
  glass: { pixelSize: 0, posterize: 0, material: "cinematic", bloom: 0.9, grain: 0.08, vignette: 0.35, dof: true, chroma: 0.0015, fogDensity: 0.02, shadows: true, particles: 1.2, saturation: 1, antialias: true },
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function profileForYear(year: number): RenderProfile {
  const era = eraForYear(year);
  const eraT = era.to === era.from ? 0 : (year - era.from) / (era.to - era.from);
  const techLevel = (year - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR);
  const b = BASE[era.id];
  // Slide toward the next era's numbers as the era ages, but never change kind (material, dof, shadows).
  const nextIdx = ERAS.findIndex((e) => e.id === era.id) + 1;
  const n = nextIdx < ERAS.length ? BASE[ERAS[nextIdx].id] : b;
  const k = eraT * 0.5;
  return {
    era: era.id, techLevel, eraT,
    pixelSize: Math.round(lerp(b.pixelSize, n.pixelSize, k)),
    // Fixed per era: a changing constructor arg would rebuild the whole effect chain (a shader recompile) every year.
    posterize: b.posterize,
    material: b.material,
    bloom: lerp(b.bloom, n.bloom, k),
    grain: lerp(b.grain, n.grain, k),
    vignette: lerp(b.vignette, n.vignette, k),
    dof: b.dof,
    chroma: lerp(b.chroma, n.chroma, k),
    fogDensity: lerp(b.fogDensity, n.fogDensity, k),
    shadows: b.shadows,
    particles: lerp(b.particles, n.particles, k),
    saturation: lerp(b.saturation, n.saturation, k),
    antialias: b.antialias,
  };
}
