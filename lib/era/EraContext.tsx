"use client";

import { createContext, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import type { EraId } from "@/lib/content/schema";

/**
 * Two ways to know the era:
 *  - <EraProvider era>: page-scoped, SSR-correct. Pages set the era for their subtree
 *    and put data-era on their <main>, which drives the CSS tokens via html:has().
 *  - eraStore: a client mirror for chrome that lives outside the page (player skin).
 */
const EraCtx = createContext<EraId>("glass");

let current: EraId = "glass";
const listeners = new Set<() => void>();
export const eraStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
  get: () => current,
  set(era: EraId) {
    if (era === current) return;
    current = era;
    listeners.forEach((l) => l());
  },
};

export function EraProvider({ era, children }: { era: EraId; children: ReactNode }) {
  useEffect(() => {
    eraStore.set(era);
  }, [era]);
  return <EraCtx.Provider value={era}>{children}</EraCtx.Provider>;
}

/** Era of the page subtree (SSR-safe). */
export function useEra(): EraId {
  return useContext(EraCtx);
}

/** Era as seen by global chrome (client mirror, defaults to glass on the server). */
export function useGlobalEra(): EraId {
  return useSyncExternalStore(eraStore.subscribe, eraStore.get, () => "glass" as EraId);
}
