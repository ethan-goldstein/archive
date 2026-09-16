"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { settingsStore, type OsSkin, type Settings } from "./store";
import { playerStore } from "@/lib/player/store";

export function useSettings() {
  const settings = useSyncExternalStore(
    settingsStore.subscribe,
    settingsStore.getSnapshot,
    settingsStore.getServerSnapshot,
  );
  const set = useCallback((patch: Partial<Settings>) => settingsStore.set(patch), []);
  return {
    ...settings,
    setSound: (v: boolean) => set({ sound: v }),
    setEffects: (v: boolean) => set({ effects: v }),
    markEntered: () => set({ entered: true }),
    toggleSound: () => set({ sound: !settings.sound }),
    toggleEffects: () => set({ effects: !settings.effects }),
    setOs: (os: OsSkin) => set({ os }),
    toggleOs: () => set({ os: settings.os === "win" ? "mac" : "win" }),
  };
}

/** Mirrors settings onto <html> (for CSS effects) and mutes the player when sound is off. */
export function SettingsSync() {
  const { sound, effects, os } = useSettings();
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.effects = effects ? "on" : "off";
    el.dataset.sound = sound ? "on" : "off";
    el.dataset.os = os;
    playerStore.setMuted(!sound);
  }, [sound, effects, os]);
  return null;
}
