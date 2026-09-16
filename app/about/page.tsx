import type { Metadata } from "next";
import Link from "next/link";
import { Surface } from "@/components/year/Surface";
import { Kbd } from "@/components/ui/Kbd";
import { profile } from "@/content/profile";
import { getAllYears } from "@/lib/content/getYear";

export const metadata: Metadata = { title: "About", description: "What this archive is and how it works.", alternates: { canonical: "/about" } };

export default function AboutPage() {
  const years = getAllYears();
  const slots = years.reduce((n, y) => n + y.placeholderCount, 0);
  const culture = years.reduce((n, y) => n + y.culture.internet.length + y.culture.tech.length + y.culture.games.length + y.culture.onScreen.length + y.culture.culture.length + y.culture.music.length, 0);

  return (
    <main data-era="glass" className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-[calc(var(--tabbar-h)+32px)] pt-8 md:px-8 md:pb-16">
      <p className="label-mono m-0 mb-2 text-fg-muted">About this computer</p>
      <h1 className="numeral m-0 text-[clamp(40px,8vw,80px)]">An archive of growing up</h1>
      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="md:col-span-7">
          <Surface title="What this is" icon="info">
            <p className="measure m-0 text-[15px] leading-relaxed">
              A personal time capsule for {profile.name}, born February 10, 2005 in {profile.birthplace.label}. One folder per year from 2005 to 2026:
              memories, photos, music, hobbies, the devices in the house, and the internet as it was. The interface ages with the years,
              from glossy desktop windows to frosted glass.
            </p>
            <p className="measure m-0 mt-3 text-[15px] leading-relaxed text-surface-fg-muted">
              Personal content and cultural context are kept separate on purpose. Cultural notes describe the world that year, not what Ethan did.
              Dashed slots mark personal content that has not been filled in yet.
            </p>
          </Surface>
        </div>
        <div className="md:col-span-5">
          <Surface title="System info" icon="desktop">
            <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 text-[13px]">
              <dt className="label-mono text-surface-fg-muted">Years</dt><dd className="m-0">{years.length}</dd>
              <dt className="label-mono text-surface-fg-muted">Cultural notes</dt><dd className="m-0">{culture}</dd>
              <dt className="label-mono text-surface-fg-muted">Slots to fill</dt><dd className="m-0">{slots}</dd>
              <dt className="label-mono text-surface-fg-muted">Eras</dt><dd className="m-0">5</dd>
              <dt className="label-mono text-surface-fg-muted">Built with</dt><dd className="m-0">Next.js, Motion, Tailwind</dd>
              <dt className="label-mono text-surface-fg-muted">Fonts</dt><dd className="m-0">Geist, Instrument Serif, Silkscreen</dd>
            </dl>
          </Surface>
        </div>
        <div className="md:col-span-6">
          <Surface title="Keyboard" icon="keyboard">
            <ul className="m-0 flex list-none flex-col gap-2 p-0 text-[13px]">
              <li className="flex justify-between"><span>Previous / next year</span><span><Kbd>←</Kbd> <Kbd>→</Kbd></span></li>
              <li className="flex justify-between"><span>First / last year</span><span><Kbd>home</Kbd> <Kbd>end</Kbd></span></li>
              <li className="flex justify-between"><span>Search</span><span><Kbd>⌘K</Kbd> or <Kbd>/</Kbd></span></li>
              <li className="flex justify-between"><span>Close anything</span><span><Kbd>esc</Kbd></span></li>
              <li className="flex justify-between"><span>Play / pause (player open)</span><span><Kbd>space</Kbd></span></li>
            </ul>
          </Surface>
        </div>
        <div className="md:col-span-6">
          <Surface title="Adding your life" icon="floppy">
            <p className="m-0 text-[13px] leading-relaxed">
              Every year has a file at <code className="font-mono text-[12px]">content/personal/&lt;year&gt;.ts</code>. Replace a placeholder with a memory, a photo, a track, or a milestone and it appears in the right place with the right era styling.
              Cultural context lives in <code className="font-mono text-[12px]">content/culture/</code>. Life-stage labels and the birthplace live in <code className="font-mono text-[12px]">content/profile.ts</code>.
            </p>
            <Link href="/year/2005" className="btn-era mt-4">Open 2005</Link>
          </Surface>
        </div>
      </div>
    </main>
  );
}
