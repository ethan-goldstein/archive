"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../fx/Particles";
import { Ground, House, Orb, Tree } from "../props";
import { EraMaterial } from "../EraMaterial";
import { useScene } from "../SceneContext";

const LEAVES = ["#e8642c", "#f2a33a", "#c9401d", "#f6c453", "#8a2f1b"];

/** The reference chapter: leaves in the air, a porch with a jack-o'-lantern, a big moon, amber fog. */
export function Fall() {
  const { reduced } = useScene();
  const lantern = useRef<THREE.PointLight>(null);
  useFrame((s) => {
    if (lantern.current && !reduced) lantern.current.intensity = 6 + Math.sin(s.clock.elapsedTime * 9) * 0.8 + Math.sin(s.clock.elapsedTime * 23) * 0.5;
  });

  return (
    <group>
      <Ground color="#5b4a2c" />
      {/* a lawn of fallen leaves */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 2]}>
        <circleGeometry args={[18, 20]} />
        <EraMaterial color="#8a5a2a" />
      </mesh>
      <House position={[0, 0, -8]} body="#b58a6a" roof="#3a2620" glow={1.8} />
      {/* porch and pumpkin */}
      <mesh position={[0, 0.3, -3.6]}><boxGeometry args={[10, 0.6, 3]} /><EraMaterial color="#6f4a34" /></mesh>
      <group position={[3.2, 1.05, -2.6]}>
        <mesh><sphereGeometry args={[0.7, 12, 10]} /><EraMaterial color="#ff7a1f" emissive="#ff5a00" emissiveIntensity={0.9} /></mesh>
        <mesh position={[0, 0.75, 0]}><cylinderGeometry args={[0.1, 0.14, 0.3, 6]} /><EraMaterial color="#3d5a2a" /></mesh>
        <pointLight ref={lantern} color="#ff8c2a" intensity={6} distance={16} decay={2} />
      </group>
      <Tree position={[-12, 0, -2]} canopy="#e8642c" height={7} />
      <Tree position={[11, 0, 0]} canopy="#f2a33a" height={6} />
      <Tree position={[-9, 0, -16]} canopy="#c9401d" height={5} />
      <Tree position={[18, 0, -10]} canopy="#f6c453" height={6.5} />
      <Tree position={[-20, 0, -12]} canopy="#8a2f1b" height={7} />
      {/* the school bus, parked for the night */}
      <group position={[16, 0, 12]} rotation={[0, 0.5, 0]}>
        <mesh position={[0, 1.4, 0]}><boxGeometry args={[7, 2.2, 2.4]} /><EraMaterial color="#f7c531" /></mesh>
        {[-2.2, -0.8, 0.6, 2].map((x) => (
          <mesh key={x} position={[x, 1.7, 1.21]}><planeGeometry args={[1, 0.8]} /><EraMaterial color="#2a2a30" /></mesh>
        ))}
        {[-2.4, 2.4].map((x) => (
          <mesh key={x} position={[x, 0.5, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.5, 0.5, 2.6, 8]} /><EraMaterial color="#1e1e22" /></mesh>
        ))}
      </group>
      <Orb position={[-24, 30, -70]} radius={9} color="#ffe6b8" intensity={0.5} />
      <Particles count={1400} colors={LEAVES} area={[28, 11, 22]} speed={0.7} sway={1.8} size={1.4} />
    </group>
  );
}
