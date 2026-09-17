"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Sky, PALETTES, mixPalette } from "./fx/Sky";
import { Winter } from "./seasons/Winter";
import { Spring } from "./seasons/Spring";
import { Summer } from "./seasons/Summer";
import { Fall } from "./seasons/Fall";
import { CameraRig } from "./CameraRig";
import { Effects } from "./fx/Effects";
import { SET_X } from "./layout";
import { useScene } from "./SceneContext";
import { scrollStore } from "@/lib/scroll/progress";
import { SEASONS } from "@/lib/content/seasons";

const tmp = new THREE.Color();
const fog = new THREE.FogExp2("#96a9cc", 0.03);

/** The whole year in one world: four sets in a row, one sky, one fog, lights that follow the blend. */
export function SeasonWorld() {
  const { profile } = useScene();
  const get = useThree((s) => s.get);
  const sets = useRef<Record<string, THREE.Group | null>>({});
  const ambient = useRef<THREE.AmbientLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  useEffect(() => {
    const { scene, gl } = get();
    fog.density = profile.fogDensity;
    scene.fog = fog;
    gl.toneMapping = profile.material === "pbr" || profile.material === "cinematic" ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    gl.toneMappingExposure = profile.material === "cinematic" ? 1.1 : 1;
    gl.shadowMap.enabled = profile.shadows;
    return () => { scene.fog = null; };
  }, [get, profile]);

  useFrame(() => {
    mixPalette("fog", fog.color, tmp);
    for (const s of SEASONS) { const g = sets.current[s]; if (g) g.visible = scrollStore.state.weights[s] > 0.01; }
    if (ambient.current) { mixPalette("ambient", ambient.current.color, tmp); }
    if (sun.current) {
      mixPalette("light", sun.current.color, tmp);
      const w = scrollStore.state.weights;
      let x = 0, y = 0, z = 0, cx = 0;
      for (const s of SEASONS) { const d = PALETTES[s].lightDir; x += d[0] * w[s]; y += d[1] * w[s]; z += d[2] * w[s]; cx += SET_X[s] * w[s]; }
      sun.current.position.set(cx + x * 6, y * 6, z * 6);
      sun.current.target.position.set(cx, 0, -6);
      sun.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      <Sky bands={profile.posterize ? 5 : 0} />
      <ambientLight ref={ambient} intensity={profile.material === "pastel" ? 1.4 : 0.9} />
      <hemisphereLight args={["#cfd8ff", "#3a2a1a", 0.35]} />
      <directionalLight ref={sun} intensity={profile.material === "pastel" ? 1.2 : 1.8} castShadow={profile.shadows} shadow-mapSize={[1024, 1024]} shadow-camera-near={1} shadow-camera-far={120} shadow-camera-left={-40} shadow-camera-right={40} shadow-camera-top={40} shadow-camera-bottom={-40} />
      <group ref={(g) => { sets.current.winter = g; }} position={[SET_X.winter, 0, 0]}><Winter /></group>
      <group ref={(g) => { sets.current.spring = g; }} position={[SET_X.spring, 0, 0]}><Spring /></group>
      <group ref={(g) => { sets.current.summer = g; }} position={[SET_X.summer, 0, 0]}><Summer /></group>
      <group ref={(g) => { sets.current.fall = g; }} position={[SET_X.fall, 0, 0]}><Fall /></group>
      <CameraRig />
      <Effects />
    </>
  );
}
