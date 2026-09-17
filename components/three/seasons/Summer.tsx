"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../fx/Particles";
import { Ground, House, Orb, Tree } from "../props";
import { EraMaterial } from "../EraMaterial";
import { useScene } from "../SceneContext";

const FIREFLY = ["#ffe66b", "#fff3a0", "#d8ff7a"];

const poolVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`;
const poolFrag = /* glsl */ `
  uniform float uTime, uBands;
  uniform vec3 uDeep, uLight;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv * vec2(14.0, 8.0);
    float c = sin(p.x * 1.7 + uTime * 0.9) + sin(p.y * 2.3 - uTime * 0.7) + sin((p.x + p.y) * 1.1 + uTime * 0.5);
    c = pow(max(0.0, c * 0.33 + 0.35), 2.2);
    if (uBands > 0.5) c = floor(c * uBands) / uBands;
    gl_FragColor = vec4(mix(uDeep, uLight, c), 1.0);
  }
`;

/** Dusk over the backyard: the pool with moving caustics, the lawn, the house, fireflies. */
export function Summer() {
  const { profile, reduced } = useScene();
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uBands: { value: profile.posterize ? 4 : 0 },
    uDeep: { value: new THREE.Color("#1a7fb0") }, uLight: { value: new THREE.Color("#8fe3ff") },
  }), [profile.posterize]);

  useFrame((s) => { if (mat.current && !reduced) mat.current.uniforms.uTime.value = s.clock.elapsedTime; });

  return (
    <group>
      <Ground color="#3f8a35" />
      {/* deck + pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -2]}>
        <planeGeometry args={[20, 13]} />
        <EraMaterial color="#d9cdb4" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -2]}>
        <planeGeometry args={[14, 8]} />
        <shaderMaterial ref={mat} vertexShader={poolVert} fragmentShader={poolFrag} uniforms={uniforms} />
      </mesh>
      <House position={[0, 0, -16]} body="#e6d8c0" roof="#6b4a3a" glow={0.9} />
      <Tree position={[-14, 0, -6]} canopy="#2f7a2a" height={7} />
      <Tree position={[13, 0, 4]} canopy="#3b8d31" height={5} />
      <Tree position={[16, 0, -12]} canopy="#2f7a2a" height={6} />
      {/* a lounge chair and a towel: small boxes, big memory */}
      <mesh position={[9, 0.5, 0]} rotation={[0, -0.4, 0]}><boxGeometry args={[1.2, 0.5, 2.4]} /><EraMaterial color="#f5f1e6" /></mesh>
      <mesh position={[-9, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0.3]}><planeGeometry args={[1.4, 2.6]} /><EraMaterial color="#ff6b57" /></mesh>
      <Orb position={[46, 8, -60]} radius={7} color="#ffb070" intensity={0.8} />
      <Particles count={260} colors={FIREFLY} area={[18, 3, 14]} speed={0} sway={1.6} size={0.9} blink />
    </group>
  );
}
