"use client";
import { Artwork } from "../Artwork";
import { ProgressBar, Transport, VolumeControl } from "../Transport";
import { usePlayer } from "@/lib/player/usePlayer";

/** 2021–2026: translucent, large serif type. */
export function GlassSkin() {
  const p = usePlayer();
  const track = p.queue[p.index];
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-5">
        <Artwork track={track} size={140} className="rounded-[14px]" />
        <div className="min-w-0 flex-1">
          <p className="m-0 truncate font-serif text-[28px] italic leading-none">{track?.title ?? "Nothing playing"}</p>
          <p className="m-0 mt-2 truncate text-[13px] text-surface-fg-muted">{track?.artist ?? "Pick a track from any year"}</p>
        </div>
      </div>
      <ProgressBar />
      <div className="flex items-center justify-between">
        <Transport />
        <VolumeControl />
      </div>
    </div>
  );
}
