import type { Metadata } from "next";
import { MemoryMap } from "@/components/map/MemoryMap";
import { EraProvider } from "@/lib/era/EraContext";

export const metadata: Metadata = { title: "Memory Map", description: "The places behind the years.", alternates: { canonical: "/map" } };

export default function MapPage() {
  return (
    <EraProvider era="aero">
      <main data-era="aero" className="mx-auto w-full max-w-[1200px] flex-1 px-4 pb-[calc(var(--tabbar-h)+32px)] pt-8 md:px-8 md:pb-16">
        <p className="label-mono m-0 mb-2 text-fg-muted">Memory map</p>
        <h1 className="numeral m-0 text-[clamp(40px,8vw,80px)]">Where it happened</h1>
        <p className="measure m-0 mb-8 mt-3 text-[14px] text-fg-muted">Only real places are pinned. Everything else is a slot in content/places.ts.</p>
        <MemoryMap />
      </main>
    </EraProvider>
  );
}
