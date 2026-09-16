import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { GroupLabel, ItemGrid } from "./ItemChip";
import { isPlaceholder, partition } from "@/lib/content/placeholders";
import type { Item, YearData } from "@/lib/content/schema";

export function OnMyScreen({ data }: { data: YearData }) {
  const { real } = partition<Item>(data.personal.onMyScreen);
  const placeholders = data.personal.onMyScreen.filter(isPlaceholder);
  return (
    <Surface id="screen" title="On My Screen" icon="tv">
      <GroupLabel>Mine</GroupLabel>
      {real.length ? <ItemGrid items={real} className="sm:grid-cols-1" /> : null}
      {placeholders.map((p, i) => <Placeholder key={p.id ?? i} placeholder={p} year={data.year} className="mt-2" />)}
      <GroupLabel className="mt-5">Everyone&apos;s</GroupLabel>
      <ItemGrid items={data.culture.onScreen} className="sm:grid-cols-1" />
    </Surface>
  );
}
