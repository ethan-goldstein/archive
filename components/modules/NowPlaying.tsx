"use client";

import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { GroupLabel } from "./ItemChip";
import { Icon } from "@/components/ui/Icon";
import { isPlaceholder, partition } from "@/lib/content/placeholders";
import type { Track, YearData } from "@/lib/content/schema";
import { playerStore, isPlayable, externalUrl, externalLabel, isYouTube } from "@/lib/player/store";
import { usePlayer } from "@/lib/player/usePlayer";
import { uiStore } from "@/lib/ui/uiStore";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/basePath";

function Sleeve({ track, size = 44 }: { track: Track; size?: number }) {
  if (track.art) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(track.art)} alt="" width={size} height={size} className="shrink-0 rounded-[var(--radius-sm)] object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border border-surface-border"
      style={{ width: size, height: size, background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 35%, transparent), color-mix(in srgb, var(--accent-2) 25%, transparent))" }}
    >
      <Icon name="cd" size={size * 0.5} className="opacity-60" />
    </div>
  );
}

export function TrackRow({ track, queue, dense = false }: { track: Track; queue: Track[]; dense?: boolean }) {
  const player = usePlayer();
  const current = player.queue[player.index]?.id === track.id;
  const playing = current && player.status === "playing";
  const playable = isPlayable(track);
  const url = externalUrl(track);

  return (
    <div className={cn("flex items-center gap-3", dense ? "py-1.5" : "py-2")}>
      <Sleeve track={track} size={dense ? 36 : 44} />
      <div className="min-w-0 flex-1">
        <p className={cn("m-0 truncate font-medium leading-tight", dense ? "text-[13px]" : "text-[14px]", current && "text-accent")}>{track.title}</p>
        <p className="m-0 truncate text-[12px] leading-tight text-surface-fg-muted">
          {track.artist}
          {track.album ? ` · ${track.album}` : ""}
        </p>
        {track.note ? <p className="m-0 mt-0.5 truncate text-[12px] italic text-surface-fg-muted">{track.note}</p> : null}
      </div>
      {playable ? (
        <button
          type="button"
          onClick={() => { playerStore.play(track, queue); uiStore.openPlayer(); }}
          className="btn-ghost h-8 gap-2 px-3 text-[11px] uppercase tracking-[0.12em]"
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
        >
          <Icon name={playing ? "pause" : "play"} size={12} />
          {playing ? "Playing" : isYouTube(track) ? "Play (YT)" : "Play"}
        </button>
      ) : url ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="btn-ghost h-8 gap-2 px-3 text-[11px] uppercase tracking-[0.12em]">
          <Icon name="arrow-right" size={12} />
          Open
          <span className="sr-only">{externalLabel(track)}</span>
        </a>
      ) : null}
    </div>
  );
}

export function NowPlaying({ data }: { data: YearData }) {
  const { real, placeholders } = partition<Track>(data.personal.music);
  const charts = data.culture.music;

  return (
    <Surface id="music" title="Now Playing" icon="music" aside={`${data.year}`}>
      <GroupLabel>My tracks</GroupLabel>
      <div className="mb-4 divide-y divide-surface-border">
        {data.personal.music.map((t, i) =>
          isPlaceholder(t) ? (
            <div key={t.id ?? i} className="py-2">
              <Placeholder placeholder={t} year={data.year} />
            </div>
          ) : (
            <TrackRow key={t.id} track={t} queue={real} />
          ),
        )}
        {!real.length && !placeholders.length ? <p className="m-0 py-2 text-[13px] italic text-surface-fg-muted">No tracks filed for this year yet.</p> : null}
      </div>
      {charts.length ? (
        <>
          <GroupLabel>On the charts that year</GroupLabel>
          <ul className="m-0 list-none p-0">
            {charts.map((t) => (
              <li key={t.id} className="flex items-baseline gap-3 border-t border-surface-border py-1.5 text-[13px] first:border-t-0">
                <span className="min-w-0 flex-1 truncate">{t.title}</span>
                <span className="shrink-0 truncate text-[12px] text-surface-fg-muted">{t.artist}</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </Surface>
  );
}
