"use client";

import { useRouter } from "next/navigation";
import { usePath } from "@/lib/hooks/usePath";
import { Icon } from "@/components/ui/Icon";
import { uiStore } from "@/lib/ui/uiStore";
import type { IconName } from "@/lib/content/schema";

function DesktopIcon({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="desktop-icon">
      <span className="glyph"><Icon name={icon} size={24} /></span>
      <span className="label px-1">{label}</span>
    </button>
  );
}

/** The sky with drifting pixel clouds, and a column of desktop icons beside the window. */
export function Desktop() {
  const router = useRouter();
  const pathname = usePath();
  if (pathname === "/") return null;
  return (
    <>
      <div className="sky fixed inset-0 -z-10" aria-hidden="true">
        <div className="sky-clouds-far" />
        <div className="sky-clouds" />
      </div>
      <nav aria-label="Desktop" className="fixed left-3 top-6 z-0 hidden flex-col gap-1 md:flex">
        <DesktopIcon icon="folder" label="The Archive" onClick={() => router.push("/year/2005")} />
        <DesktopIcon icon="clock" label="Timeline" onClick={() => router.push("/timeline")} />
        <DesktopIcon icon="ball" label="Backyard Baseball" onClick={() => router.push("/backyard")} />
        <DesktopIcon icon="desktop" label="My Computer" onClick={() => router.push("/about")} />
        <DesktopIcon icon="calendar" label="My Life in Data" onClick={() => router.push("/stats")} />
        <DesktopIcon icon="map" label="Memory Map" onClick={() => router.push("/map")} />
        <DesktopIcon
          icon="bin"
          label="Recycle Bin"
          onClick={() =>
            uiStore.openDialog({
              title: "Recycle Bin",
              message: "The Recycle Bin is empty.",
              detail: "Recently deleted: a MySpace Top 8, 47 unfinished Minecraft worlds, one Club Penguin password.",
              icon: "bin",
              buttons: [{ label: "OK", default: true }],
            })
          }
        />
      </nav>
    </>
  );
}
