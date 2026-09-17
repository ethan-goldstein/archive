import { eraForYear } from "@/lib/content/eras";

/**
 * The browser frame around the archive grows up with the year:
 *   xp (2005–08) a Windows 98 / IE window · aero (2009–12) a Windows 7 window with a tab strip ·
 *   flat (2013–16) an iOS 7 style app · dark (2017–20) a streaming app · glass (2021–25) a frosted window ·
 *   spatial (2026) no chrome at all, just a floating capsule.
 * The Win 98 / Mac OS 9 switch in the toolbar overrides all of it.
 */
export const FRAME_IDS = ["xp", "aero", "flat", "dark", "glass", "spatial"] as const;
export type FrameId = (typeof FRAME_IDS)[number];

export function frameForYear(year: number): FrameId {
  const era = eraForYear(year).id;
  if (era === "glass") return year >= 2026 ? "spatial" : "glass";
  return era;
}

let current: FrameId = "xp";
const listeners = new Set<() => void>();
export const frameStore = {
  subscribe(cb: () => void) { listeners.add(cb); return () => { listeners.delete(cb); }; },
  get: () => current,
  getServer: () => "xp" as FrameId,
  set(frame: FrameId) { if (frame === current) return; current = frame; listeners.forEach((l) => l()); },
};

/** Where the window buttons sit: classic Windows on the right, Mac and modern frames on the left. */
export function buttonsFor(frame: FrameId, skin: "win" | "mac"): "left" | "right" {
  if (skin === "mac") return "left";
  return frame === "glass" || frame === "spatial" ? "left" : "right";
}
