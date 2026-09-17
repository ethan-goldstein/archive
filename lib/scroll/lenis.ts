"use client";

import Lenis from "lenis";
import { scrollStore } from "./progress";

/**
 * One Lenis for the whole app, created on first use in the browser and driven by its own rAF.
 * The progress store listens to the native scroll event, so it works with or without Lenis
 * (reduced motion never creates one and scrolls natively).
 */
let lenis: Lenis | null = null;
let raf = 0;
let listening = false;

function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  const onScroll = () => scrollStore.update(window.scrollY, performance.now());
  window.addEventListener("scroll", onScroll, { passive: true });
  const onResize = () => scrollStore.measure();
  window.addEventListener("resize", onResize);
  if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(document.body);
  scrollStore.measure();
}

export function ensureScrollTracking() { listen(); }

export function startLenis(): Lenis | null {
  if (typeof window === "undefined") return null;
  listen();
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  if (!lenis) {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, syncTouch: false, autoRaf: false });
    const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("lenis");
  }
  return lenis;
}

export function stopLenis() {
  if (!lenis) return;
  cancelAnimationFrame(raf);
  lenis.destroy();
  lenis = null;
  document.documentElement.classList.remove("lenis");
}

export function getLenis() { return lenis; }

/** Modals and menus stop the page underneath from scrolling. */
export function setScrollPaused(paused: boolean) {
  if (!lenis) return;
  if (paused) lenis.stop(); else lenis.start();
}
