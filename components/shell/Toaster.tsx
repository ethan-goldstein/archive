"use client";

import { AnimatePresence, motion } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import type { IconName } from "@/lib/content/schema";
import { spring } from "@/lib/motion";

/** Old-notification-popup style toasts. Used sparingly (memory unlocked, copied link). */
export function Toaster() {
  const { toasts } = useUi();
  return (
    <div className="pointer-events-none fixed bottom-[calc(var(--player-h)+var(--tabbar-h)+16px)] right-4 z-50 flex w-[min(320px,calc(100vw-32px))] flex-col gap-2 md:bottom-[calc(var(--player-h)+var(--status-h)+16px)]" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 24 }}
            transition={spring.snappy}
            className="surface pointer-events-auto"
          >
            <div className="surface-chrome">
              <Icon name={(t.icon as IconName) ?? "info"} size={14} />
              <span className="surface-title font-semibold">{t.title}</span>
              <button type="button" onClick={() => uiStore.dismiss(t.id)} className="ml-auto opacity-70 hover:opacity-100" aria-label="Dismiss">
                <Icon name="close" size={12} />
              </button>
              <div className="dots" aria-hidden="true"><i /><i /><i /></div>
            </div>
            {t.body ? <div className="surface-body !py-3 text-[13px]">{t.body}</div> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
