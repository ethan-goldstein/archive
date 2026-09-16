import type { Metadata } from "next";
import { BackyardGame } from "@/components/game/BackyardGame";
import { EraProvider } from "@/lib/era/EraContext";
import { GAME_TITLE } from "@/content/game/roster";

export const metadata: Metadata = {
  title: GAME_TITLE,
  description: "An original 8-bit backyard baseball game. Draft a team of neighbourhood kids and play three innings against the CPU.",
  alternates: { canonical: "/backyard" },
};

export default function BackyardPage() {
  return (
    <EraProvider era="xp">
      <main data-era="xp" className="flex flex-1 flex-col px-2 pb-[calc(var(--tabbar-h)+24px)] pt-4 md:px-6 md:pb-10">
        <BackyardGame />
      </main>
    </EraProvider>
  );
}
