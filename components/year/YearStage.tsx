"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { YearStrip } from "./YearStrip";
import { YearView } from "./YearView";
import { YearCanvas } from "@/components/three/YearCanvas";
import { snapCamera } from "@/components/three/CameraRig";
import { EraProvider } from "@/lib/era/EraContext";
import { getYear } from "@/lib/content/getYear";
import { FIRST_YEAR, LAST_YEAR, clampYear, parseYearParam } from "@/lib/content/eras";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { playClick } from "@/lib/audio/chime";
import { uiStore } from "@/lib/ui/uiStore";
import { BASE_PATH, stripBase } from "@/lib/basePath";
import { frameStore, frameForYear } from "@/lib/browser/frame";
import { profileForYear } from "@/lib/three/profile";
import { getLenis } from "@/lib/scroll/lenis";
import { scrollStore } from "@/lib/scroll/progress";

/** How long the wash takes to become opaque; the year is swapped underneath it right after. */
const SWAP_AT = 130;
type Wash = "off" | "in" | "hold" | "out";

/**
 * Owns the current year. A year change never animates the tall article: a viewport-sized wash
 * fades in, the year is swapped and the scroll reset underneath it (through Lenis, so it cannot
 * snap back), and the wash fades out. Rapid presses collapse into one swap to the latest target.
 * Back/forward restore via popstate. A hard load of /year/2013 renders the static page.
 */
export function YearStage({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);
  const [wash, setWash] = useState<Wash>("off");
  const washRef = useRef<Wash>("off");
  const target = useRef(initialYear);
  const timer = useRef(0);
  const reduced = usePrefersReducedMotion();

  const data = getYear(year);
  const era = data.era;

  const commit = useCallback(() => {
    timer.current = 0;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
    snapCamera();
    washRef.current = "hold";
    setWash("hold");
    setYear(target.current);
  }, []);

  const go = useCallback((next: number, push = true) => {
    const to = clampYear(next);
    if (to === target.current) return;
    target.current = to;
    if (push) {
      const slash = window.location.pathname.endsWith("/") ? "/" : "";
      window.history.pushState({ year: to }, "", `${BASE_PATH}/year/${to}${slash}`);
    }
    uiStore.setStatus(`Opening ${to}…`, true, 600);
    playClick();
    if (reduced) { commit(); return; }
    if (timer.current) return; // a swap is already scheduled; it will pick up the latest target
    if (washRef.current === "off") { washRef.current = "in"; setWash("in"); timer.current = window.setTimeout(commit, SWAP_AT); }
    else { washRef.current = "hold"; setWash("hold"); timer.current = window.setTimeout(commit, 0); }
  }, [commit, reduced]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Back / forward.
  useEffect(() => {
    const onPop = () => {
      const y = parseYearParam(stripBase(window.location.pathname).split("/")[2]);
      if (y) go(y, false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go]);

  // After the new year is in the DOM: Lenis and the chapter registry must see the new height now, not 250ms later.
  useLayoutEffect(() => {
    getLenis()?.resize();
    scrollStore.measure();
  }, [year]);

  // Hold the wash until the new year (and the 3D scene's new materials) have really painted, however long that takes.
  useEffect(() => {
    if (washRef.current !== "hold") return;
    let id = 0, n = 0;
    const wait = () => {
      if (++n < 3) { id = requestAnimationFrame(wait); return; }
      if (washRef.current === "hold" && !timer.current) { washRef.current = "out"; setWash("out"); }
    };
    id = requestAnimationFrame(wait);
    return () => cancelAnimationFrame(id);
  }, [year, wash]);

  // The frame, the within-era slide of the 2D tokens and the tab title follow the year.
  useEffect(() => {
    frameStore.set(frameForYear(year));
    const p = profileForYear(year);
    const el = document.documentElement;
    el.style.setProperty("--era-t", p.eraT.toFixed(3));
    el.style.setProperty("--tech", p.techLevel.toFixed(3));
    document.title = `${year} · Ethan Goldstein Archive`;
  }, [year]);

  // Parse the neighbours while idle so a year change never pays for it.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number; cancelIdleCallback?: (id: number) => void };
    const warm = () => { for (const y of [year + 1, year - 1, year + 2]) if (y >= FIRST_YEAR && y <= LAST_YEAR) getYear(y); };
    if (w.requestIdleCallback) { const id = w.requestIdleCallback(warm); return () => w.cancelIdleCallback?.(id); }
    const id = window.setTimeout(warm, 400);
    return () => window.clearTimeout(id);
  }, [year]);

  useKeyboard(
    (e) => {
      if (e.repeat) return;
      if (uiStore.get().paletteOpen || uiStore.get().playerOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(target.current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(target.current - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(FIRST_YEAR); }
      else if (e.key === "End") { e.preventDefault(); go(LAST_YEAR); }
    },
    [go],
  );

  return (
    <EraProvider era={era}>
      <main data-era={era} className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="sticky top-0 h-svh w-full overflow-hidden"><YearCanvas year={year} /></div>
        </div>
        <YearStrip year={year} onSelect={go} />
        {wash !== "off" ? (
          <div className="year-wash" data-phase={wash} aria-hidden="true" onAnimationEnd={() => { if (washRef.current === "out") { washRef.current = "off"; setWash("off"); } }} />
        ) : null}
        <YearView key={year} data={data} />
      </main>
    </EraProvider>
  );
}
