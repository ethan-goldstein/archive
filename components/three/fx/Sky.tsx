"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SEASONS, type Season } from "@/lib/content/seasons";
import { scrollStore } from "@/lib/scroll/progress";

export interface Palette { top: string; horizon: string; ground: string; fog: string; light: string; ambient: string; lightDir: [number, number, number] }

/** Colours of the day for each season: dusk-blue winter, clear spring, orange summer dusk, moonlit amber fall. */
export const PALETTES: Record<Season, Palette> = {
  winter: { top: "#0d1b3d", horizon: "#7d97c4", ground: "#e9eef6", fog: "#96a9cc", light: "#ffd9a8", ambient: "#8ea3cf", lightDir: [-6, 4, 3] },
  spring: { top: "#3f86d6", horizon: "#d7ebff", ground: "#4f9a3c", fog: "#c9dcf0", light: "#fff4d0", ambient: "#a9c8e8", lightDir: [4, 8, 4] },
  summer: { top: "#2a2f6f", horizon: "#ff9a5a", ground: "#3f8a35", fog: "#f0a070", light: "#ffb070", ambient: "#8f7fb0", lightDir: [8, 3, -4] },
  fall: { top: "#1c1233", horizon: "#c8703a", ground: "#5b4a2c", fog: "#7a4a3c", light: "#ffe2b0", ambient: "#6a5478", lightDir: [-4, 6, -3] },
};

const vertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`;
const fragment = /* glsl */ `
  uniform vec3 uTop, uHorizon;
  uniform float uBands;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y * 1.6 + 0.15, 0.0, 1.0);
    h = pow(h, 0.7);
    if (uBands > 0.5) h = floor(h * uBands) / uBands;
    gl_FragColor = vec4(mix(uHorizon, uTop, h), 1.0);
  }
`;

/** Blends a colour per season by the current scroll weights. Shared by the sky, the fog and the lights. */
export function mixPalette(key: keyof Omit<Palette, "lightDir">, out: THREE.Color, tmp: THREE.Color) {
  const w = scrollStore.state.weights;
  out.setRGB(0, 0, 0);
  for (const s of SEASONS) {
    if (w[s] <= 0) continue;
    tmp.set(PALETTES[s][key]);
    out.r += tmp.r * w[s]; out.g += tmp.g * w[s]; out.b += tmp.b * w[s];
  }
  return out;
}

const tmpColor = new THREE.Color();

export function Sky({ bands = 0 }: { bands?: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const uniforms = useMemo(() => ({ uTop: { value: new THREE.Color(PALETTES.winter.top) }, uHorizon: { value: new THREE.Color(PALETTES.winter.horizon) }, uBands: { value: bands } }), [bands]);
  useFrame(({ camera }) => {
    if (!mat.current || !mesh.current) return;
    mixPalette("top", mat.current.uniforms.uTop.value, tmpColor);
    mixPalette("horizon", mat.current.uniforms.uHorizon.value, tmpColor);
    mesh.current.position.copy(camera.position);
  });

  return (
    <mesh ref={mesh} frustumCulled={false} renderOrder={-10}>
      <sphereGeometry args={[160, 24, 12]} />
      <shaderMaterial ref={mat} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} side={THREE.BackSide} depthWrite={false} fog={false} />
    </mesh>
  );
}
