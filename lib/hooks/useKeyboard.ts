"use client";
import { useEffect } from "react";

type Handler = (e: KeyboardEvent) => void;

/** Global keydown listener that ignores typing inside inputs unless `always` is set. */
export function useKeyboard(handler: Handler, deps: unknown[] = [], always = false) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (typing && !always) return;
      handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
