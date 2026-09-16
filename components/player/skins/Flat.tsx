"use client";
import { Artwork } from "../Artwork";
import { ProgressBar, Transport, VolumeControl } from "../Transport";
import { usePlayer } from "@/lib/player/usePlayer";

/** 2013–2016: white card, huge art, flat controls. */
export function FlatSkin() {
  const p = usePlayer();
  const track = p.queue[p.index];
  return (
    <div className="flex flex-col items-center gap-4">
      <Artwork track={track} size={220} className="rounded-[4px]" />
      <div className="w-full text-center">
        <p className="m-0 truncate text-[18px] font-bold">{track?.title ?? "Nothing playing"}</p>
        <p className="m-0 truncate text-[13px] text-surface-fg-muted">{track?.artist ?? "Pick a track from any year"}</p>
      </div>
      <ProgressBar className="w-full" />
      <Transport size={22} />
      <VolumeControl />
    </div>
  );
}
