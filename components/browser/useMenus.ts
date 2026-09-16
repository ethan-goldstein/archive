"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { buildMenus } from "@/lib/browser/menus";
import { useSettings } from "@/lib/settings/SettingsContext";
import { uiStore } from "@/lib/ui/uiStore";

export function useMenus() {
  const router = useRouter();
  const { sound, effects, os, toggleSound, toggleEffects, setOs } = useSettings();
  return useMemo(
    () =>
      buildMenus({
        push: (href) => router.push(href),
        back: () => window.history.back(),
        forward: () => window.history.forward(),
        openPalette: () => uiStore.openPalette(),
        openPlayer: () => uiStore.openPlayer(),
        sound, toggleSound, effects, toggleEffects, os, setOs,
        toast: (t, b) => uiStore.toast(t, b, "info"),
        confirmExit: () =>
          uiStore.openDialog({
            title: "Ethan Goldstein Archive",
            message: "Close the archive and go back to the boot screen?",
            detail: "Your place in the timeline is saved in the address bar.",
            icon: "info",
            buttons: [
              { label: "Stay", default: true },
              { label: "Leave", onClick: () => router.push("/") },
            ],
          }),
        copyLink: () => {
          navigator.clipboard?.writeText(window.location.href).then(
            () => uiStore.toast("Link copied", window.location.pathname, "mail"),
            () => uiStore.toast("Could not copy", "Your browser said no.", "info"),
          );
        },
        showKeys: () =>
          uiStore.openDialog({
            title: "Keyboard",
            message: "← → previous / next year · Home / End first / last year",
            detail: "⌘K or / search · Esc closes anything · Space play / pause while the player is open",
            icon: "keyboard",
            buttons: [{ label: "OK", default: true }],
          }),
      }),
    [router, sound, effects, os, toggleSound, toggleEffects, setOs],
  );
}
