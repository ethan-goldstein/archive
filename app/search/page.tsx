import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPage } from "@/components/search/SearchPage";

export const metadata: Metadata = { title: "Search", description: "Search the archive.", alternates: { canonical: "/search" } };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
