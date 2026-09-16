"use client";

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { addressForPath, resolveAddress } from "@/lib/browser/title";
import { usePath } from "@/lib/hooks/usePath";
import { stripBase } from "@/lib/basePath";
import { uiStore } from "@/lib/ui/uiStore";

const noop = () => () => {};

/** Address: http://ethan.goldstein/year/2012 — type a year or a path and press Enter. */
export function AddressBar() {
  const pathname = usePath();
  // On a static 404 the server rendered /_not-found; the browser knows the real URL. Hydration-safe via useSyncExternalStore.
  const clientPath = useSyncExternalStore(noop, () => stripBase(window.location.pathname), () => null);
  const current = addressForPath(clientPath ?? pathname);
  return <AddressInput current={current} />;
}

function AddressInput({ current }: { current: string }) {
  const router = useRouter();
  const [value, setValue] = useState(current);
  const [prev, setPrev] = useState(current);
  if (prev !== current) { setPrev(current); setValue(current); }

  const go = () => {
    const path = resolveAddress(value);
    if (path) {
      uiStore.setStatus(`Opening ${path}…`, true, 600);
      router.push(path);
    } else {
      const q = value.replace(/^https?:\/\/[^/]+\/?/, "");
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <form
      className="flex h-8 items-center gap-2 border-b border-[var(--os-face-dark)] px-2"
      onSubmit={(e) => { e.preventDefault(); go(); }}
      role="search"
      aria-label="Address"
    >
      <label htmlFor="address" className="os-menu-font hidden sm:block">Address:</label>
      <div className="bevel-in flex min-w-0 flex-1 items-center gap-1 pl-1">
        <Icon name="globe" size={12} className="shrink-0 opacity-70 text-[var(--os-text)]" aria-hidden="true" />
        <input
          id="address"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="os-field min-w-0 flex-1 !bg-transparent !shadow-none"
          spellCheck={false}
          autoComplete="off"
          aria-label="Address"
        />
      </div>
      <button type="submit" className="os-tool !h-6 !min-w-0 !flex-row gap-1 bevel-out px-2 !text-[9px]">
        <Icon name="arrow-right" size={10} />Go
      </button>
    </form>
  );
}
