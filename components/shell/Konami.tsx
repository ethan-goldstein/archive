"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { uiStore } from "@/lib/ui/uiStore";
import { playUnlock } from "@/lib/audio/chime";

const CODE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** ↑↑↓↓←→←→BA opens the secret archive folder. */
export function Konami() {
  const router = useRouter();
  const pos = useRef(0);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos.current = k === CODE[pos.current] ? pos.current + 1 : k === CODE[0] ? 1 : 0;
      if (pos.current === CODE.length) {
        pos.current = 0;
        playUnlock();
        uiStore.openDialog({
          title: "SECRET_ARCHIVE",
          message: "Hidden folder unlocked.",
          detail: "Contents: one unfinished game of backyard baseball, a timeline nobody was supposed to scrub, and a memory picked at random.",
          icon: "folder",
          buttons: [
            { label: "Open game", onClick: () => router.push("/backyard") },
            { label: "Random memory", onClick: () => router.push("/random") },
            { label: "Close", default: true },
          ],
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);
  return null;
}
