"use client";

import { useCallback, useState } from "react";
import { TitleScreen } from "./scenes/TitleScreen";
import { DraftScreen, type DraftResult } from "./scenes/DraftScreen";
import type { StartOptions } from "./scenes/TitleScreen";
import { PlayScreen } from "./scenes/PlayScreen";
import { BoxScore } from "./scenes/BoxScore";
import { Icon } from "@/components/ui/Icon";
import { buildTeam } from "@/lib/game/draft";
import { createGame } from "@/lib/game/sim";
import type { GameState } from "@/lib/game/types";
import { GAME_TITLE } from "@/content/game/roster";
import { unlockAudio } from "@/lib/audio/chime";

type Scene = { kind: "title" } | { kind: "draft"; opts: StartOptions; seed: number } | { kind: "play"; state: GameState } | { kind: "box"; state: GameState };

/** backyard.exe — scene router inside a retro window. */
export function BackyardGame() {
  const [scene, setScene] = useState<Scene>({ kind: "title" });

  const start = (opts: StartOptions) => { unlockAudio(); setScene({ kind: "draft", opts, seed: (Date.now() % 100000) + 7 }); };
  const drafted = (opts: StartOptions) => (r: DraftResult) => {
    const home = buildTeam("home", r.teamName, r.color, "#fff", r.human, true);
    const away = buildTeam("away", r.cpuName, r.cpuColor, "#fff", r.cpu, opts.twoPlayer);
    setScene({ kind: "play", state: createGame(home, away, { innings: opts.innings, mercy: 10, seed: r.seed, difficulty: opts.difficulty }) });
  };
  const over = useCallback((s: GameState) => setScene({ kind: "box", state: s }), []);

  return (
    <div className="os-window bevel-out mx-auto w-full max-w-[1100px]" style={{ borderRadius: 0 }}>
      <div className="os-title flex h-7 items-center gap-2 px-2">
        <Icon name="ball" size={14} />
        <span className="os-title-text flex-1 truncate">backyard.exe — {GAME_TITLE}</span>
        <span className="font-pixel text-[8px] opacity-80">{scene.kind.toUpperCase()}</span>
      </div>
      {scene.kind === "title" ? <TitleScreen onStart={start} /> : null}
      {scene.kind === "draft" ? <DraftScreen seed={scene.seed} twoPlayer={scene.opts.twoPlayer} onDone={drafted(scene.opts)} /> : null}
      {scene.kind === "play" ? <PlayScreen initial={scene.state} onGameOver={over} onQuit={() => setScene({ kind: "title" })} /> : null}
      {scene.kind === "box" ? <BoxScore state={scene.state} onAgain={() => setScene({ kind: "title" })} /> : null}
    </div>
  );
}
