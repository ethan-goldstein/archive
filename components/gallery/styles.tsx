"use client";

import { Placeholder } from "@/components/modules/Placeholder";
import { PhotoTile } from "./PhotoTile";
import { isPlaceholder } from "@/lib/content/placeholders";
import type { Photo, Placeholder as PlaceholderT } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

type Entry = Photo | PlaceholderT;
interface StyleProps { entries: Entry[]; photos: Photo[]; year: number }

function indexOf(photos: Photo[], p: Photo) {
  return photos.findIndex((x) => x.id === p.id);
}

/** 2005–2008: a filmstrip of 4:3 frames with a silver bezel and an orange date stamp. */
export function CameraRoll({ entries, photos, year }: StyleProps) {
  return (
    <div className="rail -mx-4 flex snap-x gap-3 px-4 pb-2 md:-mx-6 md:px-6">
      {entries.map((e, i) => (
        <div key={isPlaceholder(e) ? e.id ?? i : e.id} className="w-[min(78vw,320px)] shrink-0 snap-center rounded-[6px] border border-[#c9c9c9] bg-[linear-gradient(180deg,#f4f4f4,#bdbdbd)] p-2 shadow-[0_8px_20px_-10px_rgba(0,0,0,.6)]">
          {isPlaceholder(e) ? (
            <Placeholder placeholder={e} year={year} variant="frame" aspect="4 / 3" className="bg-black/80 text-white" />
          ) : (
            <PhotoTile photo={e} photos={photos} index={indexOf(photos, e)} year={year} sizes="(max-width: 768px) 78vw, 320px" aspect="4 / 3">
              <span className="datestamp absolute bottom-2 right-3">{(e.takenAt ?? String(year)).replace(/-/g, ".")}</span>
            </PhotoTile>
          )}
          {!isPlaceholder(e) && e.caption ? <p className="m-0 mt-2 truncate font-mono text-[11px] text-[#333]">{e.caption}</p> : null}
        </div>
      ))}
    </div>
  );
}

/** 2009–2012: an early-social album. White-bordered squares with small captions. */
export function Album({ entries, photos, year }: StyleProps) {
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-4">
      {entries.map((e, i) => (
        <li key={isPlaceholder(e) ? e.id ?? i : e.id} className="rounded-[3px] bg-white p-1.5 shadow-[0_1px_2px_rgba(0,0,0,.3)]">
          {isPlaceholder(e) ? (
            <Placeholder placeholder={e} year={year} variant="frame" aspect="1 / 1" className="text-[#333]" />
          ) : (
            <>
              <PhotoTile photo={e} photos={photos} index={indexOf(photos, e)} year={year} sizes="(max-width: 640px) 50vw, 25vw" aspect="1 / 1" />
              <p className="m-0 mt-1.5 truncate text-[11px] text-[#3b5998]">{e.caption ?? e.alt}</p>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

/** 2013–2016: the phone grid. Three squares across, 2px gaps, captions on hover. */
export function Grid({ entries, photos, year }: StyleProps) {
  return (
    <ul className="m-0 grid list-none grid-cols-3 gap-[3px] p-0">
      {entries.map((e, i) => (
        <li key={isPlaceholder(e) ? e.id ?? i : e.id}>
          {isPlaceholder(e) ? (
            <Placeholder placeholder={e} year={year} variant="frame" aspect="1 / 1" />
          ) : (
            <PhotoTile photo={e} photos={photos} index={indexOf(photos, e)} year={year} sizes="33vw" aspect="1 / 1">
              {e.caption ? (
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100">{e.caption}</span>
              ) : null}
            </PhotoTile>
          )}
        </li>
      ))}
    </ul>
  );
}

/** 2017–2020: a feed. One wide lead image, then a two-up flow. */
export function Feed({ entries, photos, year }: StyleProps) {
  const [lead, ...rest] = entries;
  const render = (e: Entry, i: number, aspect: string, sizes: string) =>
    isPlaceholder(e) ? (
      <Placeholder key={e.id ?? i} placeholder={e} year={year} variant="frame" aspect={aspect} className={cn("rounded-[var(--radius-sm)]", i === 0 && "max-h-[360px]")} />
    ) : (
      <PhotoTile key={e.id} photo={e} photos={photos} index={indexOf(photos, e)} year={year} sizes={sizes} aspect={aspect} className="rounded-[var(--radius-sm)]">
        {e.caption ? <span className="absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-0.5 text-[11px] text-white">{e.caption}</span> : null}
      </PhotoTile>
    );
  return (
    <div className="flex flex-col gap-3">
      {lead ? render(lead, 0, "16 / 9", "(max-width: 768px) 100vw, 1200px") : null}
      {rest.length ? <div className="grid grid-cols-2 gap-3">{rest.map((e, i) => render(e, i + 1, "4 / 5", "50vw"))}</div> : null}
    </div>
  );
}

/** 2021–2026: cinematic. A hero, then a loose masonry. */
export function Cinematic({ entries, photos, year }: StyleProps) {
  const [hero, ...rest] = entries;
  return (
    <div className="flex flex-col gap-4">
      {hero ? (
        isPlaceholder(hero) ? (
          <Placeholder placeholder={hero} year={year} variant="frame" aspect="21 / 9" className="max-h-[360px] rounded-[var(--radius-era)]" />
        ) : (
          <PhotoTile photo={hero} photos={photos} index={indexOf(photos, hero)} year={year} sizes="(max-width: 768px) 100vw, 1400px" aspect="21 / 9" className="rounded-[var(--radius-era)]" priority>
            {hero.caption ? <span className="absolute bottom-4 left-4 font-serif text-[18px] italic text-white drop-shadow">{hero.caption}</span> : null}
          </PhotoTile>
        )
      ) : null}
      {rest.length ? (
        <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          {rest.map((e, i) =>
            isPlaceholder(e) ? (
              <Placeholder key={e.id ?? i} placeholder={e} year={year} variant="frame" aspect={i % 2 ? "3 / 4" : "4 / 3"} className="rounded-[var(--radius-sm)]" />
            ) : (
              <PhotoTile key={e.id} photo={e} photos={photos} index={indexOf(photos, e)} year={year} sizes="(max-width: 768px) 50vw, 33vw" className="rounded-[var(--radius-sm)]" />
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
