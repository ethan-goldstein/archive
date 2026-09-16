"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { youtubeId } from "@/lib/player/adapters/youtube";
import { asset } from "@/lib/basePath";
import type { Video } from "@/lib/content/schema";

/** A local clip plays inline; a YouTube link shows its thumbnail and loads the embed on tap. */
export function VideoTile({ video, year }: { video: Video; year: number }) {
  const yt = video.src.startsWith("http") ? youtubeId(video.src) : null;
  const [open, setOpen] = useState(false);
  return (
    <figure className="m-0 overflow-hidden rounded-[var(--radius-sm)] bg-bg-deep">
      <div className="relative aspect-video">
        {yt ? (
          open ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
              title={video.caption ?? `Video from ${year}`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <button type="button" onClick={() => setOpen(true)} className="group absolute inset-0 h-full w-full" aria-label={`Play video: ${video.caption ?? year}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${yt}/hqdefault.jpg`} alt="" className="h-full w-full object-cover" loading="lazy" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/20">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-lg"><Icon name="play" size={22} /></span>
              </span>
            </button>
          )
        ) : (
          <video controls playsInline preload="metadata" poster={video.poster ? asset(video.poster) : undefined} className="absolute inset-0 h-full w-full bg-black" aria-label={video.caption ?? `Video from ${year}`}>
            <source src={asset(video.src)} />
          </video>
        )}
      </div>
      {video.caption || video.takenAt ? (
        <figcaption className="px-3 py-2 text-[12px] text-surface-fg-muted">
          {video.caption}{video.caption && video.takenAt ? " · " : ""}{video.takenAt}
        </figcaption>
      ) : null}
    </figure>
  );
}
