"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SceneContext, type SceneInfo } from "@/components/three/SceneContext";
import { RoadScene } from "@/components/three/RoadScene";
import { profileForYear } from "@/lib/three/profile";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { useSettings } from "@/lib/settings/SettingsContext";

function hasWebGL(): boolean {
  try { const c = document.createElement("canvas"); return !!(c.getContext("webgl2") || c.getContext("webgl")); } catch { return false; }
}

/** The road behind the scrubber. `year` is the rounded scrubber year, which picks the render profile. */
export default function TimelineRoadInner({ year }: { year: number }) {
  const [ok] = useState(hasWebGL);
  const [visible, setVisible] = useState(true);
  const reduced = usePrefersReducedMotion();
  const { effects } = useSettings();
  const profile = useMemo(() => profileForYear(year), [year]);
  const info = useMemo<SceneInfo>(() => ({ year, profile, reduced, budget: 1 }), [year, profile, reduced]);

  useEffect(() => {
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!ok || !effects) return null;
  return (
    <div className="h-full w-full" data-three={profile.era} aria-hidden="true">
      <Canvas
        dpr={profile.pixelSize > 0 ? 1 : [1, 1.5]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false, stencil: false }}
        camera={{ fov: 50, near: 0.5, far: 300, position: [3.5, 4, 11] }}
        style={{ imageRendering: profile.pixelSize > 0 ? "pixelated" : "auto" }}
      >
        <SceneContext.Provider value={info}><RoadScene /></SceneContext.Provider>
      </Canvas>
    </div>
  );
}
