"use client";

import Link from "next/link";
import { usePath } from "@/lib/hooks/usePath";
import { Icon } from "@/components/ui/Icon";
import { uiStore } from "@/lib/ui/uiStore";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/content/schema";

/** Phone navigation: five thumb-sized targets on a solid bar. */
export function BottomTabs() {
  const pathname = usePath();
  const tab = (label: string, icon: IconName, active: boolean) => (
    <span className={cn("flex flex-col items-center gap-1 text-[10px] font-medium tracking-wide", active ? "text-accent" : "text-fg-muted")}>
      <Icon name={icon} size={20} />
      {label}
    </span>
  );
  const cls = "flex justify-center py-2.5";
  const years = pathname === "/" || pathname.startsWith("/year");
  return (
    <nav
      aria-label="Archive"
      className="site-nav site-nav-bottom fixed inset-x-0 bottom-0 z-40 grid h-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] grid-cols-5 items-start md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Link href="/" className={cls} aria-current={years ? "page" : undefined}>{tab("Years", "folder", years)}</Link>
      <Link href="/timeline" className={cls} aria-current={pathname === "/timeline" ? "page" : undefined}>{tab("Timeline", "clock", pathname === "/timeline")}</Link>
      <Link href="/map" className={cls} aria-current={pathname === "/map" ? "page" : undefined}>{tab("Map", "globe", pathname === "/map")}</Link>
      <Link href="/backyard" className={cls} aria-current={pathname === "/backyard" ? "page" : undefined}>{tab("Play", "controller", pathname === "/backyard")}</Link>
      <button type="button" onClick={() => uiStore.togglePlayer()} className={cls}>{tab("Music", "music", false)}</button>
    </nav>
  );
}
