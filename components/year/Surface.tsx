import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

interface Props {
  title: string;
  icon?: IconName;
  id?: string;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  /** Extra element in the heading row (a count, an action). */
  aside?: ReactNode;
  as?: "section" | "div" | "article";
}

/**
 * A titled panel. The markup is identical in every year; its finish (corners, borders, shadow,
 * motion) comes from the era tokens, so a 2005 panel is blunt and hard-edged and a 2026 panel is
 * soft and layered. This is the only place that finish is applied.
 */
export function Surface({ title, icon, id, children, className, bodyClassName, aside, as: Tag = "section" }: Props) {
  return (
    <Tag id={id} className={cn("surface", className)} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className="surface-chrome">
        {icon ? <Icon name={icon} size={15} className="opacity-70" /> : null}
        <h2 id={id ? `${id}-title` : undefined} className="surface-title m-0">{title}</h2>
        {aside ? <div className="label-mono ml-auto text-[10px] text-surface-fg-muted">{aside}</div> : null}
      </header>
      <div className={cn("surface-body", bodyClassName)}>{children}</div>
    </Tag>
  );
}
