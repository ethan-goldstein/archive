"use client";

import { createContext, useContext } from "react";
import { profileForYear, type RenderProfile } from "@/lib/three/profile";

export interface SceneInfo {
  year: number;
  profile: RenderProfile;
  /** prefers-reduced-motion: one still frame, no drifting particles, camera jumps between chapters. */
  reduced: boolean;
  /** Particle multiplier from the device (cores, pointer). */
  budget: number;
}

export const SceneContext = createContext<SceneInfo>({ year: 2005, profile: profileForYear(2005), reduced: false, budget: 1 });
export const useScene = () => useContext(SceneContext);
