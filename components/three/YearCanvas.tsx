"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./YearCanvasInner"), { ssr: false, loading: () => null });

/** Lazy, client-only entry point so three.js never touches the server bundle or the non-year pages. */
export function YearCanvas({ year }: { year: number }) {
  return <Inner year={year} />;
}
