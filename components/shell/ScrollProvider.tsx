"use client";

import { useEffect } from "react";
import { ensureScrollTracking, setScrollPaused, startLenis, stopLenis } from "@/lib/scroll/lenis";
import { uiStore } from "@/lib/ui/uiStore";

/** Starts smooth scrolling and pauses it under modals. */
export function ScrollProvider() {
  useEffect(() => {
    ensureScrollTracking();
    startLenis();
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { if (mql.matches) stopLenis(); else startLenis(); };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const sync = () => {
      const s = uiStore.get();
      setScrollPaused(s.paletteOpen || s.playerOpen || !!s.dialog);
    };
    sync();
    const off = uiStore.subscribe(sync);
    return () => { off(); };
  }, []);

  return null;
}
