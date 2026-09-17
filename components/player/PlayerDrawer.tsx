"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DiscSkin } from "./skins/Disc";
import { TouchSkin } from "./skins/Touch";
import { FlatSkin } from "./skins/Flat";
import { StreamSkin } from "./skins/Stream";
import { GlassSkin } from "./skins/Glass";
import { Icon } from "@/components/ui/Icon";
import { useGlobalEra } from "@/lib/era/EraContext";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import { usePlayer } from "@/lib/player/usePlayer";
import { playerStore, externalUrl, externalLabel } from "@/lib/player/store";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";
import type { EraId } from "@/lib/content/schema";

const skins: Record<EraId, () => React.JSX.Element> = { xp: DiscSkin, aero: TouchSkin, flat: FlatSkin, dark: StreamSkin, glass: GlassSkin };
const skinName: Record<EraId, string> = { xp: "Disc", aero: "Touch", flat: "Flat", dark: "Stream", glass: "Glass" };

/** The expanded player. Its skin follows the era of the year you are looking at. */
export function PlayerDrawer() {
  const { playerOpen } = useUi();
  const era = useGlobalEra();
  const p = usePlayer();
  const [tab, setTab] = useState<"player" | "queue">("player");
  const Skin = skins[era];
  const track = p.queue[p.index];
  const url = externalUrl(track);

  useKeyboard((e) => {
    if (!playerOpen) return;
    if (e.key === "Escape") uiStore.closePlayer();
    if (e.key === " ") { e.preventDefault(); playerStore.toggle(); }
  }, [playerOpen], false);

  return (
    <AnimatePresence>
      {playerOpen ? (
        <>
          <motion.div className="fixed inset-0 z-[65] bg-black/40 md:bg-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => uiStore.closePlayer()} />
          <motion.aside
            role="dialog"
            aria-label="Music player"
            data-lenis-prevent
            className="surface fixed inset-x-0 bottom-0 z-[70] max-h-[85dvh] overflow-y-auto overscroll-contain rounded-b-none md:inset-auto md:bottom-[calc(var(--player-h)+var(--status-h)+16px)] md:right-6 md:w-[420px] md:rounded-b-[var(--radius-era)]"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={spring.drawer}
          >
            <div className="surface-chrome">
              <Icon name="music" size={14} />
              <span className="surface-title font-semibold">Music · {skinName[era]}</span>
              <div className="ml-auto flex gap-1">
                {(["player", "queue"] as const).map((t) => (
                  <button key={t} type="button" onClick={() => setTab(t)} className={cn("label-mono rounded px-2 py-1", tab === t ? "bg-accent text-accent-fg" : "opacity-70")}>{t}</button>
                ))}
              </div>
              <button type="button" onClick={() => uiStore.closePlayer()} className="ml-2 opacity-70 hover:opacity-100" aria-label="Close player"><Icon name="close" size={14} /></button>
              <div className="dots" aria-hidden="true"><i /><i /><i /></div>
            </div>
            <div className="surface-body">
              {tab === "player" ? (
                <>
                  <Skin />
                  {p.status === "external" && url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn-era mt-4 w-full justify-center">
                      <Icon name="arrow-right" size={14} />
                      {externalLabel(track)}
                    </a>
                  ) : null}
                  {p.backend === "youtube" ? <p className="m-0 mt-4 text-center text-[12px] text-surface-fg-muted">Playing through YouTube in the player bar below.</p> : null}
                  {p.status === "unavailable" ? <p className="m-0 mt-4 text-center text-[12px] italic text-surface-fg-muted">No audio for this track yet. Add a source in its content file.</p> : null}
                  {p.status === "error" ? <p className="m-0 mt-4 text-center text-[12px] italic text-surface-fg-muted">That file would not play. Check the path under public/music/.</p> : null}
                </>
              ) : (
                <ol className="m-0 list-none divide-y divide-surface-border p-0">
                  {p.queue.length ? p.queue.map((t, i) => (
                    <li key={t.id}>
                      <button type="button" onClick={() => playerStore.jumpTo(i)} className={cn("flex w-full items-center gap-3 py-2 text-left", i === p.index && "text-accent")}>
                        <span className="label-mono w-5 text-right tabular-nums opacity-60">{i + 1}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[13px] font-medium">{t.title}</span>
                          <span className="block truncate text-[12px] text-surface-fg-muted">{t.artist}</span>
                        </span>
                      </button>
                    </li>
                  )) : <li className="py-2 text-[13px] italic text-surface-fg-muted">The queue is empty. Press play on a track in any year.</li>}
                </ol>
              )}
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
