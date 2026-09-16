import { Icon } from "@/components/ui/Icon";
import type { IconName, Item, ItemKind } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

const kindIcon: Record<ItemKind, IconName> = {
  hobby: "star", sport: "ball", game: "controller", show: "tv", movie: "film", youtube: "video",
  toy: "toy", site: "globe", app: "phone", device: "tablet", console: "controller", computer: "laptop",
  phone: "phone", trend: "sparkle", meme: "smile", product: "gift", fashion: "star", slang: "chat",
  music: "music", event: "flag", book: "book", food: "pizza", place: "pin", other: "star",
};

export function iconFor(item: Item): IconName {
  return item.icon ?? kindIcon[item.kind];
}

/** A labelled object. With a note it becomes a small two-line card; without, a chip. */
export function ItemChip({ item, className }: { item: Item; className?: string }) {
  const inner = (
    <>
      <Icon name={iconFor(item)} size={14} className="mt-[3px] shrink-0 opacity-70" />
      <span className="min-w-0">
        <span className="block text-[13px] font-medium leading-snug">{item.label}</span>
        {item.note ? <span className="mt-0.5 block text-[12px] leading-snug text-surface-fg-muted">{item.note}</span> : null}
      </span>
    </>
  );
  const cls = cn(
    "flex items-start gap-2 rounded-[var(--radius-sm)] border border-surface-border px-2.5 py-2 transition-colors",
    "hover:border-[color-mix(in_srgb,var(--accent)_60%,transparent)]",
    className,
  );
  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return <div className={cls}>{inner}</div>;
}

export function ItemGrid({ items, className }: { items: Item[]; className?: string }) {
  if (!items.length) return null;
  return (
    <ul className={cn("m-0 grid list-none gap-2 p-0 sm:grid-cols-2", className)}>
      {items.map((it, i) => (
        <li key={it.id ?? `${it.label}-${i}`} className="min-w-0">
          <ItemChip item={it} />
        </li>
      ))}
    </ul>
  );
}

export function GroupLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("label-mono m-0 mb-2 text-surface-fg-muted", className)}>{children}</p>;
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="m-0 text-[13px] italic text-surface-fg-muted">{children}</p>;
}
