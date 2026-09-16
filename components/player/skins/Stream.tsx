"use client";
import { Artwork } from "../Artwork";
import { ProgressBar, Transport, VolumeControl } from "../Transport";
import { usePlayer } from "@/lib/player/usePlayer";

/** 2017–2020: charcoal streaming layout. */
export function StreamSkin() {
  const p = usePlayer();
  const track = p.queue[p.index];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-4">
        <Artwork track={track} size={120} className="rounded-[6px]" />
        <div className="min-w-0 flex-1 pb-1">
          <p className="label-mono m-0 text-accent">Now playing</p>
          <p className="m-0 mt-1 truncate text-[20px] font-bold leading-tight">{track?.title ?? "Nothing playing"}</p>
          <p className="m-0 truncate text-[13px] text-surface-fg-muted">{track?.artist ?? "Pick a track from any year"}</p>
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
