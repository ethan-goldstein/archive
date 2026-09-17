"use client";

import { useRouter } from "next/navigation";
import { YearStrip } from "@/components/year/YearStrip";

/** The same 22-year strip as on a year page, with nothing selected; picking a year opens it. */
export function HubStrip() {
  const router = useRouter();
  return (
    <div className="hidden md:block">
    <YearStrip
      year={0}
      onSelect={(y) => { try { sessionStorage.setItem("archive:zoom", "1"); } catch { /* private mode */ } router.push(`/year/${y}`); }}
    />
    </div>
  );
}
