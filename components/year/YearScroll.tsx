import { Chapter } from "./Chapter";
import { SeasonChapter } from "./SeasonChapter";
import { YearHeader } from "./YearHeader";
import { Culture } from "@/components/modules/Culture";
import { SEASONS, sliceSeasons } from "@/lib/content/seasons";
import type { YearData } from "@/lib/content/schema";

/**
 * A year is one long scroll: a title card, then winter, spring, summer, fall, then the world that year.
 * The canvas behind it is owned by YearStage; this is only the 2D story on top.
 */
export function YearScroll({ data }: { data: YearData }) {
  const slices = sliceSeasons(data);
  return (
    <>
      <Chapter id="title" season="winter" className="chapter-title">
        <div className="chapter-card">
          <YearHeader data={data} />
        </div>
      </Chapter>
      {SEASONS.map((s) => <SeasonChapter key={s} slice={slices[s]} />)}
      <Chapter id="world" season="fall" className="chapter-season">
        <header className="chapter-head">
          <p className="label-mono m-0">Meanwhile</p>
          <h2 className="pow m-0 font-display text-[clamp(40px,7vw,96px)] leading-[0.9]">The world that year</h2>
          <p className="m-0 max-w-[52ch] font-serif text-[clamp(18px,2vw,24px)] leading-snug">{data.culture.headline}</p>
        </header>
        <Culture data={data} />
      </Chapter>
    </>
  );
}
