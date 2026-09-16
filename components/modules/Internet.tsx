import { Surface } from "@/components/year/Surface";
import { ItemGrid } from "./ItemChip";
import type { YearData } from "@/lib/content/schema";

export function Internet({ data }: { data: YearData }) {
  return (
    <Surface id="internet" title="The Internet That Year" icon="globe" aside="cultural context">
      <ItemGrid items={data.culture.internet} className="sm:grid-cols-1" />
    </Surface>
  );
}
