"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneContext, type SceneInfo } from "./SceneContext";
import { SeasonWorld } from "./SeasonWorld";
import { profileForYear } from "@/lib/three/profile";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { useSettings } from "@/lib/settings/SettingsContext";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch { return false; }
}

function deviceBudget(): number {
  const cores = navigator.hardwareConcurrency ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return (cores <= 4 ? 0.5 : 1) * (coarse ? 0.6 : 1);
}

/**
 * The sticky WebGL layer behind a year. Client-only (loaded with next/dynamic), DPR capped,
 * paused while the tab is hidden, a still frame under reduced motion, nothing at all without WebGL.
 */
export default function YearCanvasInner({ year }: { year: number }) {
  const [ok] = useState(hasWebGL);
  const [budget] = useState(deviceBudget);
  const [visible, setVisible] = useState(true);
  const reduced = usePrefersReducedMotion();
  const { effects } = useSettings();
  const profile = useMemo(() => profileForYear(year), [year]);
  const info = useMemo<SceneInfo>(() => ({ year, profile, reduced, budget }), [year, profile, reduced, budget]);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!ok || !effects) return null;

  return (
    <div className="h-full w-full" data-three={profile.era} aria-hidden="true">
      <Canvas
        dpr={profile.pixelSize > 0 ? 1 : profile.bloom > 0 || profile.dof ? [1, 1.25] : [1, 1.5]}
        frameloop={reduced ? "demand" : visible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
        camera={{ fov: 46, near: 0.5, far: 260, position: [-34, 20, 44] }}
        shadows={profile.shadows}
        style={{ imageRendering: profile.pixelSize > 0 ? "pixelated" : "auto" }}
      >
        <SceneContext.Provider value={info}>
          <SeasonWorld />
        </SceneContext.Provider>
      </Canvas>
    </div>
  );
}
