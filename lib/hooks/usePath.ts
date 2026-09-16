"use client";
import { usePathname } from "next/navigation";
import { normalizePath } from "@/lib/basePath";

/** usePathname without a trailing slash, so route comparisons work on static exports too. */
export function usePath(): string {
  return normalizePath(usePathname() ?? "/");
}
