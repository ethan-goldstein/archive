"use client";

import { Icon } from "@/components/ui/Icon";
import { typeLabel } from "@/lib/search/buildIndex";
import { groupResults } from "@/lib/search/useSearch";
import type { SearchEntry } from "@/lib/search/buildIndex";
import { cn } from "@/lib/cn";

interface Props {
  results: SearchEntry[];
  activeId?: string;
  onPick: (entry: SearchEntry) => void;
  onHover?: (entry: SearchEntry) => void;
  query: string;
}

export function SearchResults({ results, activeId, onPick, onHover, query }: Props) {
  if (!query.trim()) {
    return <p className="m-0 px-4 py-6 text-center text-[13px] text-fg-muted">Type a year, a song, a game, a memory, or a tag.</p>;
  }
  if (!results.length) {
    return <p className="m-0 px-4 py-6 text-center text-[13px] italic text-fg-muted">Nothing in the archive matches &ldquo;{query}&rdquo;.</p>;
  }
  return (
    <div className="flex flex-col gap-3 py-2">
      {groupResults(results).map((g) => (
        <section key={g.type} aria-label={typeLabel[g.type]}>
          <p className="label-mono m-0 px-4 pb-1 text-fg-muted">{typeLabel[g.type]}</p>
          <ul className="m-0 list-none p-0" role="listbox">
            {g.items.map((e) => (
              <li key={e.id} role="option" aria-selected={e.id === activeId}>
                <button
                  type="button"
                  onClick={() => onPick(e)}
                  onMouseEnter={() => onHover?.(e)}
                  className={cn("flex w-full items-center gap-3 px-4 py-2 text-left transition-colors", e.id === activeId ? "bg-[color-mix(in_srgb,var(--accent)_18%,transparent)]" : "hover:bg-[color-mix(in_srgb,var(--fg)_6%,transparent)]")}
                >
                  <Icon name={e.icon} size={16} className="shrink-0 opacity-70" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">{e.title}</span>
                    {e.subtitle ? <span className="block truncate text-[12px] text-fg-muted">{e.subtitle}</span> : null}
                  </span>
                  <span className={cn("label-mono shrink-0 rounded px-1.5 py-0.5", e.personal ? "bg-accent text-accent-fg" : "border border-border text-fg-muted")}>{e.year}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
