import { Chapter } from "./Chapter";
import { Memories } from "@/components/modules/Memories";
import { PhotoRoll } from "@/components/modules/PhotoRoll";
import { NowPlaying } from "@/components/modules/NowPlaying";
import { Interests } from "@/components/modules/Interests";
import { OnMyScreen } from "@/components/modules/OnMyScreen";
import { Tech } from "@/components/modules/Tech";
import { Internet } from "@/components/modules/Internet";
import { Games } from "@/components/modules/Games";
import { Milestones } from "@/components/modules/Milestones";
import { TimeCapsule } from "@/components/modules/TimeCapsule";
import { SEASON_META, type SeasonSlice } from "@/lib/content/seasons";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

/**
 * One season of one year. The heading floats over the 3D scene; the modules are the existing ones,
 * fed the season's slice. Which modules appear is fixed per season so the year has a rhythm:
 * winter is birthdays and music, spring is baseball and games, summer is screens and gadgets,
 * fall is school and the capsule.
 */
export function SeasonChapter({ slice }: { slice: SeasonSlice }) {
  const { season, data, quiet } = slice;
  const meta = SEASON_META[season];
  const p = data.personal;
  const has = (k: "memories" | "photos" | "videos" | "milestones") => p[k].length > 0;
  const fragment = data.mode === "fragment";
  const birthday = season === "winter" ? `Turns ${data.age} on February 10` : null;

  return (
    <Chapter id={season} season={season} className="chapter-season">
      <header className="chapter-head">
        <p className="label-mono m-0">{meta.months}{birthday ? ` · ${birthday}` : ""}</p>
        <h2 className="pow m-0 font-display text-[clamp(56px,11vw,140px)] leading-[0.9]">{meta.label}</h2>
        <p className="m-0 max-w-[48ch] font-serif text-[clamp(18px,2vw,24px)] leading-snug">{meta.beat}</p>
      </header>
      <div className={cn("grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12", quiet && !profile.showPlaceholders && "hidden")}>
        {season === "winter" ? (
          <>
            {has("milestones") ? <div className="md:col-span-1 lg:col-span-4"><Milestones data={data} /></div> : null}
            {has("memories") ? <div className="md:col-span-1 lg:col-span-8"><Memories data={data} fragment={fragment} /></div> : null}
            <div className="md:col-span-2 lg:col-span-7"><NowPlaying data={data} /></div>
            {has("photos") || has("videos") ? <div className="md:col-span-2 lg:col-span-5"><PhotoRoll data={data} /></div> : null}
          </>
        ) : season === "spring" ? (
          <>
            {has("memories") ? <div className="md:col-span-1 lg:col-span-7"><Memories data={data} fragment={fragment} /></div> : null}
            <div className="md:col-span-1 lg:col-span-5"><Interests data={data} /></div>
            {has("photos") || has("videos") ? <div className="md:col-span-2 lg:col-span-8"><PhotoRoll data={data} /></div> : null}
            <div className="md:col-span-2 lg:col-span-4"><Games data={data} /></div>
            {has("milestones") ? <div className="md:col-span-2 lg:col-span-12"><Milestones data={data} /></div> : null}
          </>
        ) : season === "summer" ? (
          <>
            {has("photos") || has("videos") ? <div className="md:col-span-2 lg:col-span-12"><PhotoRoll data={data} /></div> : null}
            {has("memories") ? <div className="md:col-span-1 lg:col-span-6"><Memories data={data} fragment={fragment} /></div> : null}
            <div className="md:col-span-1 lg:col-span-6"><OnMyScreen data={data} /></div>
            <div className="md:col-span-2 lg:col-span-6"><Tech data={data} /></div>
            {has("milestones") ? <div className="md:col-span-2 lg:col-span-6"><Milestones data={data} /></div> : null}
          </>
        ) : (
          <>
            {has("memories") ? <div className="md:col-span-1 lg:col-span-7"><Memories data={data} fragment={fragment} /></div> : null}
            {has("milestones") ? <div className="md:col-span-1 lg:col-span-5"><Milestones data={data} /></div> : null}
            {has("photos") || has("videos") ? <div className="md:col-span-2 lg:col-span-7"><PhotoRoll data={data} /></div> : null}
            <div className="md:col-span-1 lg:col-span-5"><TimeCapsule data={data} large={fragment} /></div>
            <div className="md:col-span-1 lg:col-span-12"><Internet data={data} /></div>
          </>
        )}
      </div>
    </Chapter>
  );
}
