import type { Metadata } from "next";
import { Scrubber } from "@/components/timeline/Scrubber";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Scrub through 2005 to 2026 and watch the archive's design language grow up.",
  alternates: { canonical: "/timeline" },
};

export default function TimelinePage() {
  return <Scrubber />;
}
