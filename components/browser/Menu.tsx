"use client";

import { useEffect, useRef } from "react";
import type { MenuDef, MenuItem } from "@/lib/browser/menus";
import { cn } from "@/lib/cn";

interface Props { menu: MenuDef; onClose: () => void; onSelect?: () => void }

/** A dropdown menu list. Arrow keys move, Enter/Space select, Esc closes. */
export function MenuList({ menu, onClose, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = ref.current?.querySelector<HTMLElement>("[role^='menuitem']");
    first?.focus();
  }, []);

  const items = () => Array.from(ref.current?.querySelectorAll<HTMLElement>("[role^='menuitem']:not([aria-disabled='true'])") ?? []);
  const onKey = (e: React.KeyboardEvent) => {
    const list = items();
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length]?.focus(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
    else if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "Home") { e.preventDefault(); list[0]?.focus(); }
    else if (e.key === "End") { e.preventDefault(); list[list.length - 1]?.focus(); }
  };

  const pick = (item: Exclude<MenuItem, { type: "sep" }>) => {
    if ("disabled" in item && item.disabled) return;
    item.onSelect();
    onSelect?.();
    onClose();
  };

  return (
    <div ref={ref} role="menu" aria-label={menu.label} className="os-menu bevel-out" onKeyDown={onKey}>
      {menu.items.map((item, i) =>
        item.type === "sep" ? (
          <hr key={i} />
        ) : (
          <button
            key={i}
            type="button"
            role={item.type === "check" ? "menuitemcheckbox" : item.type === "radio" ? "menuitemradio" : "menuitem"}
            aria-checked={item.type === "check" || item.type === "radio" ? item.checked : undefined}
            aria-disabled={"disabled" in item && item.disabled ? true : undefined}
            tabIndex={-1}
            onClick={() => pick(item)}
            className={cn("disabled" in item && item.disabled && "opacity-50")}
          >
            <span className="inline-block w-3 text-center" aria-hidden="true">
              {item.type === "check" && item.checked ? "✓" : item.type === "radio" && item.checked ? "•" : ""}
            </span>
            <span>{item.label}</span>
            {"shortcut" in item && item.shortcut ? <span className="shortcut">{item.shortcut}</span> : null}
          </button>
        ),
      )}
    </div>
  );
}
