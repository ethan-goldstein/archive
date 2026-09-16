import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "./ItemChip";
import { isPlaceholder } from "@/lib/content/placeholders";
import type { IconName, Milestone, YearData } from "@/lib/content/schema";
import { profile } from "@/content/profile";

const kindIcon: Record<Milestone["kind"], IconName> = {
  school: "backpack", move: "house", achievement: "trophy", travel: "plane", life: "cake", other: "flag",
};

export function Milestones({ data }: { data: YearData }) {
  const items = data.personal.milestones;
  const real = items.filter((m) => !isPlaceholder(m)) as Milestone[];
  const nothing = !real.length && (!profile.showPlaceholders || items.every((m) => !isPlaceholder(m)));
  return (
    <Surface id="milestones" title="Milestones" icon="flag" aside={real.length ? `${real.length}` : undefined}>
      {nothing ? (
        <EmptyState>No milestones filed. Only real ones go here.</EmptyState>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((m, i) =>
            isPlaceholder(m) ? (
              <li key={m.id ?? i}><Placeholder placeholder={m} year={data.year} /></li>
            ) : (
              <li key={m.id} id={m.id} className="flex gap-3 scroll-mt-32">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg">
                  <Icon name={kindIcon[m.kind]} size={14} />
                </span>
                <div className="min-w-0">
                  <p className="m-0 text-[14px] font-semibold leading-snug">{m.title}</p>
                  {m.date ? <p className="label-mono m-0 mt-0.5 text-surface-fg-muted">{m.date}</p> : null}
                  {m.body ? <p className="m-0 mt-1 text-[13px] leading-relaxed">{m.body}</p> : null}
                </div>
              </li>
            ),
          )}
        </ol>
      )}
    </Surface>
  );
}
