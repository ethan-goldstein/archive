"use client";

import { useGlobalEra } from "@/lib/era/EraContext";
import { useSettings } from "@/lib/settings/SettingsContext";

/**
 * At most one cheap static texture, and only in the years whose rendering quality calls for it:
 * coarse grain in 2005–08, fine grain in 2017–20. No blend modes (they flatten the whole page for
 * the compositor), no animation, and nothing in the DOM at all when effects are off.
 */
export function EffectsLayer() {
  const era = useGlobalEra();
  const { effects } = useSettings();
  if (!effects || (era !== "xp" && era !== "dark")) return null;
  return <div aria-hidden="true" className="fx-layer fx-grain" />;
}
