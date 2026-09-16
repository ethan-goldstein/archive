import type { Metadata } from "next";
import { RandomMemory } from "@/components/search/RandomMemory";

export const metadata: Metadata = { title: "Random memory", robots: { index: false } };

export default function RandomPage() {
  return <RandomMemory />;
}
