"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import type { Track } from "@/lib/content/schema";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/basePath";

/** Album art or a generated sleeve. `disc` renders it as a spinning CD (xp era). */
export function Artwork({ track, size = 160, disc = false, spinning = false, className }: { track?: Track; size?: number; disc?: boolean; spinning?: boolean; className?: string }) {
  const inner = track?.art ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset(track.art)} alt="" width={size} height={size} className="h-full w-full object-cover" />
  ) : (
    <div className="flex h-full w-full items-center justify-center" style={{ background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 45%, transparent), color-mix(in srgb, var(--accent-2) 30%, transparent))" }}>
      <Icon name={disc ? "cd" : "music"} size={size * 0.36} className="opacity-70" />
    </div>
  );
  return (
    <motion.div
      className={cn("relative shrink-0 overflow-hidden", disc ? "rounded-full" : "rounded-[var(--radius-sm)]", className)}
      style={{ width: size, height: size, boxShadow: "0 12px 30px -12px rgba(0,0,0,.7)" }}
      animate={disc && spinning ? { rotate: 360 } : { rotate: 0 }}
      transition={disc && spinning ? { repeat: Infinity, ease: "linear", duration: 4 } : { duration: 0.3 }}
    >
      {inner}
      {disc ? (
        <>
          <div className="pointer-events-none absolute inset-0 rounded-full" style={{ background: "conic-gradient(from 0deg, rgba(255,255,255,0.25), transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%, rgba(255,255,255,0.25))", mixBlendMode: "overlay" }} />
          <div className="absolute left-1/2 top-1/2 h-[22%] w-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-bg-deep" style={{ boxShadow: "0 0 0 2px rgba(255,255,255,0.4)" }} />
        </>
      ) : null}
    </motion.div>
  );
}
