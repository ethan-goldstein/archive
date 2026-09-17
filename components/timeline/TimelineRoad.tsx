"use client";

import dynamic from "next/dynamic";

const Inner = dynamic(() => import("./TimelineRoadInner"), { ssr: false, loading: () => null });

export function TimelineRoad({ year }: { year: number }) {
  return <Inner year={year} />;
}
