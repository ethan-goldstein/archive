import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { YearStage } from "@/components/year/YearStage";
import { YEARS, parseYearParam } from "@/lib/content/eras";
import { getYear } from "@/lib/content/getYear";
import { isPlaceholder } from "@/lib/content/placeholders";

export const dynamicParams = false;

export function generateStaticParams() {
  return YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: PageProps<"/year/[year]">): Promise<Metadata> {
  const { year: p } = await params;
  const year = parseYearParam(p);
  if (!year) return {};
  const data = getYear(year);
  const intro = isPlaceholder(data.intro) ? data.culture.headline : data.intro;
  return {
    title: `${year} · ${data.ageLabel}`,
    description: `${year} in Ethan Goldstein's archive. ${intro} ${data.culture.blurb}`,
    alternates: { canonical: `/year/${year}` },
    openGraph: { title: `${year} — Ethan Goldstein Archive`, description: data.culture.headline },
  };
}

export default async function YearPage({ params }: PageProps<"/year/[year]">) {
  const { year: p } = await params;
  const year = parseYearParam(p);
  if (!year) notFound();
  return <YearStage key={year} initialYear={year} />;
}
