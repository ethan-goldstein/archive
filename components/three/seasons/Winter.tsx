"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../fx/Particles";
import { Dog, Ground, House, Orb, Tree } from "../props";
import { EraMaterial } from "../EraMaterial";
import { useScene } from "../SceneContext";
import { scrollStore } from "@/lib/scroll/progress";

const SNOW = ["#ffffff", "#e8f0ff", "#d0e0ff"];

/** Snow, a warm house, a birthday candle that flares mid-chapter, and Fenway on the lawn 2009–2013. */
export function Winter() {
  const { year } = useScene();
  const candle = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const t = scrollStore.state.ts.winter ?? 0;
    const beat = Math.max(0, 1 - Math.abs(t - 0.45) * 5);
    if (candle.current) candle.current.intensity = 2 + beat * 40;
  });

  return (
    <group>
      <Ground color="#eaf0f8" />
      <House position={[0, 0, -6]} body="#d8c9a8" roof="#2f3446" glow={1.6} />
      <Tree position={[-11, 0, -2]} bare height={6} />
      <Tree position={[10, 0, -8]} bare height={5} />
      <Tree position={[14, 0, 2]} bare height={4} />
      {/* the candle: one bright point in the left window on the birthday beat */}
      <group position={[-2.4, 2.2, -2.8]}>
        <mesh>
          <boxGeometry args={[0.5, 0.35, 0.3]} />
          <EraMaterial color="#ffe6c0" emissive="#ffb347" emissiveIntensity={1.4} />
        </mesh>
        <pointLight ref={candle} color="#ffb347" intensity={2} distance={14} decay={2} />
      </group>
      {year >= 2009 && year <= 2013 ? <Dog position={[4.5, 0, 1.5]} /> : null}
      <Orb position={[-30, 26, -60]} radius={3.2} color="#fff5dc" intensity={0.4} />
      <Particles count={1600} colors={SNOW} area={[26, 12, 20]} speed={1.1} sway={0.5} size={1.1} />
      <group position={[0, 8, 0]}>
        <Particles count={300} colors={["#dfe9ff"]} area={[40, 10, 30]} speed={0.4} sway={1.2} size={0.6} />
      </group>
    </group>
  );
}
