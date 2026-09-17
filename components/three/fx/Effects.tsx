"use client";

import { forwardRef, useMemo } from "react";
import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, Noise, Pixelation, Vignette, wrapEffect } from "@react-three/postprocessing";
import { BlendFunction, Effect } from "postprocessing";
import { Uniform, Vector2 } from "three";
import { useScene } from "../SceneContext";

const posterizeFrag = /* glsl */ `
  uniform float levels;
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = vec4(floor(inputColor.rgb * levels + 0.5) / levels, inputColor.a);
  }
`;
class PosterizeEffect extends Effect {
  constructor({ levels = 6 }: { levels?: number } = {}) {
    super("Posterize", posterizeFrag, { uniforms: new Map<string, Uniform<number>>([["levels", new Uniform(levels)]]) });
  }
}
const PosterizeBase = wrapEffect(PosterizeEffect);
const Posterize = forwardRef<PosterizeEffect, { levels: number }>(function Posterize(props, ref) {
  return <PosterizeBase ref={ref} {...props} />;
});

/**
 * The fidelity ladder. 2005 pixelates and posterizes; 2009 blooms; 2013 is clean; 2017 adds grain and
 * a vignette; 2021 adds depth of field and a touch of chromatic aberration. Every pass is gated by the profile.
 */
export function Effects() {
  const { profile, reduced } = useScene();
  const offset = useMemo(() => new Vector2(profile.chroma, profile.chroma), [profile.chroma]);
  const passes: React.ReactElement[] = [];
  if (profile.pixelSize > 0) passes.push(<Pixelation key="px" granularity={profile.pixelSize} />);
  if (profile.posterize > 0) passes.push(<Posterize key="post" levels={profile.posterize} />);
  if (profile.bloom > 0) passes.push(<Bloom key="bloom" intensity={profile.bloom} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />);
  if (profile.dof && !reduced) passes.push(<DepthOfField key="dof" focusDistance={0.03} focalLength={0.08} bokehScale={1.6} height={360} />);
  if (profile.chroma > 0) passes.push(<ChromaticAberration key="ca" offset={offset} radialModulation modulationOffset={0.4} />);
  if (profile.grain > 0) passes.push(<Noise key="noise" opacity={profile.grain} blendFunction={BlendFunction.OVERLAY} />);
  if (profile.vignette > 0) passes.push(<Vignette key="vig" darkness={profile.vignette} offset={0.25} />);
  if (!passes.length) return null;
  return <EffectComposer multisampling={0}>{passes}</EffectComposer>;
}
