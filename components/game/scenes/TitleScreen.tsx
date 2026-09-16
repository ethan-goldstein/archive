"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { GAME_TITLE } from "@/content/game/roster";
import { loadRecords, type Records } from "../records";
import { sfx } from "../audio/chiptune";
import { asset } from "@/lib/basePath";

import type { Difficulty } from "@/lib/game/types";
export interface StartOptions { innings: number; difficulty: Difficulty; twoPlayer: boolean }
interface Props { onStart: (o: StartOptions) => void }

export function TitleScreen({ onStart }: Props) {
  const [innings, setInnings] = useState(3);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [twoPlayer, setTwoPlayer] = useState(false);
  const [records, setRecords] = useState<Records | null>(null);
  useEffect(() => { const t = setTimeout(() => setRecords(loadRecords()), 0); return () => clearTimeout(t); }, []);

  return (
    <div className="flex flex-col items-center gap-6 px-4 py-8 text-center text-[var(--os-text)]">
      <div className="bevel-in relative w-full max-w-[720px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={asset("/game/cover.png")} alt="Eight neighbourhood kids with bats and gloves on a backyard diamond" width={960} height={540} className="pixelated block h-auto w-full" />
      </div>
      <div className="relative -mt-2">
        <h1 className="pow pow-outline m-0 text-[clamp(40px,9vw,88px)] text-[#ffe66d]" style={{ ["--pow-shadow" as string]: "#1a1a1a", ["--pow-stroke" as string]: "#1a1a1a" }}>
          {GAME_TITLE.toUpperCase()}
        </h1>
        <p className="m-0 mt-1 font-pixel text-[10px] uppercase tracking-[0.2em]">An original backyard baseball game · 2005 edition</p>
      </div>

      <div className="grid w-full max-w-[640px] gap-3 sm:grid-cols-2">
        <div className="bevel-in bg-[var(--os-field)] p-3 text-left">
          <p className="m-0 font-pixel text-[9px] uppercase tracking-[0.1em] text-[var(--os-text-muted)]">Records</p>
          <dl className="m-0 mt-2 grid grid-cols-2 gap-1 font-sans text-[13px]">
            <dt>Games</dt><dd className="m-0 text-right tabular-nums">{records?.games ?? 0}</dd>
            <dt>Wins</dt><dd className="m-0 text-right tabular-nums">{records?.wins ?? 0}</dd>
            <dt>Home runs</dt><dd className="m-0 text-right tabular-nums">{records?.homers ?? 0}</dd>
            <dt>Best score</dt><dd className="m-0 text-right tabular-nums">{records?.bestScore ?? 0}</dd>
          </dl>
          {records?.lastResult ? <p className="m-0 mt-2 font-sans text-[12px] text-[var(--os-text-muted)]">Last game: {records.lastResult}</p> : null}
        </div>
        <div className="bevel-in bg-[var(--os-field)] p-3 text-left">
          <p className="m-0 font-pixel text-[9px] uppercase tracking-[0.1em] text-[var(--os-text-muted)]">How to play</p>
          <ul className="m-0 mt-2 list-none p-0 font-sans text-[12px] leading-relaxed">
            <li><b>Pitch:</b> pick a pitch, aim with arrows, press Space to start the meter and again to throw.</li>
            <li><b>Bat:</b> Space to swing when the ball reaches the zone. B to bunt.</li>
            <li><b>Field:</b> 1 / 2 / 3 / 4 throws to a base. ↑ sends runners, ↓ holds them.</li>
            <li>Everything also works by tapping the buttons under the field.</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.1em]">
          Innings
          <select value={innings} onChange={(e) => setInnings(Number(e.target.value))} className="bevel-in os-menu-font bg-[var(--os-field)] px-2 py-1 text-[12px]">
            <option value={3}>3</option><option value={6}>6</option>
          </select>
        </label>
        <label className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.1em]">
          CPU
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="bevel-in os-menu-font bg-[var(--os-field)] px-2 py-1 text-[12px]">
            <option value="easy">Little league</option><option value="normal">Sandlot</option><option value="hard">All-stars</option>
          </select>
        </label>
        <label className="flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.1em]">
          <input type="checkbox" checked={twoPlayer} onChange={(e) => setTwoPlayer(e.target.checked)} className="h-4 w-4" />
          2 players, one keyboard
        </label>
        <button type="button" onClick={() => { sfx.pick(); onStart({ innings, difficulty, twoPlayer }); }} className="btn-era !bg-[#2ea043] !text-white text-[16px]">
          <Icon name="ball" size={16} />
          Play ball
        </button>
      </div>
      <p className="m-0 max-w-[60ch] font-sans text-[11px] text-[var(--os-text-muted)]">
        Original characters and code. A tribute to the backyard sports games of the early 2000s, not a copy of them. Add yourself and your friends in content/game/roster.ts.
      </p>
    </div>
  );
}
