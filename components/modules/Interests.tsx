import { Surface } from "@/components/year/Surface";
import { Placeholder } from "./Placeholder";
import { ItemGrid, EmptyState } from "./ItemChip";
import { isPlaceholder, partition } from "@/lib/content/placeholders";
import type { Item, YearData } from "@/lib/content/schema";

export function Interests({ data }: { data: YearData }) {
  const { real } = partition<Item>(data.personal.interests);
  const placeholders = data.personal.interests.filter(isPlaceholder);
  return (
    <Surface id="interests" title="My Interests" icon="star" aside="this was everything">
      {real.length ? <ItemGrid items={real} className="sm:grid-cols-1" /> : null}
      {placeholders.length ? (
        <div className="mt-3 flex flex-col gap-2">
          {placeholders.map((p, i) => <Placeholder key={p.id ?? i} placeholder={p} year={data.year} />)}
        </div>
      ) : null}
      {!real.length && !placeholders.length ? <EmptyState>No interests filed yet.</EmptyState> : null}
    </Surface>
  );
}
