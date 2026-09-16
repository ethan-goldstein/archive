import type { NextConfig } from "next";

const isExport = process.env.STATIC_EXPORT === "1";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Vercel: leave both unset. GitHub Pages: STATIC_EXPORT=1 NEXT_PUBLIC_BASE_PATH=/archive
  ...(isExport ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
  // Static hosts serve directories, so export with trailing slashes (year/2012/index.html)
  trailingSlash: isExport,
  images: { unoptimized: isExport },
  reactStrictMode: true,
};

export default nextConfig;
