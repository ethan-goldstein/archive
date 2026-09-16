"use client";

import Link from "next/link";
import { usePath } from "@/lib/hooks/usePath";
import { Icon } from "@/components/ui/Icon";
import { uiStore } from "@/lib/ui/uiStore";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/content/schema";

/** Phone navigation, drawn as the window's bevelled bottom toolbar. Five thumb-sized targets. */
export function BottomTabs() {
  const pathname = usePath();
  if (pathname === "/") return null;

  const tab = (label: string, icon: IconName, active: boolean) => (
    <span className={cn("flex flex-col items-center gap-1 font-pixel text-[8px] uppercase tracking-[0.08em]", active ? "text-[var(--os-highlight)]" : "text-[var(--os-text)]")}>
      <Icon name={icon} size={20} />
      {label}
    </span>
  );
  const cls = "flex justify-center py-2 active:bevel-in";

  return (
    <nav
      aria-label="Archive"
      className="bevel-out fixed inset-x-0 bottom-0 z-40 grid h-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] grid-cols-5 items-start md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link href="/year/2005" className={cls} aria-current={pathname.startsWith("/year") ? "page" : undefined}>{tab("Years", "folder", pathname.startsWith("/year"))}</Link>
      <Link href="/timeline" className={cls} aria-current={pathname === "/timeline" ? "page" : undefined}>{tab("Timeline", "clock", pathname === "/timeline")}</Link>
      <Link href="/backyard" className={cls} aria-current={pathname === "/backyard" ? "page" : undefined}>{tab("Play", "ball", pathname === "/backyard")}</Link>
      <button type="button" onClick={() => uiStore.togglePlayer()} className={cls}>{tab("Music", "music", false)}</button>
      <button type="button" onClick={() => uiStore.openMenuSheet()} className={cls}>{tab("Menu", "window", false)}</button>
    </nav>
  );
}
