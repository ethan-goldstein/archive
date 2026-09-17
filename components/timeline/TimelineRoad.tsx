"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Inner = dynamic(() => import("./TimelineRoadInner"), { ssr: false, loading: () => null });

export function TimelineRoad({ year }: { year: number }) {
  // Mount after the page has painted and the browser is idle, so three never competes with first paint.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number; cancelIdleCallback?: (id: number) => void };
    let id = 0;
    const go = () => setReady(true);
    if (w.requestIdleCallback) { id = w.requestIdleCallback(go, { timeout: 1200 }); return () => w.cancelIdleCallback?.(id); }
    id = window.setTimeout(go, 250);
    return () => window.clearTimeout(id);
  }, []);
  return ready ? <Inner year={year} /> : null;
}
