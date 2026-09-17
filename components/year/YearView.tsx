import { YearScroll } from "./YearScroll";
import type { YearData } from "@/lib/content/schema";

/** One year's 2D story. Deliberately not animated as a whole: it is thousands of pixels tall (see YearStage's wash). */
export function YearView({ data }: { data: YearData }) {
  return (
    <article className="relative z-[1] mx-auto flex w-full max-w-[1400px] flex-col px-4 pb-[calc(var(--player-h)+var(--tabbar-h)+32px)] md:px-8 md:pb-[calc(var(--player-h)+48px)]">
      <YearScroll data={data} />
      <footer className="label-mono chapter-foot flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
        <span>{data.year} · {data.era} era · {data.placeholderCount} slots still to fill</span>
        <span>← → to travel</span>
      </footer>
    </article>
  );
}
