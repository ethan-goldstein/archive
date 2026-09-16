import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Pixelify_Sans, Silkscreen } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/shell/Providers";
import { EffectsLayer } from "@/components/shell/EffectsLayer";
import { BottomTabs } from "@/components/shell/BottomTabs";
import { Toaster } from "@/components/shell/Toaster";
import { Screensaver } from "@/components/shell/Screensaver";
import { Konami } from "@/components/shell/Konami";
import { Desktop } from "@/components/browser/Desktop";
import { BrowserWindow } from "@/components/browser/BrowserWindow";
import { MenuSheet } from "@/components/browser/MenuSheet";
import { RetroDialog } from "@/components/browser/RetroDialog";
import { PlayerBar } from "@/components/player/PlayerBar";
import { PlayerDrawer } from "@/components/player/PlayerDrawer";
import { CommandPalette } from "@/components/search/CommandPalette";
import { Lightbox } from "@/components/gallery/Lightbox";
import { site } from "@/content/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({ variable: "--font-instrument-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
const silkscreen = Silkscreen({ variable: "--font-silkscreen", subsets: ["latin"], weight: "400", display: "swap" });
const pixelify = Pixelify_Sans({ variable: "--font-pixelify-sans", subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: "%s · Ethan Goldstein Archive" },
  description: site.description,
  openGraph: { type: "website", siteName: "Ethan Goldstein — Archive 2005–2026", locale: site.locale, images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "Ethan Goldstein — Archive 2005–2026" }] },
  twitter: { card: "summary_large_image", images: [`${siteUrl}/og.png`] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#3aa0ff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} ${silkscreen.variable} ${pixelify.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-sm)] focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg">
            Skip to content
          </a>
          <Desktop />
          <BrowserWindow>
            <div id="content" className="flex flex-1 flex-col">{children}</div>
          </BrowserWindow>
          <BottomTabs />
          <MenuSheet />
          <PlayerBar />
          <PlayerDrawer />
          <CommandPalette />
          <Lightbox />
          <RetroDialog />
          <Toaster />
          <Screensaver />
          <Konami />
          <EffectsLayer />
        </Providers>
      </body>
    </html>
  );
}
