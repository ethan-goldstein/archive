import { Memories } from "@/components/modules/Memories";
import { PhotoRoll } from "@/components/modules/PhotoRoll";
import { NowPlaying } from "@/components/modules/NowPlaying";
import { Interests } from "@/components/modules/Interests";
import { OnMyScreen } from "@/components/modules/OnMyScreen";
import { Tech } from "@/components/modules/Tech";
import { Internet } from "@/components/modules/Internet";
import { Games } from "@/components/modules/Games";
import { Culture } from "@/components/modules/Culture";
import { Milestones } from "@/components/modules/Milestones";
import { TimeCapsule } from "@/components/modules/TimeCapsule";
import type { YearData } from "@/lib/content/schema";

/**
 * The editorial grid. Same information architecture every year; the surfaces change with the era.
 * Fragment mode (2005–2008) is sparser and leads with objects and photo frames instead of text.
 */
export function YearLayout({ data }: { data: YearData }) {
  if (data.mode === "fragment") {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
        <div className="md:col-span-2 lg:col-span-12"><PhotoRoll data={data} /></div>
        <div className="md:col-span-1 lg:col-span-7"><TimeCapsule data={data} large /></div>
        <div className="md:col-span-1 lg:col-span-5"><Memories data={data} fragment /></div>
        <div className="md:col-span-1 lg:col-span-4"><Milestones data={data} /></div>
        <div className="md:col-span-1 lg:col-span-8"><NowPlaying data={data} /></div>
        <div className="md:col-span-1 lg:col-span-6"><Tech data={data} /></div>
        <div className="md:col-span-1 lg:col-span-6"><OnMyScreen data={data} /></div>
        <div className="md:col-span-1 lg:col-span-6"><Internet data={data} /></div>
        <div className="md:col-span-1 lg:col-span-6"><Games data={data} /></div>
        <div className="md:col-span-2 lg:col-span-12"><Culture data={data} /></div>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12">
      <div className="md:col-span-1 lg:col-span-7"><Memories data={data} /></div>
      <div className="md:col-span-1 lg:col-span-5"><TimeCapsule data={data} /></div>
      <div className="md:col-span-2 lg:col-span-12"><PhotoRoll data={data} /></div>
      <div className="md:col-span-1 lg:col-span-5"><NowPlaying data={data} /></div>
      <div className="md:col-span-1 lg:col-span-4"><Interests data={data} /></div>
      <div className="md:col-span-1 lg:col-span-3"><Milestones data={data} /></div>
      <div className="md:col-span-1 lg:col-span-4"><OnMyScreen data={data} /></div>
      <div className="md:col-span-1 lg:col-span-4"><Tech data={data} /></div>
      <div className="md:col-span-1 lg:col-span-4"><Games data={data} /></div>
      <div className="md:col-span-1 lg:col-span-5"><Internet data={data} /></div>
      <div className="md:col-span-1 lg:col-span-7"><Culture data={data} /></div>
    </div>
  );
}
