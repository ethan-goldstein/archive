import { geoAlbersUsa, geoNaturalEarth1, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import usTopo from "us-atlas/states-10m.json";
import worldTopo from "world-atlas/countries-110m.json";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { places, placePlaceholders, type PlaceKind } from "@/content/places";
import type { IconName } from "@/lib/content/schema";
import { profile } from "@/content/profile";

const W = 960, H = 560;
const kindIcon: Record<PlaceKind, IconName> = { home: "house", school: "backpack", trip: "plane", family: "heart", other: "pin" };

function inUS(lat: number, lng: number) {
  return lat > 24 && lat < 50 && lng > -125 && lng < -66;
}

/** Server-rendered SVG map: the US (Albers) when every place is in it, otherwise the world. Pins come from content/places.ts. */
export function MemoryMap() {
  const useUS = places.every((p) => inUS(p.lat, p.lng));
  const topo = (useUS ? usTopo : worldTopo) as unknown as Topology;
  const key = useUS ? "states" : "countries";
  const fc = feature(topo, topo.objects[key] as GeometryCollection);
  const borders = mesh(topo, topo.objects[key] as GeometryCollection, (a, b) => a !== b);
  const projection = useUS ? geoAlbersUsa() : geoNaturalEarth1();
  projection.fitExtent([[16, 16], [W - 16, H - 16]], fc);
  const path = geoPath(projection);
  const pins = places.map((p) => ({ ...p, xy: projection([p.lng, p.lat]) })).filter((p) => p.xy) as (typeof places[number] & { xy: [number, number] })[];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
      <div className="surface md:col-span-8">
        <div className="surface-chrome">
          <Icon name="map" size={14} />
          <h2 className="surface-title m-0 font-semibold">{useUS ? "United States" : "The world"}</h2>
          <div className="ml-auto text-[11px] opacity-80">{pins.length} pin{pins.length === 1 ? "" : "s"}</div>
          <div className="dots" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <div className="surface-body !p-2">
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Map with ${pins.length} places: ${pins.map((p) => p.label).join(", ")}`} className="block h-auto w-full" style={{ shapeRendering: "crispEdges" }}>
            <path d={path(fc) ?? ""} fill="color-mix(in srgb, var(--surface-fg) 10%, transparent)" stroke="none" />
            <path d={path(borders) ?? ""} fill="none" stroke="color-mix(in srgb, var(--surface-fg) 28%, transparent)" strokeWidth={1} />
            {pins.map((p) => (
              <g key={p.id} transform={`translate(${p.xy[0]}, ${p.xy[1]})`}>
                <circle r={18} fill="var(--accent)" opacity={0.18} />
                <path d="M0 -14 L8 -6 L0 6 L-8 -6 Z" fill="var(--accent)" stroke="var(--surface-fg)" strokeWidth={2} />
                <rect x={-2} y={4} width={4} height={6} fill="var(--surface-fg)" />
                <text x={p.xy[0] > W * 0.7 ? -14 : 14} y={-4} textAnchor={p.xy[0] > W * 0.7 ? "end" : "start"} fontFamily="var(--font-pixelify)" fontWeight={700} fontSize={22} fill="var(--surface-fg)" stroke="var(--surface)" strokeWidth={4} paintOrder="stroke">{p.short}</text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      <div className="md:col-span-4">
        <div className="surface">
          <div className="surface-chrome">
            <Icon name="pin" size={14} />
            <h2 className="surface-title m-0 font-semibold">Places</h2>
            <div className="dots" aria-hidden="true"><i /><i /><i /></div>
          </div>
          <ul className="surface-body m-0 flex list-none flex-col gap-3 p-0 !pt-4">
            {pins.map((p) => (
              <li key={p.id} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg"><Icon name={kindIcon[p.kind]} size={14} /></span>
                <div className="min-w-0">
                  <p className="m-0 text-[14px] font-semibold">{p.label}</p>
                  <p className="label-mono m-0 text-surface-fg-muted">
                    <Link href={`/year/${p.from}`} className="underline">{p.from}</Link>{p.to ? <>–<Link href={`/year/${p.to}`} className="underline">{p.to}</Link></> : "–now"} · {p.kind}
                  </p>
                  {p.note ? <p className="m-0 mt-1 text-[13px] text-surface-fg-muted">{p.note}</p> : null}
                </div>
              </li>
            ))}
            {profile.showPlaceholders ? placePlaceholders.map((ph, i) => (
              <li key={i} className="placeholder-slot flex gap-3 p-3">
                <Icon name={kindIcon[ph.kind]} size={16} className="mt-0.5 shrink-0 opacity-60" />
                <div className="min-w-0">
                  <p className="m-0 text-[13px] leading-snug opacity-85">{ph.hint}</p>
                  <p className="label-mono m-0 mt-1"><span className="placeholder-badge">edit</span> <span className="normal-case tracking-normal opacity-70">content/places.ts</span></p>
                </div>
              </li>
            )) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
