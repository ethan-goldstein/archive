"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { usePath } from "@/lib/hooks/usePath";
import { TitleBar } from "./TitleBar";
import { MenuBar } from "./MenuBar";
import { Toolbar } from "./Toolbar";
import { AddressBar } from "./AddressBar";
import { StatusBar } from "./StatusBar";
import { useUi } from "@/lib/ui/useUi";
import { uiStore } from "@/lib/ui/uiStore";
import { cn } from "@/lib/cn";
import { useFrameId } from "@/lib/hooks/useFrameId";

const OPENING_KEY = "archive:opening";
export const ZOOM_KEY = "archive:zoom";
export function markOpening() {
  try { sessionStorage.setItem(OPENING_KEY, "1"); sessionStorage.setItem(ZOOM_KEY, "1"); } catch { /* ignore */ }
}

/**
 * The retro browser window that frames every page except the intro.
 * Title bar, menu bar, toolbar and address bar stick to the top; the status bar to the bottom.
 */
export function BrowserWindow({ children }: { children: ReactNode }) {
  const pathname = usePath();
  const router = useRouter();
  const { maximized } = useUi();
  const { frame, skin } = useFrameId();
  const [opening] = useState(() => {
    try { return typeof window !== "undefined" && sessionStorage.getItem(OPENING_KEY) === "1"; } catch { return false; }
  });
  const [minimizing, setMinimizing] = useState(false);

  useEffect(() => {
    if (opening) { try { sessionStorage.removeItem(OPENING_KEY); } catch { /* ignore */ } }
  }, [opening]);

  // The frame and skin live on <html> too, so chrome heights and the desktop can follow them.
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.frame = frame;
    el.dataset.os = skin;
  }, [frame, skin]);

  if (pathname === "/") return <>{children}</>;

  const minimize = () => {
    setMinimizing(true);
    window.setTimeout(() => {
      setMinimizing(false);
      uiStore.toast("Restored", "The archive does not minimize. It has been waiting since 2005.", "window");
    }, 420);
  };
  const close = () =>
    uiStore.openDialog({
      title: "Ethan Goldstein Archive",
      message: "Close the archive and go back to the boot screen?",
      icon: "info",
      buttons: [{ label: "Stay", default: true }, { label: "Leave", onClick: () => router.push("/") }],
    });

  return (
    <div className={cn("relative z-10 flex min-h-dvh flex-col", !maximized && "md:pb-8 md:pl-[112px] md:pr-6 md:pt-5 lg:pr-10")}>
      <div data-frame={frame} data-os={skin} className={cn("os-window flex min-h-dvh flex-1 flex-col md:min-h-[calc(100dvh-52px)]", opening && "window-open", minimizing && "window-minimize", maximized && "rounded-none")}>
        <div className="os-chrome sticky top-0 z-40 bg-[var(--os-face)]">
          <TitleBar onMinimize={minimize} onClose={close} />
          <MenuBar />
          <Toolbar />
          <AddressBar />
        </div>
        <div className="page-canvas relative flex flex-1 flex-col">{children}</div>
        <StatusBar />
      </div>
    </div>
  );
}
