"use client";

import { motion } from "motion/react";
import { YearScroll } from "./YearScroll";
import type { YearData } from "@/lib/content/schema";
import { dur, ease } from "@/lib/motion";

export function YearView({ data, direction }: { data: YearData; direction: 1 | -1 }) {
  return (
    <motion.article
      key={data.year}
      initial={{ opacity: 0, y: 16 * direction }}
      animate={{ opacity: 1, y: 0, transition: { duration: dur.base, ease: ease.outQuart } }}
      exit={{ opacity: 0, y: -12 * direction, transition: { duration: dur.fast, ease: ease.outQuart } }}
      className="relative z-[1] mx-auto flex w-full max-w-[1400px] flex-col px-4 pb-[calc(var(--player-h)+var(--tabbar-h)+32px)] md:px-8 md:pb-[calc(var(--player-h)+48px)]"
    >
      <YearScroll data={data} />
      <footer className="label-mono chapter-foot flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span>{data.year} · {data.era} era · {data.placeholderCount} slots still to fill</span>
        <span>← → to travel</span>
      </footer>
    </motion.article>
  );
}
