export const dynamic = "force-static";
import type { MetadataRoute } from "next";
import { YEARS } from "@/lib/content/eras";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/timeline`, lastModified: now, priority: 0.8 },
    { url: `${base}/search`, lastModified: now, priority: 0.4 },
    { url: `${base}/about`, lastModified: now, priority: 0.5 },
    { url: `${base}/stats`, lastModified: now, priority: 0.5 },
    { url: `${base}/map`, lastModified: now, priority: 0.5 },
    { url: `${base}/backyard`, lastModified: now, priority: 0.7 },
    ...YEARS.map((y) => ({ url: `${base}/year/${y}`, lastModified: now, priority: 0.9 })),
  ];
}
