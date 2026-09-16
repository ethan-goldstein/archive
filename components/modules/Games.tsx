import { Surface } from "@/components/year/Surface";
import { ItemGrid } from "./ItemChip";
import type { YearData } from "@/lib/content/schema";

export function Games({ data }: { data: YearData }) {
  return (
    <Surface id="games" title="Things People Couldn't Stop Playing" icon="controller" aside="cultural context">
      <ItemGrid items={data.culture.games} className="sm:grid-cols-1" />
    </Surface>
  );
}
