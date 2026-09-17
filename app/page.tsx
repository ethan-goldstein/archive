import Link from "next/link";
import Image from "next/image";
import { HubStrip } from "@/components/hub/HubStrip";
import { YearLink } from "@/components/hub/YearLink";
import { ContinueLink } from "@/components/hub/ContinueLink";
import { Icon } from "@/components/ui/Icon";
import { ERAS } from "@/lib/content/eras";
import { QUALITY } from "@/lib/content/quality";
import { getAllYears } from "@/lib/content/getYear";
import { isPlaceholder } from "@/lib/content/placeholders";
import { profile } from "@/content/profile";
import { asset } from "@/lib/basePath";
import type { IconName, Photo } from "@/lib/content/schema";

const LINKS: { href: string; title: string; body: string; icon: IconName }[] = [
  { href: "/timeline", title: "Timeline", body: "Drag through 22 years on one road.", icon: "clock" },
  { href: "/map", title: "Memory map", body: "Olney, Cold Spring, Wootton, South Carolina.", icon: "globe" },
  { href: "/stats", title: "Life in data", body: "What the archive holds, counted.", icon: "star" },
  { href: "/backyard", title: "Potomac Sandlot", body: "An 8-bit backyard baseball game.", icon: "ball" },
  { href: "/random", title: "Random memory", body: "Open the archive somewhere unexpected.", icon: "shuffle" },
  { href: "/about", title: "About", body: "What this is and how it is built.", icon: "info" },
];

/** The overview: every year at a glance, each card finished at that year's quality. */
export default function Home() {
  const years = getAllYears();
  return (
    <main data-era="glass" className="flex flex-1 flex-col">
      <HubStrip />
      <div className="mx-auto w-full max-w-[1400px] px-4 pb-[calc(var(--player-h)+var(--tabbar-h)+48px)] md:px-8 md:pb-24">
        <header className="grid grid-cols-1 gap-8 py-[clamp(48px,10vh,120px)] md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <p className="label-mono m-0 mb-4 text-fg-muted">Archive · {profile.birthday.year} → 2026</p>
            <h1 className="m-0 font-serif text-[clamp(56px,11vw,168px)] leading-[0.86] tracking-[-0.03em]">{profile.name}</h1>
          </div>
          <div className="md:col-span-4 md:pb-3">
            <p className="m-0 font-serif text-[clamp(20px,2.2vw,28px)] leading-snug">{profile.tagline}</p>
            <p className="m-0 mt-3 text-[15px] leading-relaxed text-fg-muted">
              Born February 10, 2005, at {profile.birthplace.hospital}. Every year is rendered the way that year looked: 240p in 2005, 4K by 2026.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <YearLink year={2005} className="btn-era">Start at 2005</YearLink>
              <ContinueLink />
            </div>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {ERAS.map((era) => {
            const q = QUALITY[era.id];
            const list = years.filter((y) => y.year >= era.from && y.year <= era.to);
            return (
              <section key={era.id} aria-labelledby={`era-${era.id}`}>
                <div className="mb-4 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-border pb-3">
                  <h2 id={`era-${era.id}`} className="m-0 font-serif text-[clamp(24px,3vw,36px)] leading-none">{era.from}–{era.to}</h2>
                  <span className="label-mono text-fg">{q.label}</span>
                  <span className="text-[13px] text-fg-muted">{q.note}</span>
                </div>
                <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-3 lg:grid-cols-6">
                  {list.map((y, i) => {
                    const photo = y.personal.photos.find((p) => !isPlaceholder(p)) as Photo | undefined;
                    const place = isPlaceholder(y.location) ? "" : y.location.split(",")[0];
                    return (
                      <li key={y.year}>
                        <YearLink
                          year={y.year}
                          className={`yc yc-${era.id}`}
                        >
                          <span className="yc-art" aria-hidden="true" style={{ ["--c1" as string]: era.palette.bg, ["--c2" as string]: era.palette.accent, ["--c3" as string]: era.palette.accent2, ["--k" as string]: list.length > 1 ? i / (list.length - 1) : 0 }}>
                            {photo ? <Image src={asset(photo.src)} alt="" fill sizes="(min-width:1024px) 16vw, 45vw" className="object-cover" /> : null}
                          </span>
                          <span className="yc-body">
                            <span className="yc-year">{y.year}</span>
                            <span className="yc-meta">{y.ageLabel === y.lifeStage ? y.ageLabel : `${y.ageLabel} · ${y.lifeStage}`}</span>
                            {place ? <span className="yc-place">{place}</span> : null}
                          </span>
                        </YearLink>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <section aria-label="More of the archive" className="mt-16 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hub-link">
              <Icon name={l.icon} size={18} className="opacity-70" />
              <span className="min-w-0">
                <span className="block text-[15px] font-semibold">{l.title}</span>
                <span className="block text-[13px] text-fg-muted">{l.body}</span>
              </span>
              <Icon name="arrow-right" size={16} className="ml-auto opacity-50" />
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
