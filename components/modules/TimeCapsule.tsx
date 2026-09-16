import { Surface } from "@/components/year/Surface";
import { Icon } from "@/components/ui/Icon";
import type { YearData } from "@/lib/content/schema";
import { cn } from "@/lib/cn";

/** A shelf of objects for the year: Ethan's (personal) first, then the era's. */
export function TimeCapsule({ data, large = false }: { data: YearData; large?: boolean }) {
  const objects = [...data.personal.capsule, ...data.culture.capsule];
  return (
    <Surface id="capsule" title={large ? `Objects of ${data.year}` : "Time Capsule"} icon="gift" aside={`${objects.length} objects`}>
      <ul className={cn("m-0 grid list-none gap-2 p-0", large ? "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6" : "grid-cols-3")}>
        {objects.map((o, i) => (
          <li
            key={o.id ?? `${o.label}-${i}`}
            className={cn(
              "group flex flex-col items-center gap-2 rounded-[var(--radius-sm)] border border-surface-border px-2 py-3 text-center transition-transform hover:-translate-y-0.5",
              o.personal && "border-accent",
            )}
            title={o.note}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full transition-colors" style={{ background: "color-mix(in srgb, var(--accent) 14%, transparent)" }}>
              <Icon name={o.icon} size={large ? 26 : 22} />
            </span>
            <span className="text-[11px] leading-tight">{o.label}</span>
            {o.personal ? <span className="label-mono text-[9px] text-accent">mine</span> : null}
          </li>
        ))}
      </ul>
    </Surface>
  );
}
