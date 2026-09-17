"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type { Season } from "@/lib/content/seasons";
import { scrollStore } from "@/lib/scroll/progress";
import { cn } from "@/lib/cn";

/** A scroll chapter. Registers itself with the scroll store so the 3D camera and the season blend can follow it. */
export function Chapter({ id, season, children, className }: { id: string; season: Season; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    return scrollStore.register(id, season, ref.current);
  }, [id, season]);
  return (
    <section ref={ref} id={`chapter-${id}`} data-chapter={id} data-season={season} className={cn("chapter", className)}>
      {children}
    </section>
  );
}
