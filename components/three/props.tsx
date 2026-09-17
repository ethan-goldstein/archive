"use client";

import { EraMaterial } from "./EraMaterial";

/** Simple procedural set dressing shared by the four seasons. Everything is boxes, cones and spheres. */

export function House({ position = [0, 0, 0] as [number, number, number], scale = 1, body = "#d9c9a8", roof = "#5a3a2a", windows = "#ffd27a", glow = 1.2, lit = true }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 4, 6]} />
        <EraMaterial color={body} />
      </mesh>
      <mesh position={[0, 5.2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[6.2, 2.6, 4]} />
        <EraMaterial color={roof} />
      </mesh>
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, 2.2, 3.03]}>
          <planeGeometry args={[1.6, 1.4]} />
          <EraMaterial color={lit ? windows : "#22252c"} emissive={lit ? windows : "#000000"} emissiveIntensity={lit ? glow : 0} />
        </mesh>
      ))}
      <mesh position={[0, 1.1, 3.03]}>
        <planeGeometry args={[1.2, 2.2]} />
        <EraMaterial color="#3b2a20" />
      </mesh>
      <mesh position={[2.6, 5.4, -1]}>
        <boxGeometry args={[0.8, 2.4, 0.8]} />
        <EraMaterial color="#4a3b33" />
      </mesh>
    </group>
  );
}

export function Tree({ position = [0, 0, 0] as [number, number, number], canopy = "#3f7a34", height = 5, bare = false }) {
  return (
    <group position={position}>
      <mesh position={[0, height * 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.4, height * 0.6, 6]} />
        <EraMaterial color="#4a3423" />
      </mesh>
      {bare ? (
        [0, 1, 2].map((i) => (
          <mesh key={i} position={[Math.sin(i * 2.1) * 0.8, height * 0.62 + i * 0.5, Math.cos(i * 2.1) * 0.8]} rotation={[0.3 * i, i, 0.7]}>
            <cylinderGeometry args={[0.06, 0.14, height * 0.5, 4]} />
            <EraMaterial color="#4a3423" />
          </mesh>
        ))
      ) : (
        <>
          <mesh position={[0, height * 0.7, 0]} castShadow>
            <sphereGeometry args={[height * 0.42, 10, 8]} />
            <EraMaterial color={canopy} />
          </mesh>
          <mesh position={[height * 0.25, height * 0.9, 0.2]} castShadow>
            <sphereGeometry args={[height * 0.3, 10, 8]} />
            <EraMaterial color={canopy} />
          </mesh>
        </>
      )}
    </group>
  );
}

export function Orb({ position, radius = 6, color = "#ffe8b0", intensity = 1.5 }: { position: [number, number, number]; radius?: number; color?: string; intensity?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[radius, 20, 14]} />
      <meshBasicMaterial color={color} toneMapped={false} fog={false} />
      <pointLight color={color} intensity={intensity} distance={0} decay={0} />
    </mesh>
  );
}

export function Ground({ color, size = 140 }: { color: string; size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[size, size, 1, 1]} />
      <EraMaterial color={color} />
    </mesh>
  );
}

/** A small dog silhouette: Fenway, in the winters of 2009–2013. */
export function Dog({ position = [0, 0, 0] as [number, number, number], color = "#2a2320" }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}><boxGeometry args={[1.4, 0.6, 0.5]} /><EraMaterial color={color} /></mesh>
      <mesh position={[0.8, 0.95, 0]}><boxGeometry args={[0.55, 0.5, 0.45]} /><EraMaterial color={color} /></mesh>
      <mesh position={[-0.75, 0.9, 0]} rotation={[0, 0, 0.7]}><boxGeometry args={[0.5, 0.14, 0.14]} /><EraMaterial color={color} /></mesh>
      {[-0.5, 0.5].map((x) => [-0.15, 0.15].map((z) => (
        <mesh key={`${x}${z}`} position={[x, 0.15, z]}><boxGeometry args={[0.18, 0.35, 0.16]} /><EraMaterial color={color} /></mesh>
      )))}
    </group>
  );
}
