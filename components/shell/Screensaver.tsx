"use client";

import { useEffect, useRef, useState } from "react";
import { usePath } from "@/lib/hooks/usePath";
import { profile } from "@/content/profile";

const IDLE_MS = 120_000;

/** After two idle minutes: a bouncing archive badge over the sky, like a 1998 screensaver. Any input wakes it. */
export function Screensaver() {
  const pathname = usePath();
  const [on, setOn] = useState(false);
  const badge = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname === "/" || pathname === "/backyard") return;
    let timer = window.setTimeout(() => setOn(true), IDLE_MS);
    const reset = () => { window.clearTimeout(timer); setOn(false); timer = window.setTimeout(() => setOn(true), IDLE_MS); };
    const events = ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => { window.clearTimeout(timer); events.forEach((e) => window.removeEventListener(e, reset)); };
  }, [pathname]);

  useEffect(() => {
    if (!on) return;
    const el = badge.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let x = 40, y = 60, vx = 1.6, vy = 1.2, raf = 0;
    const tick = () => {
      const w = window.innerWidth - el.offsetWidth, h = window.innerHeight - el.offsetHeight;
      x += vx; y += vy;
      if (x <= 0 || x >= w) vx = -vx;
      if (y <= 0 || y >= h) vy = -vy;
      el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [on]);

  if (!on) return null;
  return (
    <div className="fixed inset-0 z-[120] bg-black" aria-label="Screensaver. Press any key to continue." role="status">
      <div ref={badge} className="absolute left-0 top-0 flex flex-col items-center gap-1 will-change-transform">
        <span className="pow text-[40px] text-[#ffe66d]" style={{ ["--pow-shadow" as string]: "#3aa0ff" }}>{profile.wordmark}</span>
        <span className="font-pixel text-[10px] uppercase tracking-[0.3em] text-white/70">{profile.archiveLabel}</span>
      </div>
      <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-pixel text-[9px] uppercase tracking-[0.2em] text-white/40">Press any key</p>
    </div>
  );
}
