"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import { buildIndex, typeOrder, type SearchEntry } from "./buildIndex";

let fuse: Fuse<SearchEntry> | null = null;
function getFuse() {
  if (!fuse) {
    fuse = new Fuse(buildIndex(), {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "subtitle", weight: 0.25 },
        { name: "keywords", weight: 0.15 },
      ],
      threshold: 0.34,
      ignoreLocation: true,
      minMatchCharLength: 2,
    });
  }
  return fuse;
}

export function useSearch(query: string, limit = 40) {
  return useMemo(() => {
    const q = query.trim();
    if (!q) return [] as SearchEntry[];
    if (/^\d{4}$/.test(q)) {
      const y = buildIndex().find((e) => e.type === "year" && e.title === q);
      return y ? [y, ...getFuse().search(q, { limit }).map((r) => r.item).filter((e) => e.id !== y.id)] : [];
    }
    return getFuse().search(q, { limit }).map((r) => r.item);
  }, [query, limit]);
}

export function groupResults(results: SearchEntry[]) {
  const groups = new Map<SearchEntry["type"], SearchEntry[]>();
  for (const r of results) groups.set(r.type, [...(groups.get(r.type) ?? []), r]);
  return typeOrder.filter((t) => groups.has(t)).map((t) => ({ type: t, items: groups.get(t)! }));
}
