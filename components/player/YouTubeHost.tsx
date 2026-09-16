"use client";

import { useEffect, useRef } from "react";
import { createYouTubePlayer, type YtController } from "@/lib/player/adapters/youtube";
import { playerStore } from "@/lib/player/store";
import { usePlayer } from "@/lib/player/usePlayer";

/** The one visible YouTube player. Mounted in the PlayerBar while a YouTube track is current. */
export function YouTubeHost() {
  const { youtubeId } = usePlayer();
  const host = useRef<HTMLDivElement>(null);
  const ctrl = useRef<YtController | null>(null);

  useEffect(() => {
    if (!youtubeId || !host.current) return;
    let cancelled = false;
    const mount = document.createElement("div");
    host.current.replaceChildren(mount);
    void createYouTubePlayer(mount, youtubeId, (s) => { if (ctrl.current) playerStore.reportYouTube(ctrl.current.time(), ctrl.current.duration(), s); }).then((c) => {
      if (cancelled) { c.destroy(); return; }
      ctrl.current = c;
      playerStore.attachYouTube(c);
    });
    const poll = setInterval(() => { const c = ctrl.current; if (c) playerStore.reportYouTube(c.time(), c.duration(), c.playing() ? "playing" : "paused"); }, 400);
    return () => { cancelled = true; clearInterval(poll); playerStore.attachYouTube(null); ctrl.current?.destroy(); ctrl.current = null; };
    // the host is created once per session; new videos load through the controller
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!youtubeId]);

  if (!youtubeId) return null;
  return <div ref={host} className="h-[54px] w-[96px] shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-black [&_iframe]:h-full [&_iframe]:w-full" aria-label="YouTube player" />;
}
