"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent, animate } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { Placeholder } from "@/components/modules/Placeholder";
import { ERAS, FIRST_YEAR, LAST_YEAR, YEARS, clampYear, eraForYear } from "@/lib/content/eras";
import { getYear } from "@/lib/content/getYear";
import { ageInYear } from "@/lib/content/age";
import { isPlaceholder } from "@/lib/content/placeholders";
import { EraProvider } from "@/lib/era/EraContext";
import { playClick } from "@/lib/audio/chime";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import type { Photo } from "@/lib/content/schema";
import { asset } from "@/lib/basePath";
import { TimelineRoad } from "./TimelineRoad";
import { timelineStore } from "@/lib/scroll/timelineStore";
import { frameStore, frameForYear } from "@/lib/browser/frame";

const stops = ERAS.map((e) => (e.from + e.to) / 2);
const pick = (k: keyof (typeof ERAS)[number]["palette"]) => ERAS.map((e) => e.palette[k]);

/**
 * The Life Scrubber. Drag through 22 years; the palette interpolates continuously between era
 * stops, the readout updates, and releasing opens that year. Keyboard: arrows, shift+arrows, Enter.
 */
export function Scrubber({ initialYear = FIRST_YEAR }: { initialYear?: number }) {
  const router = useRouter();
  const rail = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [year, setYear] = useState(initialYear);
  const x = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });

  const span = LAST_YEAR - FIRST_YEAR;
  const toX = (y: number) => ((y - FIRST_YEAR) / span) * width;
  const toYear = (px: number) => FIRST_YEAR + (px / Math.max(1, width)) * span;

  const yearMV = useTransform(xSpring, (px) => toYear(px));
  const bg = useTransform(yearMV, stops, pick("bg"));
  const fg = useTransform(yearMV, stops, pick("fg"));
  const accent = useTransform(yearMV, stops, pick("accent"));
  const accent2 = useTransform(yearMV, stops, pick("accent2"));
  const glow = useTransform(yearMV, stops, pick("glow"));
  const fill = useTransform(xSpring, (px) => `${(px / Math.max(1, width)) * 100}%`);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    x.set(toX(year));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width]);

  useMotionValueEvent(yearMV, "change", (v) => {
    timelineStore.year = Math.min(LAST_YEAR, Math.max(FIRST_YEAR, v));
    const r = clampYear(v);
    setYear((cur) => {
      if (r !== cur) playClick();
      return r;
    });
  });

  const snapTo = (y: number) => {
    const target = clampYear(y);
    animate(x, toX(target), { type: "spring", stiffness: 400, damping: 40 });
  };
  const open = () => router.push(`/year/${year}`);

  useKeyboard(
    (e) => {
      const step = e.shiftKey ? 5 : 1;
      if (e.key === "ArrowRight") { e.preventDefault(); snapTo(year + step); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); snapTo(year - step); }
      else if (e.key === "Home") { e.preventDefault(); snapTo(FIRST_YEAR); }
      else if (e.key === "End") { e.preventDefault(); snapTo(LAST_YEAR); }
      else if (e.key === "Enter") { e.preventDefault(); open(); }
    },
    [year, width],
  );

  const data = getYear(year);
  const era = eraForYear(year);
  const photos = data.personal.photos;

  useEffect(() => { frameStore.set(frameForYear(year)); }, [year]);

  return (
    <EraProvider era={era.id}>
      <motion.main
        data-era={era.id}
        className="relative flex flex-1 flex-col px-4 pb-[calc(var(--tabbar-h)+24px)] pt-6 md:px-8 md:pb-12 md:pt-10"
        style={{ ["--bg" as string]: bg, ["--fg" as string]: fg, ["--accent" as string]: accent, ["--accent-2" as string]: accent2, ["--glow" as string]: glow }}
      >
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
          <div className="sticky top-0 h-dvh w-full overflow-hidden"><TimelineRoad year={year} /></div>
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,transparent,color-mix(in_srgb,var(--bg)_85%,transparent))]" />
        </div>
        <div className="relative z-[1] mx-auto flex w-full max-w-[1200px] flex-1 flex-col justify-center gap-8">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-7">
              <p className="label-mono m-0 mb-2 text-fg-muted">Life scrubber · drag, or use ← →</p>
              <p className="numeral chapter-head m-0 !p-0 text-[clamp(120px,26vw,280px)]" style={{ minHeight: 0 }} aria-live="polite">{year}</p>
            </div>
            <dl className="m-0 grid grid-cols-2 gap-4 md:col-span-5 md:grid-cols-1 md:pb-6">
              <div><dt className="label-mono text-fg-muted">Age</dt><dd className="m-0 text-[clamp(18px,3vw,28px)] font-medium">{year === FIRST_YEAR ? "Born" : ageInYear(year)}</dd></div>
              <div><dt className="label-mono text-fg-muted">Era</dt><dd className="m-0 text-[clamp(16px,2.4vw,22px)] font-medium uppercase tracking-wide">{data.lifeStage}{" "}{data.lifeStageIsPlaceholder ? <span className="placeholder-badge ml-2 align-middle">assumed</span> : null}</dd></div>
              <div className="col-span-2 md:col-span-1"><dt className="label-mono text-fg-muted">Design</dt><dd className="m-0 text-[clamp(14px,2vw,18px)] font-medium">{era.name}</dd></div>
            </dl>
          </div>

          <div className="relative mx-4 py-6 md:mx-0" ref={rail}>
            <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border" />
            <motion.div className="absolute left-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ width: fill, boxShadow: "0 0 16px var(--glow)" }} />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              {YEARS.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => snapTo(y)}
                  className="absolute top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${((y - FIRST_YEAR) / span) * 100}%` }}
                  aria-label={`Go to ${y}`}
                  tabIndex={-1}
                >
                  <span className={`block h-3 w-[2px] mx-auto rounded-full ${ERAS.some((e) => e.from === y) ? "bg-fg" : "bg-fg-muted/60"}`} />
                </button>
              ))}
            </div>
            <motion.button
              type="button"
              role="slider"
              aria-label="Year"
              aria-valuemin={FIRST_YEAR}
              aria-valuemax={LAST_YEAR}
              aria-valuenow={year}
              aria-valuetext={`${year}, age ${ageInYear(year)}, ${data.lifeStage}`}
              drag="x"
              dragConstraints={rail}
              dragElastic={0}
              dragMomentum={false}
              style={{ x, touchAction: "none" }}
              onDrag={(_, info) => x.set(Math.max(0, Math.min(width, info.point.x - (rail.current?.getBoundingClientRect().left ?? 0))))}
              onDragEnd={() => snapTo(toYear(x.get()))}
              onDoubleClick={open}
              className="absolute left-0 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full border-2 border-fg bg-bg text-fg shadow-[0_0_0_6px_color-mix(in_srgb,var(--glow)_30%,transparent),0_12px_30px_-10px_rgba(0,0,0,.8)] active:cursor-grabbing md:h-12 md:w-12"
            >
              <Icon name="clock" size={18} />
            </motion.button>
            <div className="label-mono mt-12 flex justify-between text-fg-muted md:mt-10">
              <span>{FIRST_YEAR}</span>
              {ERAS.map((e) => <span key={e.id} className="hidden md:inline">{e.name}</span>)}
              <span>{LAST_YEAR}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:items-center">
            <div className="rail flex gap-2 md:col-span-8">
              {photos.slice(0, 4).map((p, i) =>
                isPlaceholder(p) ? (
                  <Placeholder key={p.id ?? i} placeholder={p} year={year} variant="frame" aspect="4 / 3" className="w-32 shrink-0 text-fg" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={(p as Photo).id} src={asset((p as Photo).src)} alt={(p as Photo).alt} className="h-24 w-32 shrink-0 rounded-[var(--radius-sm)] object-cover" />
                ),
              )}
              <div className="flex shrink-0 items-center gap-2 pl-2">
                {data.culture.capsule.slice(0, 4).map((c, i) => (
                  <span key={i} className="flex h-10 w-10 items-center justify-center rounded-full border border-border" title={c.label}><Icon name={c.icon} size={16} /></span>
                ))}
              </div>
            </div>
            <div className="flex justify-end md:col-span-4">
              <button type="button" onClick={open} className="btn-era text-[13px] uppercase tracking-[0.14em]">
                <Icon name="folder" size={14} />
                Open {year}
              </button>
            </div>
          </div>
        </div>
      </motion.main>
    </EraProvider>
  );
}
