"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchResults } from "./SearchResults";
import { Icon } from "@/components/ui/Icon";
import { useSearch } from "@/lib/search/useSearch";
import { EraProvider } from "@/lib/era/EraContext";

export function SearchPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const results = useSearch(query, 80);

  useEffect(() => {
    const t = setTimeout(() => {
      const url = query ? `/search?q=${encodeURIComponent(query)}` : "/search";
      window.history.replaceState(null, "", url);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <EraProvider era="glass">
      <main data-era="glass" className="mx-auto w-full max-w-[760px] flex-1 px-4 pb-[calc(var(--tabbar-h)+32px)] pt-8 md:px-8 md:pb-16">
        <p className="label-mono m-0 mb-2 text-fg-muted">Search</p>
        <h1 className="numeral m-0 text-[clamp(40px,8vw,72px)]">Find anything</h1>
        <div className="surface mt-6">
          <div className="flex items-center gap-3 px-4 py-3">
            <Icon name="search" size={16} className="opacity-60" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Years, songs, games, memories, tags…"
              className="min-w-0 flex-1 bg-transparent text-[16px] outline-none placeholder:text-surface-fg-muted"
              aria-label="Search"
              autoFocus
            />
          </div>
          <div className="border-t border-surface-border">
            <SearchResults results={results} onPick={(e) => router.push(e.href)} query={query} />
          </div>
        </div>
      </main>
    </EraProvider>
  );
}
