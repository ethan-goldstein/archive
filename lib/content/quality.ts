import type { EraId } from "./schema";

/** How each era is rendered, in the language of the screens of the time. Shown on the hub and the year strip. */
export const QUALITY: Record<EraId, { label: string; note: string }> = {
  xp: { label: "240p", note: "Pixelated, a handful of colours, motion in steps." },
  aero: { label: "480p", note: "Half resolution, glossy, a first hint of bloom." },
  flat: { label: "720p", note: "Full resolution, flat colour, clean edges." },
  dark: { label: "1080p", note: "Real lighting, grain, soft shadow." },
  glass: { label: "4K", note: "Depth of field, layered light, long soft motion." },
};
