"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence } from "motion/react";
import { YearStrip } from "./YearStrip";
import { YearView } from "./YearView";
import { YearCanvas } from "@/components/three/YearCanvas";
import { EraProvider } from "@/lib/era/EraContext";
import { getYear } from "@/lib/content/getYear";
import { FIRST_YEAR, LAST_YEAR, clampYear, eraForYear, parseYearParam } from "@/lib/content/eras";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { playClick } from "@/lib/audio/chime";
import { uiStore } from "@/lib/ui/uiStore";
import { BASE_PATH, stripBase } from "@/lib/basePath";
import { frameStore, frameForYear } from "@/lib/browser/frame";
import { profileForYear } from "@/lib/three/profile";

/**
 * Owns the current year. Year changes happen in place: pushState + AnimatePresence,
 * so the transition animates instead of reloading. Back/forward restore via popstate.
 * A hard load of /year/2013 renders the static page with initialYear=2013 (the page keys
 * this component by year, so a Link to another year remounts it).
 */
export function YearStage({ initialYear }: { initialYear: number }) {
  const [year, setYear] = useState(initialYear);
  const [direction, setDirection] = useState<1 | -1>(1);
  const yearRef = useRef(initialYear);
  const prevEra = useRef(eraForYear(initialYear).id);
  const [sweepKey, setSweepKey] = useState(0);

  const data = getYear(year);
  const era = data.era;

  const go = useCallback((next: number, push = true) => {
    const target = clampYear(next);
    const current = yearRef.current;
    if (target === current) return;
    yearRef.current = target;
    setDirection(target > current ? 1 : -1);
    setYear(target);
    if (push) {
      const slash = window.location.pathname.endsWith("/") ? "/" : "";
      window.history.pushState({ year: target }, "", `${BASE_PATH}/year/${target}${slash}`);
    }
    uiStore.setStatus(`Opening ${target}…`, true, 600);
    playClick();
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Back / forward.
  useEffect(() => {
    const onPop = () => {
      const y = parseYearParam(stripBase(window.location.pathname).split("/")[2]);
      if (y) go(y, false);
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [go]);

  // The frame and the within-era slide of the 2D tokens follow the year.
  useEffect(() => {
    frameStore.set(frameForYear(year));
    const p = profileForYear(year);
    const el = document.documentElement;
    el.style.setProperty("--era-t", p.eraT.toFixed(3));
    el.style.setProperty("--tech", p.techLevel.toFixed(3));
  }, [year]);

  // Title + a light sweep when the era changes.
  useEffect(() => {
    document.title = `${year} · Ethan Goldstein Archive`;
    if (prevEra.current !== era) {
      prevEra.current = era;
      const t = window.setTimeout(() => setSweepKey((k) => k + 1), 0);
      return () => window.clearTimeout(t);
    }
  }, [year, era]);

  useEffect(() => {
    const onRefresh = () => setSweepKey((k) => k + 1);
    window.addEventListener("archive:refresh", onRefresh);
    return () => window.removeEventListener("archive:refresh", onRefresh);
  }, []);

  useKeyboard(
    (e) => {
      if (uiStore.get().paletteOpen || uiStore.get().playerOpen) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); go(yearRef.current + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); go(yearRef.current - 1); }
      else if (e.key === "Home") { e.preventDefault(); go(FIRST_YEAR); }
      else if (e.key === "End") { e.preventDefault(); go(LAST_YEAR); }
    },
    [go],
  );

  return (
    <EraProvider era={era}>
      <main data-era={era} className="relative flex flex-1 flex-col">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="sticky top-0 h-dvh w-full overflow-hidden"><YearCanvas year={year} /></div>
        </div>
        <YearStrip year={year} onSelect={go} />
        {sweepKey > 0 ? <div key={sweepKey} className="era-sweep" aria-hidden="true" /> : null}
        <AnimatePresence mode="wait" initial={false}>
          <YearView key={year} data={data} direction={direction} />
        </AnimatePresence>
      </main>
    </EraProvider>
  );
}
