"use client";

import { useSyncExternalStore } from "react";
import { frameStore, buttonsFor, type FrameId } from "@/lib/browser/frame";
import { useSettings } from "@/lib/settings/SettingsContext";

/** The effective frame after the user's OS override: auto follows the year, win/mac pin the classic look. */
export function useFrameId(): { frame: FrameId; skin: "win" | "mac"; buttons: "left" | "right"; auto: boolean } {
  const { os } = useSettings();
  const stored = useSyncExternalStore(frameStore.subscribe, frameStore.get, frameStore.getServer);
  const frame: FrameId = os === "auto" ? stored : "xp";
  const skin = os === "mac" ? "mac" : "win";
  return { frame, skin, buttons: buttonsFor(frame, skin), auto: os === "auto" };
}
