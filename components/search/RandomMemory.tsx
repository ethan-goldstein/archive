"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { buildIndex } from "@/lib/search/buildIndex";
import { playUnlock } from "@/lib/audio/chime";
import { uiStore } from "@/lib/ui/uiStore";

/** Picks a real personal entry if any exist, otherwise a random year, and jumps there. */
export function RandomMemory() {
  const router = useRouter();
  const [label, setLabel] = useState("Shuffling…");

  useEffect(() => {
    const index = buildIndex();
    const personal = index.filter((e) => e.personal && e.type !== "tag");
    const pool = personal.length ? personal : index.filter((e) => e.type === "year");
    const pick = pool[Math.floor(Math.random() * pool.length)];
    const reveal = window.setTimeout(() => setLabel(pick.type === "year" ? `Back to ${pick.title}` : pick.title), 120);
    const jump = window.setTimeout(() => {
      playUnlock();
      uiStore.toast("Memory unlocked", pick.type === "year" ? `Opening ${pick.title}` : `${pick.title} · ${pick.year}`, "sparkle");
      router.replace(pick.href);
    }, 800);
    return () => { window.clearTimeout(reveal); window.clearTimeout(jump); };
  }, [router]);

  return (
    <main data-era="dark" className="flex flex-1 items-center justify-center px-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-border" style={{ animation: "crt-flicker 1.2s linear infinite" }}>
          <Icon name="shuffle" size={22} />
        </span>
        <p className="label-mono m-0 text-fg-muted">Random memory</p>
        <p className="m-0 font-serif text-[24px] italic">{label}</p>
      </div>
    </main>
  );
}
