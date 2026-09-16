"use client";

import { motion } from "motion/react";
import { YearHeader } from "./YearHeader";
import { YearLayout } from "./YearLayout";
import type { YearData } from "@/lib/content/schema";
import { dur, ease } from "@/lib/motion";

export function YearView({ data, direction }: { data: YearData; direction: 1 | -1 }) {
  return (
    <motion.article
      key={data.year}
      initial={{ opacity: 0, y: 16 * direction, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: dur.base, ease: ease.outQuart } }}
      exit={{ opacity: 0, y: -12 * direction, filter: "blur(4px)", transition: { duration: dur.fast, ease: ease.outQuart } }}
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-[calc(var(--player-h)+var(--tabbar-h)+32px)] pt-6 md:gap-10 md:px-8 md:pb-[calc(var(--player-h)+48px)] md:pt-10"
    >
      <YearHeader data={data} />
      <YearLayout data={data} />
      <footer className="label-mono flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4 text-fg-muted">
        <span>{data.year} · {data.era} era · {data.placeholderCount} slots still to fill</span>
        <span>← → to travel</span>
      </footer>
    </motion.article>
  );
}
