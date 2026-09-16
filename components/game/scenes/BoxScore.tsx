"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";
import { loadRecords, saveRecords } from "../records";
import type { GameState } from "@/lib/game/types";
import { winner } from "@/lib/game/rules";
import { asset } from "@/lib/basePath";

interface Props { state: GameState; onAgain: () => void }

export function BoxScore({ state: s, onAgain }: Props) {
  const w = winner(s);
  const human = s.teams.home.human ? "home" : "away";
  const youWon = w === human;

  useEffect(() => {
    const t = setTimeout(() => {
      const r = loadRecords();
      const yourScore = s.score[human];
      const yourKids = s.teams[human].kids.map((k) => k.id);
      const homers = yourKids.reduce((n, id) => n + (s.stats[id]?.hr ?? 0), 0);
      saveRecords({ games: r.games + 1, wins: r.wins + (youWon ? 1 : 0), homers: r.homers + homers, bestScore: Math.max(r.bestScore, yourScore), lastResult: `${s.teams.away.name} ${s.score.away}, ${s.teams.home.name} ${s.score.home}` });
    }, 0);
    return () => clearTimeout(t);
  }, [s, human, youWon]);

  const line = (id: string) => s.stats[id] ?? { ab: 0, h: 0, hr: 0, rbi: 0, r: 0, k: 0 };
  const everyone = [...s.teams.home.kids, ...s.teams.away.kids];
  const potg = everyone.map((k) => ({ k, v: line(k.id).h + line(k.id).hr * 2 + line(k.id).rbi })).sort((a, b) => b.v - a.v)[0];
  const table = (team: GameState["teams"]["home"]) => (
    <table className="w-full border-collapse font-sans text-[12px]">
      <thead><tr className="font-pixel text-[8px] uppercase text-[var(--os-text-muted)]"><th className="text-left">{team.name}</th><th>AB</th><th>H</th><th>HR</th><th>RBI</th><th>R</th><th>K</th></tr></thead>
      <tbody>
        {team.lineup.map((id) => { const k = team.kids.find((x) => x.id === id)!; const l = line(id); return (
          <tr key={id} className="border-t border-[var(--os-face-dark)]"><td className="py-0.5">{k.nickname ?? k.name.split(" ")[0]}</td><td className="text-center tabular-nums">{l.ab}</td><td className="text-center tabular-nums">{l.h}</td><td className="text-center tabular-nums">{l.hr}</td><td className="text-center tabular-nums">{l.rbi}</td><td className="text-center tabular-nums">{l.r}</td><td className="text-center tabular-nums">{l.k}</td></tr>
        ); })}
      </tbody>
    </table>
  );

  return (
    <div className="relative flex flex-col items-center gap-5 p-4 text-[var(--os-text)]">
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{ backgroundImage: `url(${asset("/game/field.png")})`, backgroundSize: "cover", backgroundPosition: "center", imageRendering: "pixelated" }} aria-hidden="true" />
      <h2 className="pow m-0 text-center text-[clamp(32px,7vw,64px)] text-[#ffe66d]" style={{ ["--pow-shadow" as string]: "#1a1a1a" }}>
        {w === "tie" ? "TIE GAME" : youWon ? "YOU WIN!" : "THEY GOT US"}
      </h2>
      <p className="pow-sm m-0 text-[22px]">{s.teams.away.name} {s.score.away} — {s.teams.home.name} {s.score.home}</p>
      {potg && potg.v > 0 ? (
        <p className="m-0 bevel-in bg-[var(--os-field)] px-3 py-1 font-pixel text-[9px] uppercase tracking-[0.1em]">
          Player of the game: {potg.k.nickname ?? potg.k.name} · {line(potg.k.id).h} H · {line(potg.k.id).hr} HR · {line(potg.k.id).rbi} RBI
        </p>
      ) : null}
      <div className="grid w-full max-w-[760px] gap-3 md:grid-cols-2">
        <div className="bevel-in bg-[var(--os-field)] p-3">{table(s.teams.away)}</div>
        <div className="bevel-in bg-[var(--os-field)] p-3">{table(s.teams.home)}</div>
      </div>
      <button type="button" onClick={onAgain} className="btn-era !bg-[#2ea043] !text-white"><Icon name="shuffle" size={14} /> Play again</button>
    </div>
  );
}
