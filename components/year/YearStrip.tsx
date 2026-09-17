"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { YEARS, ERAS } from "@/lib/content/eras";
import { useHorizontalWheel } from "@/lib/hooks/useHorizontalWheel";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

interface Props {
  year: number;
  onSelect: (year: number) => void;
}

/**
 * The persistent year selector. Phone: a snapping rail of big chips that centres the active year.
 * Desktop: an era row above a 22-column year row. Keyboard is handled by YearStage.
 */
export function YearStrip({ year, onSelect }: Props) {
  const rail = useRef<HTMLDivElement>(null);
  useHorizontalWheel(rail);

  useEffect(() => {
    const r = rail.current;
    const el = r?.querySelector<HTMLElement>(`[data-year="${year}"]`);
    if (!el || !r || r.scrollWidth <= r.clientWidth) return;
    r.scrollTo({ left: el.offsetLeft - r.clientWidth / 2 + el.clientWidth / 2, behavior: "smooth" });
  }, [year]);

  return (
    <div
      className="sticky top-[var(--chrome-h)] z-30 border-b border-border backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--bg-deep) 62%, transparent)" }}
    >
      <div className="hidden lg:grid lg:grid-cols-[repeat(22,minmax(0,1fr))] lg:px-6" aria-hidden="true">
        {ERAS.map((e) => (
          <div
            key={e.id}
            className={cn("label-mono truncate border-l border-border px-2 pt-2 text-[9px]", year >= e.from && year <= e.to ? "text-fg" : "text-fg-muted/70")}
            style={{ gridColumn: `span ${e.to - e.from + 1}` }}
          >
            {e.name}
          </div>
        ))}
      </div>
      <div
        ref={rail}
        data-lenis-prevent className="rail rail-snap flex h-[var(--strip-h)] items-stretch px-[calc(50%-40px)] lg:grid lg:h-10 lg:grid-cols-[repeat(22,minmax(0,1fr))] lg:px-6"
        role="tablist"
        aria-label="Years"
      >
        {YEARS.map((y) => {
          const active = y === year;
          const first = ERAS.some((e) => e.from === y);
          return (
            <button
              key={y}
              type="button"
              role="tab"
              aria-selected={active}
              tabIndex={active ? 0 : -1}
              data-year={y}
              onClick={() => onSelect(y)}
              className={cn(
                "relative flex min-w-[80px] shrink-0 snap-center items-center justify-center px-2 transition-colors lg:min-w-0",
                first && "lg:border-l lg:border-border",
                active ? "text-fg" : "text-fg-muted hover:text-fg",
              )}
            >
              <span className={cn("font-mono text-[15px] tabular-nums tracking-tight lg:text-[13px]", active && "font-semibold")}>{y}</span>
              {active ? (
                <motion.span
                  layoutId="strip-active"
                  transition={spring.snappy}
                  className="absolute inset-x-3 bottom-0 h-[3px] rounded-full bg-accent"
                  style={{ boxShadow: "0 0 12px var(--glow)" }}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
