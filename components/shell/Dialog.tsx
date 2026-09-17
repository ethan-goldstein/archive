"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import type { IconName } from "@/lib/content/schema";
import { useKeyboard } from "@/lib/hooks/useKeyboard";

/** A small modal driven by uiStore.openDialog. */
export function Dialog() {
  const { dialog } = useUi();
  const defaultBtn = useRef<HTMLButtonElement>(null);
  useEffect(() => { if (dialog) defaultBtn.current?.focus(); }, [dialog]);
  useKeyboard((e) => { if (dialog && e.key === "Escape") uiStore.closeDialog(); }, [dialog], true);

  return (
    <AnimatePresence>
      {dialog ? (
        <motion.div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => uiStore.closeDialog()}>
          <motion.div
            role="alertdialog" aria-modal="true" aria-labelledby="dlg-title" aria-describedby="dlg-msg"
            className="surface w-full max-w-[420px] p-6"
            initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 8, opacity: 0 }} transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg"><Icon name={(dialog.icon as IconName) ?? "info"} size={18} /></span>
              <div className="min-w-0">
                <p id="dlg-title" className="label-mono m-0 text-surface-fg-muted">{dialog.title}</p>
                <p id="dlg-msg" className="m-0 mt-1 text-[15px] font-medium leading-snug">{dialog.message}</p>
                {dialog.detail ? <p className="m-0 mt-2 text-[13px] leading-relaxed text-surface-fg-muted">{dialog.detail}</p> : null}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {dialog.buttons.map((b) => (
                <button key={b.label} ref={b.default ? defaultBtn : undefined} type="button" onClick={() => { uiStore.closeDialog(); b.onClick?.(); }} className={b.default ? "btn-era" : "btn-ghost text-surface-fg"}>
                  {b.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
