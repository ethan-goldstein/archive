"use client";

import { AnimatePresence, motion } from "motion/react";
import { Artwork } from "./Artwork";
import { YouTubeHost } from "./YouTubeHost";
import { Transport, ProgressBar } from "./Transport";
import { Icon } from "@/components/ui/Icon";
import { usePlayer } from "@/lib/player/usePlayer";
import { uiStore } from "@/lib/ui/uiStore";
import { spring } from "@/lib/motion";

/** The persistent mini player. Appears once something is queued; tap to open the drawer. */
export function PlayerBar() {
  const p = usePlayer();
  const track = p.queue[p.index];

  return (
    <AnimatePresence>
      {track ? (
        <motion.div
          className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-[60] md:bottom-0"
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={spring.drawer}
        >
          <div className="mx-auto flex h-[var(--player-h)] max-w-[1400px] items-center gap-3 border-t border-border px-3 md:px-6" style={{ background: "color-mix(in srgb, var(--bg-deep) 96%, transparent)" }}>
            {p.backend === "youtube" ? <YouTubeHost /> : null}
            <button type="button" onClick={() => uiStore.togglePlayer()} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label="Open music player">
              {p.backend !== "youtube" ? <Artwork track={track} size={40} /> : null}
              <span className="min-w-0">
                <span className="label-mono block text-fg-muted">Now playing</span>
                <span className="block truncate text-[13px] font-medium">{track.title} <span className="text-fg-muted">· {track.artist}</span></span>
              </span>
            </button>
            <ProgressBar thin className="hidden w-64 md:flex" />
            <Transport size={16} />
            <button type="button" onClick={() => uiStore.togglePlayer()} className="btn-ghost hidden h-9 w-9 justify-center !px-0 md:flex" aria-label="Open player">
              <Icon name="music" size={14} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
