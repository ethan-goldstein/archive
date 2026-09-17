"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useScene } from "../SceneContext";

interface Props {
  count: number;
  colors: string[];
  /** Half extents of the box the particles live in, centred on the group. */
  area: [number, number, number];
  /** Fall speed (0 = hover, fireflies). */
  speed?: number;
  sway?: number;
  size?: number;
  /** Fireflies blink; snow and leaves do not. */
  blink?: boolean;
  /** Soft round sprites (later eras) or hard squares (early eras) — decided by the profile unless forced. */
  soft?: boolean;
}

const vertex = /* glsl */ `
  attribute float aSeed;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime, uSpeed, uSway, uSize, uBlink;
  uniform vec3 uArea;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    float t = uTime;
    float fall = t * uSpeed * (0.6 + aSeed * 0.8);
    p.y = mod(p.y - fall + uArea.y, uArea.y * 2.0) - uArea.y;
    p.x += sin(t * 0.7 + aSeed * 6.2831) * uSway * (0.5 + aSeed);
    p.z += cos(t * 0.5 + aSeed * 3.0) * uSway * 0.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * aSize * (48.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
    vAlpha = uBlink > 0.5 ? smoothstep(0.25, 0.9, 0.5 + 0.5 * sin(t * (1.5 + aSeed * 2.0) + aSeed * 40.0)) : 1.0;
  }
`;
const fragment = /* glsl */ `
  uniform float uSoft;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = uSoft > 0.5 ? smoothstep(0.5, 0.15, d) : step(d, 0.42);
    if (a < 0.02) discard;
    gl_FragColor = vec4(vColor, a * vAlpha);
  }
`;

/** Mulberry32: a tiny pure RNG so the same particle field is built on every render. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Particles({ count, colors, area, speed = 1, sway = 0.6, size = 1, blink = false, soft }: Props) {
  const { profile, reduced, budget } = useScene();
  const n = Math.max(40, Math.round(count * profile.particles * budget));
  const ref = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(n * 3), seed = new Float32Array(n), sz = new Float32Array(n), col = new Float32Array(n * 3);
    const palette = colors.map((c) => new THREE.Color(c));
    const r = rng(n * 7919 + colors.length);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (r() * 2 - 1) * area[0];
      pos[i * 3 + 1] = (r() * 2 - 1) * area[1];
      pos[i * 3 + 2] = (r() * 2 - 1) * area[2];
      seed[i] = r();
      sz[i] = 0.6 + r() * 0.9;
      const c = palette[Math.floor(r() * palette.length)];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    g.setAttribute("aSize", new THREE.BufferAttribute(sz, 1));
    g.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    return g;
  }, [n, colors, area]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 }, uSpeed: { value: speed }, uSway: { value: sway }, uSize: { value: size },
    uBlink: { value: blink ? 1 : 0 }, uArea: { value: new THREE.Vector3(...area) },
    uSoft: { value: (soft ?? profile.pixelSize === 0) ? 1 : 0 },
  }), [speed, sway, size, blink, area, soft, profile.pixelSize]);

  useFrame((s) => {
    if (ref.current && !reduced) ref.current.uniforms.uTime.value = s.clock.elapsedTime;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial ref={ref} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} />
    </points>
  );
}
