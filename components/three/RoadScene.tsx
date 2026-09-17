"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PALETTES } from "./fx/Sky";
import { EraMaterial } from "./EraMaterial";
import { Effects } from "./fx/Effects";
import { useScene } from "./SceneContext";
import { timelineStore } from "@/lib/scroll/timelineStore";
import { FIRST_YEAR, YEARS } from "@/lib/content/eras";
import { SEASONS, type Season } from "@/lib/content/seasons";

const STEP = 14;
const CANOPY: Record<Season, string> = { winter: "#e6ecf5", spring: "#f4b8cc", summer: "#3f8a35", fall: "#e8642c" };
const tmp = new THREE.Color();
const fogColor = new THREE.Color(), ground = new THREE.Color(), canopy = new THREE.Color();
const camPos = new THREE.Vector3(2, 4, 14), camLook = new THREE.Vector3(0, 1.5, -20);
const fog = new THREE.FogExp2("#96a9cc", 0.02);

/** Season weights from the fractional part of the year: each year on the road passes through all four. */
function seasonWeights(year: number): Record<Season, number> {
  const f = year - Math.floor(year);
  const w: Record<Season, number> = { winter: 0, spring: 0, summer: 0, fall: 0 };
  for (let i = 0; i < 4; i++) {
    const c = (i + 0.5) / 4;
    let d = Math.abs(f - c);
    d = Math.min(d, 1 - d);
    w[SEASONS[i]] = Math.max(0, 1 - d * 4);
  }
  const sum = w.winter + w.spring + w.summer + w.fall || 1;
  for (const s of SEASONS) w[s] /= sum;
  return w;
}

function mix(out: THREE.Color, w: Record<Season, number>, pick: (s: Season) => string) {
  out.setRGB(0, 0, 0);
  for (const s of SEASONS) { if (w[s] <= 0) continue; tmp.set(pick(s)); out.r += tmp.r * w[s]; out.g += tmp.g * w[s]; out.b += tmp.b * w[s]; }
  return out;
}

/**
 * The timeline as a road: 22 markers down a long straight, the camera gliding to the scrubber's year,
 * the sky cycling through the seasons within every year, and the render profile of the nearest year.
 */
export function RoadScene() {
  const { reduced, profile } = useScene();
  const sky = useRef<THREE.Mesh>(null);
  const groundRef = useRef<THREE.Mesh>(null);
  const treeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const markers = useRef<(THREE.Mesh | null)[]>([]);
  const light = useRef<THREE.DirectionalLight>(null);
  const started = useRef(false);

  useFrame(({ camera, scene }, dt) => {
    const year = timelineStore.year;
    const w = seasonWeights(year);
    const z = -(year - FIRST_YEAR) * STEP;
    const tp = camPos.set(2, 4.2, z + 14);
    const tl = camLook.set(0, 1.4, z - 22);
    const k = reduced || !started.current ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * 7);
    started.current = true;
    camera.position.lerp(tp, k);
    camera.lookAt(tl);
    mix(fogColor, w, (s) => PALETTES[s].fog);
    if (scene.fog !== fog) scene.fog = fog;
    fog.color.copy(fogColor);
    fog.density = profile.fogDensity * 0.7;
    if (sky.current) {
      sky.current.position.copy(camera.position);
      const m = sky.current.material as THREE.ShaderMaterial;
      mix(m.uniforms.uTop.value, w, (s) => PALETTES[s].top);
      mix(m.uniforms.uHorizon.value, w, (s) => PALETTES[s].horizon);
      m.uniforms.uBands.value = profile.posterize ? 5 : 0;
    }
    if (groundRef.current) {
      const gm = groundRef.current.material as THREE.MeshStandardMaterial;
      if (gm.color) gm.color.copy(mix(ground, w, (s) => PALETTES[s].ground));
    }
    mix(canopy, w, (s) => CANOPY[s]);
    for (const t of treeRefs.current) { const mat = t?.material as THREE.MeshStandardMaterial | undefined; if (mat?.color) mat.color.copy(canopy); }
    if (light.current) mix(light.current.color, w, (s) => PALETTES[s].light);
    markers.current.forEach((m, i) => {
      if (!m) return;
      const d = Math.abs(year - YEARS[i]);
      const mat = m.material as THREE.MeshStandardMaterial;
      const glow = Math.max(0, 1 - d) * 3 + 0.3;
      if ("emissiveIntensity" in mat) mat.emissiveIntensity = glow;
      m.scale.setScalar(1 + Math.max(0, 1 - d) * 0.35);
    });
  });

  return (
    <>
      <mesh ref={sky} frustumCulled={false} renderOrder={-10}>
        <sphereGeometry args={[160, 24, 12]} />
        <shaderMaterial
          vertexShader={`varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`uniform vec3 uTop, uHorizon; uniform float uBands; varying vec3 vDir; void main(){ float h = clamp(vDir.y*1.6+0.15,0.0,1.0); h = pow(h,0.7); if (uBands>0.5) h = floor(h*uBands)/uBands; gl_FragColor = vec4(mix(uHorizon,uTop,h),1.0); }`}
          uniforms={{ uTop: { value: new THREE.Color(PALETTES.winter.top) }, uHorizon: { value: new THREE.Color(PALETTES.winter.horizon) }, uBands: { value: 0 } }}
          side={THREE.BackSide} depthWrite={false} fog={false}
        />
      </mesh>
      <ambientLight intensity={profile.material === "pastel" ? 1.3 : 0.8} color="#cfd8ff" />
      <hemisphereLight args={["#cfd8ff", "#3a2a1a", 0.35]} />
      <directionalLight ref={light} position={[8, 12, 6]} intensity={1.6} />
      <mesh ref={groundRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -150]}>
        <planeGeometry args={[220, 420]} />
        <EraMaterial color="#4f9a3c" />
      </mesh>
      {/* the road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -150]}>
        <planeGeometry args={[7, 420]} />
        <EraMaterial color="#3a3a42" />
      </mesh>
      {Array.from({ length: 60 }, (_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 10 - i * 7]}>
          <planeGeometry args={[0.3, 3]} />
          <EraMaterial color="#f5e9b0" />
        </mesh>
      ))}
      {YEARS.map((y, i) => {
        const z = -(y - FIRST_YEAR) * STEP;
        return (
          <group key={y} position={[7.5, 0, z]}>
            <mesh position={[0, 1.2, 0]}><boxGeometry args={[0.25, 2.4, 0.25]} /><EraMaterial color="#8a8f99" /></mesh>
            <mesh ref={(m) => { markers.current[i] = m; }} position={[0, 2.9, 0]}>
              <boxGeometry args={[1.1, 1.1, 1.1]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffd27a" emissiveIntensity={0.3} roughness={0.4} />
            </mesh>
          </group>
        );
      })}
      {Array.from({ length: 30 }, (_, i) => {
        const side = i % 2 ? 1 : -1;
        const z = 6 - i * 11;
        return (
          <group key={i} position={[side * (10 + (i % 3) * 3), 0, z]}>
            <mesh position={[0, 1.6, 0]}><cylinderGeometry args={[0.22, 0.35, 3.2, 6]} /><EraMaterial color="#4a3423" /></mesh>
            <mesh ref={(m) => { treeRefs.current[i] = m; }} position={[0, 4, 0]}>
              <sphereGeometry args={[2.2, 10, 8]} />
              <meshStandardMaterial color="#3f8a35" roughness={0.9} />
            </mesh>
          </group>
        );
      })}
      <Effects />
    </>
  );
}
