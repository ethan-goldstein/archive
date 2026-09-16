"use client";
import { Artwork } from "../Artwork";
import { ProgressBar, Transport, VolumeControl } from "../Transport";
import { usePlayer } from "@/lib/player/usePlayer";

/** 2009–2012: glossy black, big rounded art, chrome slider. */
export function TouchSkin() {
  const p = usePlayer();
  const track = p.queue[p.index];
  return (
    <div className="flex flex-col gap-4 rounded-[14px] p-4" style={{ background: "linear-gradient(180deg, #2b2f36, #0c0e12)", boxShadow: "0 1px 0 rgba(255,255,255,.18) inset" }}>
      <div className="flex items-center gap-4">
        <Artwork track={track} size={96} className="rounded-[10px]" />
        <div className="min-w-0 flex-1 text-white">
          <p className="m-0 truncate text-[15px] font-semibold" style={{ textShadow: "0 1px 0 #000" }}>{track?.title ?? "Nothing playing"}</p>
          <p className="m-0 truncate text-[12px] text-white/70">{track?.artist ?? "Pick a track from any year"}</p>
        </div>
      </div>
      <ProgressBar className="text-white" />
      <div className="flex items-center justify-between text-white">
        <Transport />
        <VolumeControl />
      </div>
    </div>
  );
}
