"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMenus } from "./useMenus";
import { Icon } from "@/components/ui/Icon";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import { spring } from "@/lib/motion";

/** Phone version of the menu bar: every menu as a section in a bottom sheet. */
export function MenuSheet() {
  const { menuSheetOpen } = useUi();
  const menus = useMenus();
  return (
    <AnimatePresence>
      {menuSheetOpen ? (
        <>
          <motion.div className="fixed inset-0 z-[75] bg-black/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => uiStore.closeMenuSheet()} />
          <motion.div
            role="dialog"
            aria-label="Menu"
            data-lenis-prevent
            className="os-window bevel-out fixed inset-x-0 bottom-0 z-[76] max-h-[80dvh] overflow-y-auto overscroll-contain rounded-b-none pb-[env(safe-area-inset-bottom)]"
            initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }} transition={spring.drawer}
          >
            <div className="os-title flex h-8 items-center gap-2 px-3">
              <span className="os-title-text flex-1">Menu</span>
              <button type="button" onClick={() => uiStore.closeMenuSheet()} className="os-btn bevel-out" aria-label="Close menu"><Icon name="close" size={10} /></button>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
              {menus.map((m) => (
                <section key={m.id} className="bevel-in bg-[var(--os-field)] p-2">
                  <p className="os-menu-font m-0 mb-1 px-1 text-[var(--os-text-muted)]">{m.label}</p>
                  {m.items.map((it, i) =>
                    it.type === "sep" ? null : (
                      <button key={i} type="button" onClick={() => { it.onSelect(); if (it.type === "item") uiStore.closeMenuSheet(); }} className="os-menu-font flex w-full items-center gap-2 px-2 py-2 text-left text-[12px] hover:bg-[var(--os-highlight)] hover:text-[var(--os-highlight-fg)]">
                        <span className="inline-block w-3 text-center">{it.type === "check" && it.checked ? "✓" : it.type === "radio" && it.checked ? "•" : ""}</span>
                        {it.label}
                      </button>
                    ),
                  )}
                </section>
              ))}
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
