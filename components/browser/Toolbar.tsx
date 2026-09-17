"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { useSettings } from "@/lib/settings/SettingsContext";
import { uiStore } from "@/lib/ui/uiStore";
import type { IconName } from "@/lib/content/schema";

function Tool({ icon, label, onClick, pressed, disabled }: { icon: IconName; label: string; onClick: () => void; pressed?: boolean; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} className="os-tool" aria-pressed={pressed} disabled={disabled}>
      <Icon name={icon} size={18} />
      <span>{label}</span>
    </button>
  );
}

const Sep = () => <span aria-hidden="true" className="mx-1 h-8 w-[2px] self-center bevel-thin" />;

/** Back / Forward / Home / Search … plus the sound, effects and OS switches. Desktop only. */
export function Toolbar() {
  const router = useRouter();
  const { sound, effects, os, toggleSound, toggleEffects, toggleOs } = useSettings();
  return (
    <div className="hidden h-10 items-center border-b border-[var(--os-face-dark)] px-1 md:flex" role="toolbar" aria-label="Browser toolbar">
      <Tool icon="arrow-left" label="Back" onClick={() => window.history.back()} />
      <Tool icon="arrow-right" label="Forward" onClick={() => window.history.forward()} />
      <Tool icon="close" label="Stop" onClick={() => uiStore.setStatus("Stopped.", false)} />
      <Tool icon="shuffle" label="Refresh" onClick={() => { uiStore.setStatus("Refreshing…", true, 700); window.dispatchEvent(new Event("archive:refresh")); }} />
      <Tool icon="house" label="Home" onClick={() => router.push("/year/2005")} />
      <Sep />
      <Tool icon="search" label="Search" onClick={() => uiStore.openPalette()} />
      <Tool icon="clock" label="Timeline" onClick={() => router.push("/timeline")} />
      <Tool icon="ball" label="Play" onClick={() => router.push("/backyard")} />
      <Tool icon="music" label="Music" onClick={() => uiStore.togglePlayer()} />
      <span className="os-tool-menu hidden"><Tool icon="folder" label="Menu" onClick={() => uiStore.openMenuSheet()} /></span>
      <span className="ml-auto flex items-center">
        <Tool icon={sound ? "volume" : "mute"} label={sound ? "Sound" : "Muted"} onClick={toggleSound} pressed={sound} />
        <Tool icon="crt" label="Effects" onClick={toggleEffects} pressed={effects} />
        <Tool icon={os === "mac" ? "desktop" : os === "win" ? "window" : "sparkle"} label={os === "auto" ? "Auto UI" : os === "win" ? "Win 98" : "Mac OS"} onClick={toggleOs} />
      </span>
    </div>
  );
}
