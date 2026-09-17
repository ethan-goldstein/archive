"use client";

import { useScene } from "./SceneContext";

interface Props {
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  transparent?: boolean;
  opacity?: number;
}

/**
 * The one place a material look is chosen. 2005 is flat Lambert with hard facets; 2009 is glossy Phong;
 * 2013 is toon pastel; 2017 is PBR; 2021 is PBR with a little more polish. Same colours everywhere.
 */
export function EraMaterial({ color, emissive = "#000000", emissiveIntensity = 1, transparent, opacity }: Props) {
  const { profile } = useScene();
  const common = { color, emissive, emissiveIntensity, transparent, opacity };
  switch (profile.material) {
    case "flat": return <meshLambertMaterial {...common} flatShading />;
    case "gloss": return <meshPhongMaterial {...common} shininess={90} specular="#ffffff" />;
    case "pastel": return <meshToonMaterial {...common} />;
    case "pbr": return <meshStandardMaterial {...common} roughness={0.8} metalness={0.05} />;
    default: return <meshStandardMaterial {...common} roughness={0.55} metalness={0.12} />;
  }
}
