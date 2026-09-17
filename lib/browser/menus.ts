import { ERAS } from "@/lib/content/eras";

export type MenuItem =
  | { type: "item"; label: string; shortcut?: string; onSelect: () => void; disabled?: boolean }
  | { type: "check"; label: string; checked: boolean; onSelect: () => void }
  | { type: "radio"; label: string; checked: boolean; onSelect: () => void }
  | { type: "sep" };

export interface MenuDef { id: string; label: string; items: MenuItem[] }

export interface MenuContext {
  push: (href: string) => void;
  back: () => void;
  forward: () => void;
  openPalette: () => void;
  openPlayer: () => void;
  sound: boolean; toggleSound: () => void;
  effects: boolean; toggleEffects: () => void;
  os: "auto" | "win" | "mac"; setOs: (os: "auto" | "win" | "mac") => void;
  toast: (title: string, body?: string) => void;
  confirmExit: () => void;
  copyLink: () => void;
  showKeys: () => void;
}

/** The menu bar model. Pure data so the desktop menu bar and the phone sheet render the same items. */
export function buildMenus(c: MenuContext): MenuDef[] {
  return [
    {
      id: "file", label: "File",
      items: [
        { type: "item", label: "Open year…", shortcut: "⌘K", onSelect: c.openPalette },
        { type: "item", label: "Random memory", onSelect: () => c.push("/random") },
        { type: "item", label: "Play Backyard Baseball", onSelect: () => c.push("/backyard") },
        { type: "sep" },
        { type: "item", label: "Print…", onSelect: () => c.toast("Printer not found", "Try again in 2005.") },
        { type: "sep" },
        { type: "item", label: "Exit", onSelect: c.confirmExit },
      ],
    },
    {
      id: "edit", label: "Edit",
      items: [
        { type: "item", label: "Find…", shortcut: "⌘K", onSelect: c.openPalette },
        { type: "item", label: "Copy link to this page", onSelect: c.copyLink },
      ],
    },
    {
      id: "view", label: "View",
      items: [
        { type: "check", label: "Sound", checked: c.sound, onSelect: c.toggleSound },
        { type: "check", label: "Retro effects", checked: c.effects, onSelect: c.toggleEffects },
        { type: "sep" },
        { type: "radio", label: "Grows up with the year", checked: c.os === "auto", onSelect: () => c.setOs("auto") },
        { type: "radio", label: "Windows 98", checked: c.os === "win", onSelect: () => c.setOs("win") },
        { type: "radio", label: "Mac OS 9", checked: c.os === "mac", onSelect: () => c.setOs("mac") },
      ],
    },
    {
      id: "favorites", label: "Favorites",
      items: [
        ...ERAS.map((e) => ({ type: "item" as const, label: `${e.name}  ${e.from}–${e.to}`, onSelect: () => c.push(`/year/${e.from}`) })),
        { type: "sep" },
        { type: "item", label: "Add to Favorites…", onSelect: () => c.toast("Added to Favorites", "It was already there.") },
      ],
    },
    {
      id: "go", label: "Go",
      items: [
        { type: "item", label: "Back", shortcut: "←", onSelect: c.back },
        { type: "item", label: "Forward", shortcut: "→", onSelect: c.forward },
        { type: "item", label: "Home page", onSelect: () => c.push("/year/2005") },
        { type: "sep" },
        { type: "item", label: "Timeline", onSelect: () => c.push("/timeline") },
        { type: "item", label: "My Life in Data", onSelect: () => c.push("/stats") },
        { type: "item", label: "Memory Map", onSelect: () => c.push("/map") },
        { type: "item", label: "Music player", onSelect: c.openPlayer },
        { type: "item", label: "Backyard Baseball", onSelect: () => c.push("/backyard") },
      ],
    },
    {
      id: "help", label: "Help",
      items: [
        { type: "item", label: "About This Computer", onSelect: () => c.push("/about") },
        { type: "item", label: "My Life in Data", onSelect: () => c.push("/stats") },
        { type: "item", label: "Keyboard shortcuts", onSelect: c.showKeys },
        { type: "sep" },
        { type: "item", label: "Start over (intro)", onSelect: () => c.push("/") },
      ],
    },
  ];
}
