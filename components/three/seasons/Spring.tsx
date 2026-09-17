"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../fx/Particles";
import { Ground, Orb, Tree } from "../props";
import { EraMaterial } from "../EraMaterial";
import { scrollStore } from "@/lib/scroll/progress";

const PETALS = ["#ffc9d9", "#ffe0e8", "#fff1f4", "#f5b6c8"];
const ballPos = new THREE.Vector3();
const FENCE = Array.from({ length: 17 }, (_, i) => (i / 16) * Math.PI - Math.PI / 2 - Math.PI / 4);

/** A low-poly diamond: dirt infield, bases, mound, a fence arc, light poles, petals, and a ball that flies with the scroll. */
export function Spring() {
  const ball = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 1, 2), new THREE.Vector3(-6, 11, -14), new THREE.Vector3(-14, 0.6, -30)), []);

  useFrame(() => {
    const t = scrollStore.state.ts.spring ?? 0;
    const k = Math.min(1, Math.max(0, (t - 0.25) / 0.6));
    if (ball.current) ball.current.position.copy(curve.getPoint(k, ballPos));
  });

  return (
    <group>
      <Ground color="#4f9a3c" />
      {/* infield */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -4]}>
        <circleGeometry args={[11, 24]} />
        <EraMaterial color="#b7825a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[0, 0.04, -4]}>
        <planeGeometry args={[9, 9]} />
        <EraMaterial color="#5fae4a" />
      </mesh>
      {[[0, 2.5], [-6.4, -4], [0, -10.5], [6.4, -4]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.12, z]}>
          <boxGeometry args={[0.9, 0.2, 0.9]} />
          <EraMaterial color="#ffffff" />
        </mesh>
      ))}
      <mesh position={[0, 0.15, -4]}>
        <cylinderGeometry args={[1.6, 2, 0.3, 12]} />
        <EraMaterial color="#a9744f" />
      </mesh>
      {/* outfield fence */}
      {FENCE.map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 30, 1, -4 + Math.sin(a) * 30]} rotation={[0, -a, 0]}>
          <boxGeometry args={[0.2, 2, 5.6]} />
          <EraMaterial color="#2f5d3a" />
        </mesh>
      ))}
      {/* light poles */}
      {[[-22, -18], [22, -18]].map(([x, z]) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position={[0, 7, 0]}><cylinderGeometry args={[0.18, 0.28, 14, 6]} /><EraMaterial color="#8a8f99" /></mesh>
          <mesh position={[0, 14.2, 0]}><boxGeometry args={[3, 1, 0.5]} /><EraMaterial color="#fff6d6" emissive="#fff0c0" emissiveIntensity={1.5} /></mesh>
        </group>
      ))}
      <mesh ref={ball} castShadow>
        <sphereGeometry args={[0.35, 10, 8]} />
        <EraMaterial color="#ffffff" />
      </mesh>
      <Tree position={[-16, 0, 8]} canopy="#f7b6cb" height={5} />
      <Tree position={[16, 0, 10]} canopy="#f9c5d5" height={4.5} />
      <Tree position={[-32, 0, -12]} canopy="#5fae4a" height={6} />
      <Orb position={[40, 34, -70]} radius={4} color="#fff7d0" intensity={0.6} />
      <Particles count={700} colors={PETALS} area={[26, 10, 22]} speed={0.35} sway={1.4} size={1} />
    </group>
  );
}
