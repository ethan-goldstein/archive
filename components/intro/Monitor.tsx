import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A CSS-drawn 2005 monitor: graphite bezel, silver edge, a screen with phosphor glow and scanlines.
 * The screen content is passed in as children.
 */
export function Monitor({ children, on, className }: { children: ReactNode; on: boolean; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full", className)} style={{ maxWidth: "min(760px, calc((100dvh - 220px) * 1.28))" }}>
      <div
        className="relative rounded-[28px] p-[18px] md:p-[26px]"
        style={{
          background: "linear-gradient(180deg, #2a2a2e 0%, #17171a 100%)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.12) inset, 0 -2px 0 rgba(0,0,0,0.6) inset, 0 40px 80px -30px rgba(0,0,0,0.9)",
        }}
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-black"
          style={{ boxShadow: "0 0 0 2px #000, 0 0 0 3px rgba(255,255,255,0.06), 0 0 40px rgba(0,0,0,0.8) inset" }}
        >
          <div
            className={cn("absolute inset-0 origin-center", on ? "crt-screen-on" : "opacity-0")}
            style={{
              background: "radial-gradient(120% 90% at 50% 40%, #2d6bd1 0%, #123c8f 55%, #071b45 100%)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{ background: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0" style={{ background: "radial-gradient(100% 100% at 50% 50%, transparent 60%, rgba(0,0,0,0.55) 100%)" }} aria-hidden="true" />
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10">{children}</div>
            <div className="pointer-events-none absolute inset-0 opacity-30" style={{ background: "linear-gradient(115deg, rgba(255,255,255,0.18) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)" }} aria-hidden="true" />
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between px-2 md:mt-4">
          <span className="font-pixel text-[9px] tracking-[0.2em] text-white/40">ARCHIVE-2005</span>
          <span className={cn("h-2 w-2 rounded-full", on ? "bg-[#6cff8a] shadow-[0_0_8px_#6cff8a]" : "bg-[#ff7a3d] shadow-[0_0_6px_#ff7a3d]")} aria-hidden="true" />
        </div>
      </div>
      <div className="mx-auto h-8 w-24 rounded-b-[12px]" style={{ background: "linear-gradient(180deg, #17171a, #0a0a0b)" }} aria-hidden="true" />
      <div className="mx-auto h-2 w-64 rounded-full" style={{ background: "linear-gradient(180deg, #2a2a2e, #0a0a0b)" }} aria-hidden="true" />
    </div>
  );
}
