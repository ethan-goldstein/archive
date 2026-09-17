"use client";

import Link from "next/link";
import { usePath } from "@/lib/hooks/usePath";
import { Icon } from "@/components/ui/Icon";
import { useSettings } from "@/lib/settings/SettingsContext";
import { uiStore } from "@/lib/ui/uiStore";
import { profile } from "@/content/profile";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Years", match: (p: string) => p === "/" || p.startsWith("/year") },
  { href: "/timeline", label: "Timeline", match: (p: string) => p === "/timeline" },
  { href: "/map", label: "Map", match: (p: string) => p === "/map" },
  { href: "/stats", label: "Stats", match: (p: string) => p === "/stats" },
  { href: "/backyard", label: "Play", match: (p: string) => p === "/backyard" },
  { href: "/about", label: "About", match: (p: string) => p === "/about" },
];

/**
 * The only chrome on the site. A solid, era-tinted bar (never a backdrop blur: it sits over a live
 * WebGL canvas). Its colours, radii and motion come from the same tokens as everything else, so it
 * sharpens with the year like the rest of the page.
 */
export function TopNav() {
  const pathname = usePath();
  const { sound, effects, toggleSound, toggleEffects } = useSettings();
  return (
    <header className="site-nav sticky top-0 z-40 h-[var(--nav-h)]">
      <div className="mx-auto flex h-full max-w-[1400px] items-center gap-4 px-4 md:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="wordmark">{profile.name}</span>
          <span className="label-mono hidden text-fg-muted sm:inline">2005—2026</span>
        </Link>
        <nav aria-label="Archive" className="ml-4 hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = l.match(pathname);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined} className={cn("nav-link", active && "nav-link-active")}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button type="button" onClick={() => uiStore.openPalette()} className="nav-tool">
            <Icon name="search" size={16} />
            <span className="sr-only lg:not-sr-only">Search</span>
            <kbd className="kbd hidden lg:inline" aria-hidden="true">⌘K</kbd>
          </button>
          <button type="button" onClick={toggleSound} className="nav-tool" aria-pressed={sound} aria-label={sound ? "Mute sound" : "Turn sound on"}>
            <Icon name={sound ? "volume" : "mute"} size={16} />
          </button>
          <button type="button" onClick={toggleEffects} className="nav-tool" aria-pressed={effects} aria-label={effects ? "Turn the 3D scene off" : "Turn the 3D scene on"} title="3D scene and texture">
            <Icon name="sparkle" size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
