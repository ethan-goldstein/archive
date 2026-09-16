import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { GroupLabel, ItemGrid } from "./ItemChip";
import { isPlaceholder, partition } from "@/lib/content/placeholders";
import type { Item, YearData } from "@/lib/content/schema";

export function Tech({ data }: { data: YearData }) {
  const { real } = partition<Item>(data.personal.tech);
  const placeholders = data.personal.tech.filter(isPlaceholder);
  return (
    <Surface id="tech" title="Tech I Remember" icon="floppy">
      <GroupLabel>In the house</GroupLabel>
      {real.length ? <ItemGrid items={real} className="sm:grid-cols-1" /> : null}
      {placeholders.map((p, i) => <Placeholder key={p.id ?? i} placeholder={p} year={data.year} className="mt-2" />)}
      <GroupLabel className="mt-5">Out in the world</GroupLabel>
      <ItemGrid items={data.culture.tech} className="sm:grid-cols-1" />
    </Surface>
  );
}
