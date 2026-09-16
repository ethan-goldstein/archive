"use client";

import { useEffect, useState } from "react";
import { KidCard } from "../KidCard";
import { Icon } from "@/components/ui/Icon";
import { allKids, TEAM_NAMES } from "@/content/game/roster";
import { createDraft, cpuPick, pick, type DraftState } from "@/lib/game/draft";
import type { Kid } from "@/lib/game/types";
import { sfx } from "../audio/chiptune";

export interface DraftResult { human: Kid[]; cpu: Kid[]; teamName: string; cpuName: string; color: string; cpuColor: string; seed: number }
interface Props { seed: number; twoPlayer?: boolean; onDone: (r: DraftResult) => void }

const COLORS = ["#d64545", "#3b6fd6", "#2ea043", "#e0a800", "#8e44ad", "#e67e22"];

export function DraftScreen({ seed, twoPlayer = false, onDone }: Props) {
  const [draft, setDraft] = useState<DraftState>(() => createDraft(allKids(), seed, 7, true));
  const [teamName, setTeamName] = useState(TEAM_NAMES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const cpuName = TEAM_NAMES.find((n) => n !== teamName) ?? TEAM_NAMES[1];
  const cpuColor = COLORS.find((c) => c !== color) ?? COLORS[1];

  // the CPU takes a beat to pick
  useEffect(() => {
    if (twoPlayer || draft.done || draft.turn !== "cpu") return;
    const t = setTimeout(() => { setDraft((d) => cpuPick(d)); sfx.select(); }, 650);
    return () => clearTimeout(t);
  }, [draft, twoPlayer]);

  const humanTurn = (twoPlayer || draft.turn === "human") && !draft.done;
  const whose = draft.turn === "human" ? "Player 1" : twoPlayer ? "Player 2" : "CPU";

  return (
    <div className="flex flex-col gap-4 p-3 text-[var(--os-text)] md:p-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="pow m-0 text-[28px] text-[#ffe66d]" style={{ ["--pow-shadow" as string]: "#1a1a1a" }}>PICK YOUR TEAM</h2>
          <p className="m-0 font-pixel text-[9px] uppercase tracking-[0.1em] text-[var(--os-text-muted)]">
            {draft.done ? "Both teams are set." : humanTurn ? `${whose} picks · ${draft.picks[draft.turn].length + 1} of ${draft.size}` : "CPU is thinking…"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 font-pixel text-[9px] uppercase">
            Team
            <select value={teamName} onChange={(e) => setTeamName(e.target.value)} className="bevel-in os-menu-font bg-[var(--os-field)] px-2 py-1 text-[12px]">
              {TEAM_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <div className="flex gap-1" role="radiogroup" aria-label="Team colour">
            {COLORS.map((c) => (
              <button key={c} type="button" role="radio" aria-checked={color === c} aria-label={`Colour ${c}`} onClick={() => setColor(c)} className="h-6 w-6 bevel-out" style={{ background: c, outline: color === c ? "2px solid #000" : "none" }} />
            ))}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <div>
          <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {draft.pool.map((k) => (
              <li key={k.id}><KidCard kid={k} color={color} onPick={humanTurn ? () => { setDraft((d) => pick(d, k.id)); sfx.pick(); } : undefined} disabled={!humanTurn} /></li>
            ))}
          </ul>
        </div>
        <aside className="flex flex-col gap-3">
          <Roster title={teamName} color={color} kids={draft.picks.human} who={twoPlayer ? "p1" : "you"} />
          <Roster title={cpuName} color={cpuColor} kids={draft.picks.cpu} who={twoPlayer ? "p2" : "cpu"} />
          {draft.done ? (
            <button type="button" onClick={() => onDone({ human: draft.picks.human, cpu: draft.picks.cpu, teamName, cpuName, color, cpuColor, seed: draft.seed })} className="btn-era !bg-[#2ea043] !text-white">
              <Icon name="ball" size={14} /> Take the field
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Roster({ title, color, kids, who }: { title: string; color: string; kids: Kid[]; who: "you" | "cpu" | "p1" | "p2" }) {
  const label = who === "you" ? "You" : who === "cpu" ? "CPU" : who === "p1" ? "Player 1" : "Player 2";
  return (
    <section className="bevel-in bg-[var(--os-field)] p-2">
      <p className="m-0 flex items-center gap-2 font-pixel text-[9px] uppercase tracking-[0.1em]">
        <span className="inline-block h-3 w-3" style={{ background: color }} />{title} <span className="ml-auto text-[var(--os-text-muted)]">{label} · {kids.length}/7</span>
      </p>
      <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
        {kids.map((k) => <li key={k.id}><KidCard kid={k} color={color} compact /></li>)}
        {kids.length === 0 ? <li className="font-sans text-[12px] italic text-[var(--os-text-muted)]">Nobody yet.</li> : null}
      </ul>
    </section>
  );
}
