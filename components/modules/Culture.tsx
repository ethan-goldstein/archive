import { Surface } from "@/components/year/Surface";
import { GroupLabel, ItemGrid } from "./ItemChip";
import type { YearData } from "@/lib/content/schema";

export function Culture({ data }: { data: YearData }) {
  return (
    <Surface id="culture" title="Culture" icon="sparkle" aside="trends · memes · products">
      <ItemGrid items={data.culture.culture} className="sm:grid-cols-2 lg:grid-cols-3" />
      <GroupLabel className="mt-5">How things looked</GroupLabel>
      <p className="measure m-0 text-[14px] leading-relaxed text-surface-fg-muted">{data.culture.design}</p>
    </Surface>
  );
}
