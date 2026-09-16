"use client";

import { useEffect, useRef, useState } from "react";
import { MenuList } from "./Menu";
import { useMenus } from "./useMenus";

/** The File / Edit / View / Favorites / Go / Help bar. Desktop only; phones get MenuSheet. */
export function MenuBar() {
  const menus = useMenus();
  const [open, setOpen] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open === null) return;
    const onDown = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const onKey = (e: React.KeyboardEvent) => {
    if (open === null) return;
    if (e.key === "ArrowRight") { e.preventDefault(); setOpen((open + 1) % menus.length); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setOpen((open - 1 + menus.length) % menus.length); }
  };

  return (
    <div ref={root} role="menubar" aria-label="Browser menu" className="os-menubar hidden items-stretch gap-0 border-b border-[var(--os-face-dark)] px-1 md:flex" onKeyDown={onKey}>
      {menus.map((m, i) => (
        <div key={m.id} className="relative">
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
            onMouseEnter={() => { if (open !== null && open !== i) setOpen(i); }}
            className="h-6"
          >
            <span className="underline decoration-1 underline-offset-2">{m.label[0]}</span>{m.label.slice(1)}
          </button>
          {open === i ? <MenuList menu={m} onClose={() => { setOpen(null); }} /> : null}
        </div>
      ))}
    </div>
  );
}
