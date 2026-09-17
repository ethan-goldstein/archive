"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/** A link into a year. Marks the entry so the 3D camera glides in from far out instead of cutting. */
export function YearLink({ year, className, children, label }: { year: number; className?: string; children: ReactNode; label?: string }) {
  return (
    <Link
      href={`/year/${year}`}
      className={className}
      aria-label={label}
      onClick={() => { try { sessionStorage.setItem("archive:zoom", "1"); } catch { /* private mode */ } }}
    >
      {children}
    </Link>
  );
}
