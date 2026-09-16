"use client";

import { Icon } from "@/components/ui/Icon";
import { playerStore, isPlayable } from "@/lib/player/store";
import { usePlayer } from "@/lib/player/usePlayer";
import { cn } from "@/lib/cn";

export function fmt(s: number) {
  if (!Number.isFinite(s) || s <= 0) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

/** Prev / play / next. Shared by every skin; the click wheel wraps it differently. */
export function Transport({ size = 20, className }: { size?: number; className?: string }) {
  const p = usePlayer();
  const track = p.queue[p.index];
  const canPlay = isPlayable(track);
  const playing = p.status === "playing";
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button type="button" onClick={() => playerStore.prev()} className="btn-ghost h-10 w-10 justify-center !px-0 border-transparent" aria-label="Previous track" disabled={!p.queue.length}>
        <Icon name="arrow-left" size={size * 0.8} />
      </button>
      <button
        type="button"
        onClick={() => playerStore.toggle()}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-fg shadow-[0_6px_16px_-6px_var(--glow)] disabled:opacity-40"
        aria-label={playing ? "Pause" : "Play"}
        disabled={!canPlay}
      >
        <Icon name={playing ? "pause" : "play"} size={size} />
      </button>
      <button type="button" onClick={() => playerStore.next()} className="btn-ghost h-10 w-10 justify-center !px-0 border-transparent" aria-label="Next track" disabled={!p.queue.length}>
        <Icon name="arrow-right" size={size * 0.8} />
      </button>
    </div>
  );
}

export function ProgressBar({ className, thin = false }: { className?: string; thin?: boolean }) {
  const p = usePlayer();
  const pct = p.duration ? (p.progress / p.duration) * 100 : 0;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {!thin ? <span className="label-mono w-9 text-right tabular-nums opacity-70">{fmt(p.progress)}</span> : null}
      <input
        type="range"
        min={0}
        max={p.duration || 1}
        step={0.1}
        value={p.progress}
        onChange={(e) => playerStore.seek(Number(e.target.value))}
        aria-label="Seek"
        className="player-range flex-1"
        style={{ ["--pct" as string]: `${pct}%` }}
        disabled={!p.duration}
      />
      {!thin ? <span className="label-mono w-9 tabular-nums opacity-70">{fmt(p.duration)}</span> : null}
    </div>
  );
}

export function VolumeControl({ className }: { className?: string }) {
  const p = usePlayer();
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Icon name="volume" size={14} className="opacity-70" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.02}
        value={p.volume}
        onChange={(e) => playerStore.setVolume(Number(e.target.value))}
        aria-label="Volume"
        className="player-range w-24"
        style={{ ["--pct" as string]: `${p.volume * 100}%` }}
      />
    </div>
  );
}
