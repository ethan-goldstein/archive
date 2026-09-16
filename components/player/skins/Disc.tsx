"use client";
import { Artwork } from "../Artwork";
import { ProgressBar, Transport } from "../Transport";
import { Icon } from "@/components/ui/Icon";
import { playerStore } from "@/lib/player/store";
import { usePlayer } from "@/lib/player/usePlayer";

/** 2005–2008: CD in a tray, a click-wheel pad below. */
export function DiscSkin() {
  const p = usePlayer();
  const track = p.queue[p.index];
  return (
    <div className="flex flex-col items-center gap-5">
      <Artwork track={track} size={180} disc spinning={p.status === "playing"} />
      <div className="w-full text-center">
        <p className="m-0 truncate text-[15px] font-semibold">{track?.title ?? "No disc"}</p>
        <p className="m-0 truncate text-[12px] text-surface-fg-muted">{track?.artist ?? "Insert a track from any year"}</p>
      </div>
      <ProgressBar className="w-full" />
      <div className="relative flex h-40 w-40 items-center justify-center rounded-full" style={{ background: "radial-gradient(circle at 50% 40%, #f7f7f7, #cfcfcf 70%, #a9a9a9)", boxShadow: "0 1px 0 #fff inset, 0 10px 24px -10px rgba(0,0,0,.6)" }}>
        <span className="label-mono absolute top-3 text-[9px] text-[#333]">menu</span>
        <button type="button" onClick={() => playerStore.prev()} className="absolute left-3 text-[#333]" aria-label="Previous"><Icon name="arrow-left" size={16} /></button>
        <button type="button" onClick={() => playerStore.next()} className="absolute right-3 text-[#333]" aria-label="Next"><Icon name="arrow-right" size={16} /></button>
        <button type="button" onClick={() => playerStore.toggle()} className="absolute bottom-3 text-[#333]" aria-label="Play or pause"><Icon name={p.status === "playing" ? "pause" : "play"} size={14} /></button>
        <button type="button" onClick={() => playerStore.toggle()} className="h-14 w-14 rounded-full" style={{ background: "radial-gradient(circle at 50% 30%, #fff, #dcdcdc)", boxShadow: "0 0 0 1px #b5b5b5, 0 2px 4px rgba(0,0,0,.2)" }} aria-label="Select" />
      </div>
      <Transport className="sr-only" />
    </div>
  );
}
