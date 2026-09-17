import type { Metadata } from "next";
import Link from "next/link";
import { Surface } from "@/components/year/Surface";
import { computeStats } from "@/lib/content/stats";
import { EraProvider } from "@/lib/era/EraContext";

export const metadata: Metadata = { title: "My Life in Data", description: "The archive, counted.", alternates: { canonical: "/stats" } };

export default function StatsPage() {
  const s = computeStats();
  const maxBar = Math.max(1, ...s.perYear.map((r) => r.culture + r.personal));
  const big = [
    { n: s.years, label: "years" },
    { n: s.memories, label: "memories" },
    { n: s.photos, label: "photos" },
    { n: s.tracks, label: "songs" },
    { n: s.milestones, label: "milestones" },
    { n: s.culturalNotes, label: "cultural notes" },
  ];
  return (
    <EraProvider era="dark">
      <main data-era="dark" className="mx-auto w-full max-w-[1100px] flex-1 px-4 pb-[calc(var(--tabbar-h)+32px)] pt-8 md:px-8 md:pb-16">
        <p className="label-mono m-0 mb-2 text-fg-muted">My life in data</p>
        <h1 className="numeral m-0 text-[clamp(40px,8vw,80px)]">The archive, counted</h1>
        <p className="measure m-0 mt-3 text-[14px] text-fg-muted">Every number here comes from the content files. Placeholders count as empty slots, never as memories.</p>

        <ul className="m-0 mt-8 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
          {big.map((b) => (
            <li key={b.label} className="surface p-4 text-center">
              <p className="numeral m-0 text-[clamp(32px,5vw,56px)]">{b.n}</p>
              <p className="label-mono m-0 mt-1 text-surface-fg-muted">{b.label}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-12">
          <div className="md:col-span-7">
            <Surface title="Documentation over time" icon="calendar" aside="personal + cultural per year">
              <ol className="m-0 flex list-none items-end gap-[3px] p-0" style={{ height: 160 }} aria-label="Items per year">
                {s.perYear.map((r) => (
                  <li key={r.year} className="group relative flex min-w-0 flex-1 flex-col justify-end" style={{ height: "100%" }}>
                    <Link href={`/year/${r.year}`} className="flex h-full flex-col justify-end" aria-label={`${r.year}: ${r.personal} personal, ${r.culture} cultural, ${r.slots} slots`}>
                      <span className="block w-full bg-accent" style={{ height: `${(r.personal / maxBar) * 100}%` }} />
                      <span className="block w-full bg-surface-fg-muted/40" style={{ height: `${(r.culture / maxBar) * 100}%` }} />
                    </Link>
                    <span className="label-mono absolute -bottom-5 left-0 hidden text-[8px] text-surface-fg-muted [&:nth-child(n)]:block sm:block" style={{ display: r.year % 3 === 2 ? undefined : "none" }}>{String(r.year).slice(2)}</span>
                  </li>
                ))}
              </ol>
              <p className="label-mono m-0 mt-8 text-surface-fg-muted"><span className="mr-2 inline-block h-2 w-2 bg-accent" />personal <span className="ml-3 mr-2 inline-block h-2 w-2 bg-surface-fg-muted/40" />cultural context</p>
            </Surface>
          </div>
          <div className="md:col-span-5">
            <Surface title="Highlights" icon="star">
              <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-[13px]">
                <dt className="label-mono text-surface-fg-muted">Most documented year</dt>
                <dd className="m-0">{s.mostDocumented ? <Link href={`/year/${s.mostDocumented.year}`} className="underline">{s.mostDocumented.year}</Link> : "None yet, every year is still placeholders"}</dd>
                <dt className="label-mono text-surface-fg-muted">Years with something filed</dt>
                <dd className="m-0">{s.filledYears} of {s.years}</dd>
                <dt className="label-mono text-surface-fg-muted">Slots still to fill</dt>
                <dd className="m-0">{s.slotsLeft}</dd>
                <dt className="label-mono text-surface-fg-muted">Most-used tags</dt>
                <dd className="m-0">{s.topTags.length ? s.topTags.map((t) => `#${t.tag} (${t.count})`).join("  ") : "No tags yet"}</dd>
              </dl>
            </Surface>
          </div>
          <div className="md:col-span-12">
            <Surface title="By era" icon="sparkle">
              <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-5">
                {s.byEra.map((e) => (
                  <li key={e.id} className="rounded-[var(--radius-sm)] border border-surface-border p-3">
                    <p className="m-0 text-[15px] font-semibold">{e.name}</p>
                    <p className="label-mono m-0 text-surface-fg-muted">{e.from}–{e.to}</p>
                    <p className="m-0 mt-2 text-[13px]">{e.personal} personal · {e.culture} cultural · {e.slots} slots</p>
                  </li>
                ))}
              </ul>
            </Surface>
          </div>
        </div>
      </main>
    </EraProvider>
  );
}
