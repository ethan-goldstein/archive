"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollStore } from "@/lib/scroll/progress";
import { useScene } from "./SceneContext";
import { SET_X } from "./layout";

type Key = [pos: [number, number, number], look: [number, number, number]];

/** Three keyframes per chapter, local to that chapter's season set: enter, middle, leave. */
const PATH: Record<string, Key[]> = {
  title: [[[-26, 14, 36], [0, 2, -6]], [[-17, 9, 29], [0, 2, -6]], [[-11, 6, 24], [0, 2, -6]]],
  winter: [[[-9, 4, 22], [0, 2, -6]], [[0, 3.2, 15], [0, 2, -6]], [[10, 3.2, 11], [16, 2, -4]]],
  spring: [[[-22, 6, 20], [0, 1, -4]], [[0, 5, 13], [0, 1, -8]], [[18, 4, 9], [26, 1, -6]]],
  summer: [[[-20, 4, 16], [0, 1, -2]], [[0, 3.2, 10], [0, 0.6, -6]], [[16, 3.2, 8], [24, 1, -4]]],
  fall: [[[-20, 4, 18], [0, 2, -6]], [[0, 3, 12], [0, 2, -8]], [[9, 3.4, 9], [4, 3, -8]]],
  world: [[[12, 6, 10], [0, 3, -8]], [[18, 14, 14], [-4, 10, -30]], [[22, 26, 22], [-12, 24, -60]]],
};
/** Scratch vectors, module level so the frame loop never allocates and never mutates render values. */
const scratch = { pos: new THREE.Vector3(), look: new THREE.Vector3(), targetPos: new THREE.Vector3(), targetLook: new THREE.Vector3(), started: false, zooming: false };

/** A year swap resets the scroll to the top; snap instead of flying the camera back across four sets. */
export function snapCamera() { scratch.started = false; scratch.zooming = false; }

const ORDER = ["title", "winter", "spring", "summer", "fall", "world"] as const;
const SET_OF: Record<(typeof ORDER)[number], number> = { title: SET_X.winter, winter: SET_X.winter, spring: SET_X.spring, summer: SET_X.summer, fall: SET_X.fall, world: SET_X.fall };

/**
 * The camera rides one long spline through the year: it approaches the winter set, walks past the
 * diamond, the pool and the porch, then climbs toward the moon. Scroll position picks the point;
 * a little damping and pointer sway keep it alive. Under reduced motion it jumps between chapter midpoints.
 */
export function CameraRig() {
  const { reduced } = useScene();
  const invalidate = useThree((s) => s.invalidate);
  const pointer = useRef({ x: 0, y: 0 });

  const { posCurve, lookCurve } = useMemo(() => {
    const ps: THREE.Vector3[] = [], ls: THREE.Vector3[] = [];
    for (const id of ORDER) for (const [p, l] of PATH[id]) { ps.push(new THREE.Vector3(p[0] + SET_OF[id], p[1], p[2])); ls.push(new THREE.Vector3(l[0] + SET_OF[id], l[1], l[2])); }
    return { posCurve: new THREE.CatmullRomCurve3(ps, false, "centripetal"), lookCurve: new THREE.CatmullRomCurve3(ls, false, "centripetal") };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const onMove = (e: PointerEvent) => { pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1; pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1; };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Coming from the boot screen: start far out and glide in, instead of a hard cut.
  useEffect(() => {
    try {
      if (sessionStorage.getItem("archive:zoom") === "1") {
        sessionStorage.removeItem("archive:zoom");
        scratch.pos.set(-70 + SET_X.winter, 46, 120);
        scratch.look.set(0, 2, -6);
        scratch.started = !reduced;
        scratch.zooming = !reduced;
      }
    } catch { /* ignore */ }
  }, [reduced]);

  useEffect(() => {
    if (!reduced) return;
    const off = scrollStore.subscribe(() => invalidate());
    return () => { off(); };
  }, [reduced, invalidate]);

  const N = ORDER.length, K = 3;
  useFrame(({ camera }, dt) => {
    const st = scrollStore.state;
    const { pos, look, targetPos, targetLook } = scratch;
    // chapter cursor → curve parameter. chapters are registered in DOM order; ids match ORDER.
    let u = 0;
    for (let i = 0; i < ORDER.length; i++) {
      const t = st.ts[ORDER[i]];
      if (t === undefined) continue;
      u = i + t;
      if (t < 1) break;
    }
    if (reduced) u = Math.floor(u) + 0.5;
    const param = Math.min(1, Math.max(0, (Math.floor(u) * K + (u - Math.floor(u)) * (K - 1)) / (N * K - 1)));
    // getPoint (not getPointAt): parametric by keyframe, so chapter i always maps to its own three keys.
    posCurve.getPoint(param, targetPos);
    lookCurve.getPoint(param, targetLook);
    if (!reduced) {
      const swayX = pointer.current.x * 0.8, swayY = -pointer.current.y * 0.4;
      targetPos.x += swayX; targetPos.y += swayY;
    }
    const k = reduced || !scratch.started ? 1 : 1 - Math.exp(-Math.min(dt, 0.05) * (scratch.zooming ? 2.2 : 6));
    if (scratch.zooming && pos.distanceTo(targetPos) < 0.5) scratch.zooming = false;
    scratch.started = true;
    pos.lerp(targetPos, k);
    look.lerp(targetLook, k);
    camera.position.copy(pos);
    camera.lookAt(look);
  });

  return null;
}
