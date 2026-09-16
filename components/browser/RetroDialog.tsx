"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import type { IconName } from "@/lib/content/schema";
import { useKeyboard } from "@/lib/hooks/useKeyboard";

/** A modal OS dialog: title bar, icon, message, buttons. Driven by uiStore.openDialog. */
export function RetroDialog() {
  const { dialog } = useUi();
  const defaultBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (dialog) defaultBtn.current?.focus(); }, [dialog]);
  useKeyboard((e) => { if (dialog && e.key === "Escape") uiStore.closeDialog(); }, [dialog], true);

  return (
    <AnimatePresence>
      {dialog ? (
        <motion.div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/30 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => uiStore.closeDialog()}>
          <motion.div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="rd-title"
            aria-describedby="rd-msg"
            className="os-window bevel-out w-full max-w-[400px]"
            initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="os-title flex h-7 items-center gap-2 px-2">
              <span id="rd-title" className="os-title-text flex-1 truncate">{dialog.title}</span>
              <button type="button" onClick={() => uiStore.closeDialog()} className="os-btn bevel-out" aria-label="Close"><span aria-hidden="true">×</span></button>
            </div>
            <div className="flex gap-4 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--os-highlight)] text-[var(--os-highlight-fg)]">
                <Icon name={(dialog.icon as IconName) ?? "info"} size={20} />
              </span>
              <div className="min-w-0 font-sans text-[13px] leading-snug">
                <p id="rd-msg" className="m-0 font-medium">{dialog.message}</p>
                {dialog.detail ? <p className="m-0 mt-1 text-[12px] text-[var(--os-text-muted)]">{dialog.detail}</p> : null}
              </div>
            </div>
            <div className="flex justify-end gap-2 px-4 pb-4">
              {dialog.buttons.map((b) => (
                <button
                  key={b.label}
                  ref={b.default ? defaultBtn : undefined}
                  type="button"
                  data-default={b.default ? "true" : undefined}
                  onClick={() => { uiStore.closeDialog(); b.onClick?.(); }}
                  className="os-dialog-btn bevel-out"
                >
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
