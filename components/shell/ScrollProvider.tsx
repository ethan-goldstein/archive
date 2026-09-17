"use client";

import { useEffect } from "react";
import { ensureScrollTracking, setScrollPaused, startLenis, stopLenis } from "@/lib/scroll/lenis";
import { uiStore } from "@/lib/ui/uiStore";
import { usePath } from "@/lib/hooks/usePath";

/** Starts smooth scrolling everywhere except the boot screen, and pauses it under menus and modals. */
export function ScrollProvider() {
  const pathname = usePath();
  const boot = pathname === "/";

  useEffect(() => {
    ensureScrollTracking();
    if (boot) { stopLenis(); return; }
    startLenis();
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { if (mql.matches) stopLenis(); else startLenis(); };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [boot]);

  useEffect(() => {
    const sync = () => {
      const s = uiStore.get();
      setScrollPaused(s.paletteOpen || s.playerOpen || s.menuSheetOpen || !!s.dialog);
    };
    sync();
    const off = uiStore.subscribe(sync);
    return () => { off(); };
  }, []);

  return null;
}
