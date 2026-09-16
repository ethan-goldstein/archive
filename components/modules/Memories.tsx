import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { EmptyState } from "./ItemChip";
import { isPlaceholder, partition } from "@/lib/content/placeholders";
import type { Memory, YearData } from "@/lib/content/schema";
import { profile } from "@/content/profile";

export function Memories({ data, fragment = false }: { data: YearData; fragment?: boolean }) {
  const { real, placeholders } = partition<Memory>(data.personal.memories);
  const show = data.personal.memories;
  const nothing = real.length === 0 && (!profile.showPlaceholders || placeholders.length === 0);

  return (
    <Surface
      id="memories"
      title={fragment ? "Fragments" : "Memories"}
      icon="folder"
      aside={real.length ? `${real.length} filed` : "from my hard drive"}
    >
      {nothing ? (
        <EmptyState>Nothing filed here yet. Open content/personal/{data.year}.ts to add a memory.</EmptyState>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {show.map((m, i) =>
            isPlaceholder(m) ? (
              <li key={m.id ?? i}>
                <Placeholder placeholder={m} year={data.year} />
              </li>
            ) : (
              <li key={m.id} id={m.id} className="scroll-mt-32">
                <article className="rounded-[var(--radius-sm)] border border-surface-border p-4">
                  <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h3 className="m-0 text-[15px] font-semibold leading-snug">{m.title}</h3>
                    {m.date ? <span className="label-mono text-surface-fg-muted">{m.date}</span> : null}
                  </header>
                  <p className="measure m-0 mt-2 text-[14px] leading-relaxed">{m.body}</p>
                  {m.tags.length ? (
                    <p className="label-mono m-0 mt-3 text-surface-fg-muted">{m.tags.map((t) => `#${t}`).join("  ")}</p>
                  ) : null}
                </article>
              </li>
            ),
          )}
        </ul>
      )}
    </Surface>
  );
}
