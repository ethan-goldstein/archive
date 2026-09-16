"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { SearchResults } from "./SearchResults";
import { Icon } from "@/components/ui/Icon";
import { Kbd } from "@/components/ui/Kbd";
import { useSearch } from "@/lib/search/useSearch";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { dur, ease } from "@/lib/motion";
import type { SearchEntry } from "@/lib/search/buildIndex";

/** ⌘K. Searches years, memories, songs, games, photos, tags. */
export function CommandPalette() {
  const { paletteOpen } = useUi();

  useKeyboard(
    (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); uiStore.togglePalette(); }
      else if (e.key === "/" && !paletteOpen) { e.preventDefault(); uiStore.openPalette(); }
    },
    [paletteOpen],
    true,
  );

  return (
    <AnimatePresence>
      {paletteOpen ? (
        <motion.div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/50 p-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: dur.fast }} onClick={() => uiStore.closePalette()}>
          <PaletteDialog />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Mounted only while open, so its state starts fresh every time. */
function PaletteDialog() {
  const router = useRouter();
  const [query, setQueryState] = useState("");
  const [active, setActive] = useState(0);
  const results = useSearch(query, 30);

  const setQuery = (v: string) => { setQueryState(v); setActive(0); };
  const pick = (e: SearchEntry) => { uiStore.closePalette(); router.push(e.href); };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") uiStore.closePalette();
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(0, a - 1)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); pick(results[active]); }
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search the archive"
      className="surface w-full max-w-[640px]"
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: dur.base, ease: ease.outQuart }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="surface-chrome">
        <Icon name="search" size={14} />
        <span className="surface-title font-semibold">Search the archive</span>
        <div className="dots" aria-hidden="true"><i /><i /><i /></div>
      </div>
      <div className="flex items-center gap-3 border-b border-surface-border px-4 py-3">
        <Icon name="search" size={16} className="opacity-60" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search years, songs, games, memories, tags…"
          className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-surface-fg-muted"
          aria-label="Search"
          autoComplete="off"
          autoFocus
        />
        <Kbd>esc</Kbd>
      </div>
      <div className="max-h-[52vh] overflow-y-auto text-surface-fg">
        <SearchResults results={results} activeId={results[active]?.id} onPick={pick} onHover={(e) => setActive(results.findIndex((r) => r.id === e.id))} query={query} />
      </div>
      <div className="label-mono flex items-center justify-between border-t border-surface-border px-4 py-2 text-surface-fg-muted">
        <span>↑ ↓ to move · ↵ to open</span>
        <span>{results.length ? `${results.length} results` : ""}</span>
      </div>
    </motion.div>
  );
}
