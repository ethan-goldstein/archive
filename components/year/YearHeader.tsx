import { Placeholder } from "@/components/modules/Placeholder";
import { isPlaceholder } from "@/lib/content/placeholders";
import { eraForYear } from "@/lib/content/eras";
import type { YearData } from "@/lib/content/schema";
import { turnsLabel } from "@/lib/content/age";

export function YearHeader({ data }: { data: YearData }) {
  const era = eraForYear(data.year);
  return (
    <header className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-end">
      <div className="md:col-span-7">
        <p className="label-mono m-0 mb-2 text-fg-muted">
          {era.name} · {era.tagline}
        </p>
        <h1 className="numeral m-0 text-[clamp(96px,22vw,220px)]" aria-label={`${data.year}`}>
          {data.year}
        </h1>
      </div>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-4 md:col-span-5 md:grid-cols-1 md:gap-3 md:pb-4">
        <div>
          <dt className="label-mono text-fg-muted">Age</dt>
          <dd className="m-0 text-[15px] font-medium">
            {data.ageLabel}
            <span className="ml-2 text-[12px] text-fg-muted">{turnsLabel(data.year)}</span>
          </dd>
        </div>
        <div className="col-span-2 min-w-0 md:col-span-1">
          <dt className="label-mono text-fg-muted">Location</dt>
          <dd className="m-0 text-[15px] font-medium">
            {isPlaceholder(data.location) ? (
              <Placeholder placeholder={data.location} year={data.year} variant="compact" />
            ) : (
              data.location
            )}
          </dd>
        </div>
        <div>
          <dt className="label-mono text-fg-muted">Era</dt>
          <dd className="m-0 text-[15px] font-medium">
            {data.lifeStage}{" "}
            {data.lifeStageIsPlaceholder ? (
              <span className="placeholder-badge ml-2 align-middle" title="Assumed from age. Edit content/profile.ts">assumed</span>
            ) : null}
          </dd>
        </div>
      </dl>
      <div className="md:col-span-7">
        <p className="label-mono m-0 mb-2 text-fg-muted">In my words</p>
        {isPlaceholder(data.intro) ? (
          <Placeholder placeholder={data.intro} year={data.year} className="text-fg" />
        ) : (
          <p className="measure m-0 font-serif text-[clamp(20px,2.4vw,28px)] leading-snug">{data.intro}</p>
        )}
      </div>
      <div className="md:col-span-5">
        <p className="label-mono m-0 mb-2 text-fg-muted">The world that year</p>
        <p className="m-0 text-[17px] font-medium leading-snug">{data.culture.headline}</p>
        <p className="m-0 mt-2 text-[14px] leading-relaxed text-fg-muted">{data.culture.blurb}</p>
      </div>
    </header>
  );
}
