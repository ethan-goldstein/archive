"use client";

import type { ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/content/schema";
import { useEra } from "@/lib/era/EraContext";
import { useIsDesktop } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  icon?: IconName;
  id?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Extra element rendered in the chrome/heading row (e.g. a count or an action). */
  aside?: ReactNode;
  as?: "section" | "div" | "article";
}

/**
 * The only place era chrome is implemented. In xp/aero it is a window with a title bar;
 * in flat a card with an accent strip; in dark/glass a sheet with a mono heading.
 * All of that is CSS keyed off the page's data-era — this markup never changes.
 * In the two window eras, on a desktop, the title bar drags the window around (double-click snaps it back).
 */
export function Surface({ title, icon, id, children, className, bodyClassName, aside, as = "section" }: Props) {
  const era = useEra();
  const desktop = useIsDesktop();
  const draggable = desktop && (era === "xp" || era === "aero");
  const controls = useDragControls();
  const Tag = motion[as];

  return (
    <Tag
      id={id}
      className={cn("surface", className, draggable && "select-none")}
      aria-labelledby={id ? `${id}-title` : undefined}
      drag={draggable}
      dragControls={controls}
      dragListener={false}
      dragMomentum={false}
      dragElastic={0}
      whileDrag={{ zIndex: 20, scale: 1.01, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)" }}
      onDoubleClick={(e) => { if (draggable && (e.target as HTMLElement).closest(".surface-chrome")) (e.currentTarget as HTMLElement).style.transform = ""; }}
    >
      <header
        className={cn("surface-chrome", draggable && "cursor-grab active:cursor-grabbing")}
        onPointerDown={(e) => { if (draggable && !(e.target as HTMLElement).closest("button, a")) controls.start(e); }}
        title={draggable ? "Drag to move · double-click to snap back" : undefined}
      >
        {icon ? <Icon name={icon} size={14} /> : null}
        <h2 id={id ? `${id}-title` : undefined} className="surface-title m-0 font-semibold">
          {title}
        </h2>
        {aside ? <div className="ml-auto text-[11px] opacity-80">{aside}</div> : null}
        <div className="dots" aria-hidden="true">
          <i /><i /><i />
        </div>
      </header>
      <div className={cn("surface-body", bodyClassName)}>{children}</div>
    </Tag>
  );
}
