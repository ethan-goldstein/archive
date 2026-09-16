"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { drawGame } from "../render/draw";
import { VW, VH } from "../render/project";
import { sfx, playTheme } from "../audio/chiptune";
import { calloutFor } from "../render/effects";
import { kids as castKids } from "@/content/game/roster";
import { asset } from "@/lib/basePath";
import { step } from "@/lib/game/sim";
import { battingTeam, fieldingTeam, kidById, currentBatterId, pitcherId } from "@/lib/game/rules";
import type { GameState, Input, PitchKind } from "@/lib/game/types";
import { useKeyboard } from "@/lib/hooks/useKeyboard";
import { usePrefersReducedMotion } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/cn";

interface Props { initial: GameState; onGameOver: (s: GameState) => void; onQuit: () => void }

interface Hud { phase: GameState["phase"]; needsInput: GameState["needsInput"]; result: string; log: string[]; batter: string; pitcher: string; batTeam: string; humanBatting: boolean; humanFielding: boolean; runnerMode: GameState["runnerMode"]; special: string | null }

const PITCHES: { kind: PitchKind; label: string; key: string }[] = [
  { kind: "fastball", label: "Fast", key: "Z" }, { kind: "curve", label: "Curve", key: "X" }, { kind: "changeup", label: "Change", key: "C" }, { kind: "special", label: "Special", key: "V" },
];

/** The field, the HUD, the controls, and the loop. The engine state lives in a ref and ticks at 60 Hz. */
export function PlayScreen({ initial, onGameOver, onQuit }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef<GameState>(initial);
  const inputs = useRef<Input[]>([]);
  const aim = useRef({ x: 0, y: 0 });
  const meter = useRef<{ on: boolean; v: number; dir: number }>({ on: false, v: 0, dir: 1 });
  const pitchKind = useRef<PitchKind>("fastball");
  const [kindState, setKindState] = useState<PitchKind>("fastball");
  const shake = useRef(0);
  const callout = useRef<{ text: string; color: string; t: number } | null>(null);
  const trail = useRef<{ x: number; y: number; z: number }[]>([]);
  const backdrop = useRef<HTMLImageElement | null>(null);
  const spectators = useRef(castKids.filter((k) => !initial.teams.home.kids.some((h) => h.id === k.id) && !initial.teams.away.kids.some((a) => a.id === k.id)).concat(castKids.slice(0, 3)).slice(0, 3));
  const fonts = useRef({ display: "monospace", pixel: "monospace" });
  const [hud, setHud] = useState<Hud>(() => hudOf(initial, "fastball"));
  const [paused, setPaused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const pausedRef = useRef(false);

  const push = useCallback((i: Input) => { inputs.current.push(i); }, []);

  // main loop
  useEffect(() => {
    const el = canvas.current!;
    const ctx = el.getContext("2d")!;
    const probe = wrap.current!;
    fonts.current = {
      display: getComputedStyle(probe.querySelector(".font-pixelify")!).fontFamily,
      pixel: getComputedStyle(probe.querySelector(".font-pixel")!).fontFamily,
    };
    let raf = 0, last = performance.now(), acc = 0, t = 0, lastHud = "";
    const stopTheme = playTheme("game");
    const img = new Image(); img.src = asset("/game/field.png"); img.onload = () => { backdrop.current = img; };
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dtReal = Math.min(0.1, (now - last) / 1000); last = now;
      if (pausedRef.current) return;
      acc += dtReal; t += dtReal;
      if (meter.current.on) { meter.current.v += meter.current.dir * dtReal * 1.7; if (meter.current.v >= 1) { meter.current.v = 1; meter.current.dir = -1; } if (meter.current.v <= 0) { meter.current.v = 0; meter.current.dir = 1; } }
      const dt = 1 / 60;
      while (acc >= dt) {
        const before = state.current;
        const next = step(before, dt, inputs.current);
        inputs.current = [];
        for (const ev of next.events) {
          const co = calloutFor(ev);
          if (co) callout.current = { ...co, t: 0 };
          if (ev.type === "contact") { if (ev.kind === "bunt") sfx.bunt(); else sfx.crack(); }
          else if (ev.type === "homerun") { sfx.homer(); shake.current = 3; }
          else if (ev.type === "caught") sfx.catchBall();
          else if (ev.type === "strike") { if (ev.swinging) sfx.whiff(); else sfx.strike(); }
          else if (ev.type === "ball") sfx.ball();
          else if (ev.type === "out" || ev.type === "strikeout") sfx.out();
          else if (ev.type === "safe") sfx.safe();
          else if (ev.type === "score") sfx.cheer();
          else if (ev.type === "fielded") sfx.catchBall();
        }
        if (next.phase === "windup" && before.phase !== "windup") sfx.pitch();
        if (next.phase === "pitch-select" && before.phase === "result" && next.balls === 0 && next.strikes === 0) sfx.pick(); // walk-up
        if (next.ball.live && !next.ball.onGround) { trail.current.push({ ...next.ball.pos }); if (trail.current.length > 14) trail.current.shift(); } else trail.current = [];
        state.current = next;
        acc -= dt;
      }
      shake.current = Math.max(0, shake.current - dtReal * 6);
      if (callout.current) { callout.current.t += dtReal; if (callout.current.t > 1.2) callout.current = null; }
      const s = state.current;
      const humanPitching = fieldingTeam(s).human;
      drawGame(ctx, s, { fontDisplay: fonts.current.display, fontPixel: fonts.current.pixel, time: t, aim: humanPitching && s.phase === "pitch-select" ? aim.current : null, meter: meter.current.on ? meter.current.v : null, reducedMotion: reduced, shake: shake.current, backdrop: backdrop.current, callout: callout.current, trail: trail.current, spectators: spectators.current });
      const key = `${s.phase}|${s.needsInput}|${s.lastResult}|${s.log.length}|${s.score.home}-${s.score.away}|${s.runnerMode}|${pitchKind.current}`;
      if (key !== lastHud) { lastHud = key; setHud(hudOf(s, pitchKind.current)); }
      if (s.phase === "game-over") { cancelAnimationFrame(raf); stopTheme(); onGameOver(s); }
    };
    raf = requestAnimationFrame(frame);
    const onVis = () => { if (document.hidden) { pausedRef.current = true; setPaused(true); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); stopTheme(); document.removeEventListener("visibilitychange", onVis); };
  }, [onGameOver, reduced]);
  void initial;

  // integer scaling
  useEffect(() => {
    const el = wrap.current!, c = canvas.current!;
    const ro = new ResizeObserver(() => {
      const k = Math.max(1, Math.floor(el.clientWidth / VW));
      c.style.width = `${VW * k}px`; c.style.height = `${VH * k}px`;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const togglePause = () => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); };

  const act = useCallback((name: string) => {
    const s = state.current;
    const humanPitching = fieldingTeam(s).human, humanBatting = battingTeam(s).human;
    switch (name) {
      case "primary":
        if (humanPitching && s.phase === "pitch-select") {
          if (!meter.current.on) { meter.current = { on: true, v: 0, dir: 1 }; }
          else { push({ type: "pitch", kind: pitchKind.current, aimX: aim.current.x, aimY: aim.current.y, meter: meter.current.v }); meter.current.on = false; }
        } else if (humanBatting && (s.phase === "pitch" || s.phase === "windup")) push({ type: "swing" });
        else if (s.phase === "result" || s.phase === "half-end") push({ type: "continue" });
        break;
      case "bunt": if (humanBatting && (s.phase === "pitch" || s.phase === "windup")) push({ type: "swing", bunt: true }); break;
      case "send": push({ type: "runners", mode: "send" }); break;
      case "hold": push({ type: "runners", mode: "hold" }); break;
      case "auto": push({ type: "runners", mode: "auto" }); break;
      case "throw1": case "throw2": case "throw3": case "throw4": push({ type: "throw", base: Number(name.slice(-1)) as 1 | 2 | 3 | 4 }); break;
      case "aimL": aim.current.x = Math.max(-1.4, aim.current.x - 0.25); break;
      case "aimR": aim.current.x = Math.min(1.4, aim.current.x + 0.25); break;
      case "aimU": aim.current.y = Math.min(1.4, aim.current.y + 0.25); break;
      case "aimD": aim.current.y = Math.max(-1.4, aim.current.y - 0.25); break;
      default:
        if (name.startsWith("pitch:")) { pitchKind.current = name.slice(6) as PitchKind; setKindState(pitchKind.current); sfx.select(); }
    }
  }, [push]);

  useKeyboard((e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const s = state.current;
    const humanPitching = fieldingTeam(s).human;
    const map: Record<string, string> = { " ": "primary", Enter: "primary", b: "bunt", B: "bunt", "1": "throw1", "2": "throw2", "3": "throw3", "4": "throw4", z: "pitch:fastball", x: "pitch:curve", c: "pitch:changeup", v: "pitch:special" };
    if (e.key === "Escape") { e.preventDefault(); togglePause(); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); act(humanPitching && s.phase === "pitch-select" ? "aimU" : "send"); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); act(humanPitching && s.phase === "pitch-select" ? "aimD" : "hold"); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); act(humanPitching && s.phase === "pitch-select" ? "aimL" : "throw3"); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); act(humanPitching && s.phase === "pitch-select" ? "aimR" : "throw1"); return; }
    const a = map[e.key];
    if (a) { e.preventDefault(); act(a); }
  }, [act]);

  // tap the field to swing / throw; drag on the zone to aim
  const onPointer = (e: React.PointerEvent) => {
    const s = state.current;
    const r = canvas.current!.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * VW, y = ((e.clientY - r.top) / r.height) * VH;
    if (fieldingTeam(s).human && s.phase === "pitch-select" && x < 70 && y > VH - 66) {
      aim.current = { x: Math.max(-1.4, Math.min(1.4, (x - 34) / 16)), y: Math.max(-1.4, Math.min(1.4, (VH - 34 - y) / 16)) };
      return;
    }
    act("primary");
  };

  const b = hud;
  const pitching = b.humanFielding && b.phase === "pitch-select";
  const batting = b.humanBatting && (b.phase === "pitch" || b.phase === "windup" || b.phase === "pitch-select");
  const throwing = b.needsInput === "throw";
  const inPlay = b.phase === "in-play";
  const waiting = b.phase === "result" || b.phase === "half-end";
  return (
    <div ref={wrap} className="flex flex-col gap-2 p-2 text-[var(--os-text)] md:p-3">
      <span className="font-pixelify hidden" aria-hidden="true">.</span><span className="font-pixel hidden" aria-hidden="true">.</span>
      <div className="relative mx-auto bevel-in bg-black leading-none">
        <canvas
          ref={canvas}
          width={VW}
          height={VH}
          className="pixelated block max-w-full touch-none"
          role="img"
          aria-label={`Baseball field. ${b.result}`}
          tabIndex={0}
          onPointerDown={onPointer}
          onPointerMove={(e) => { if (e.buttons) onPointer(e); }}
        />
        {paused ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70 text-white">
            <p className="pow m-0 text-[28px]">PAUSED</p>
            <div className="flex gap-2">
              <button type="button" onClick={togglePause} className="os-dialog-btn bevel-out text-black">Resume</button>
              <button type="button" onClick={onQuit} className="os-dialog-btn bevel-out text-black">Quit to title</button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-2 md:grid-cols-[1fr_auto]">
        <div className="bevel-in bg-[var(--os-field)] px-3 py-2" aria-live="polite">
          <p className="m-0 font-pixel text-[9px] uppercase tracking-[0.1em] text-[var(--os-text-muted)]">
            {b.phase === "game-over" ? "Final" : b.humanBatting && b.humanFielding ? `${b.batTeam} bat · ${b.batter} vs ${b.pitcher}` : b.humanBatting ? `You bat · ${b.batter}` : `You pitch · ${b.pitcher} on the mound`}
          </p>
          <p className="pow-sm m-0 text-[18px] leading-tight" style={{ ["--pow-shadow" as string]: "rgba(0,0,0,0.2)" }}>{b.result || "Play ball!"}</p>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          {pitching ? (
            <>
              {PITCHES.filter((p) => p.kind !== "special" || b.special).map((p) => (
                <Btn key={p.kind} act={act} a={`pitch:${p.kind}`} pressed={kindState === p.kind}>{p.kind === "special" ? b.special : p.label}<span className="opacity-60">{p.key}</span></Btn>
              ))}
              <Btn act={act} a="primary" className="!bg-[#2ea043] text-white">Pitch<span className="opacity-80">Space</span></Btn>
            </>
          ) : null}
          {batting && !pitching ? (
            <>
              <Btn act={act} a="primary" className="!bg-[#2ea043] text-white">Swing<span className="opacity-80">Space</span></Btn>
              <Btn act={act} a="bunt">Bunt<span className="opacity-60">B</span></Btn>
            </>
          ) : null}
          {throwing ? (
            <>
              <Btn act={act} a="throw1">1st<span className="opacity-60">1 / →</span></Btn>
              <Btn act={act} a="throw2">2nd<span className="opacity-60">2</span></Btn>
              <Btn act={act} a="throw3">3rd<span className="opacity-60">3 / ←</span></Btn>
              <Btn act={act} a="throw4">Home<span className="opacity-60">4</span></Btn>
            </>
          ) : null}
          {inPlay && !throwing ? (
            <>
              <Btn act={act} a="send" pressed={b.runnerMode === "send"}>Send<span className="opacity-60">↑</span></Btn>
              <Btn act={act} a="hold" pressed={b.runnerMode === "hold"}>Hold<span className="opacity-60">↓</span></Btn>
            </>
          ) : null}
          {waiting ? <Btn act={act} a="primary" className="!bg-[#2ea043] text-white">Continue<span className="opacity-80">Space</span></Btn> : null}
          <button type="button" onClick={togglePause} className="os-tool bevel-out !h-11 !min-w-[44px] !text-[9px]" aria-label="Pause"><Icon name="pause" size={14} />Esc</button>
        </div>
      </div>

      <ol className="m-0 flex list-none flex-wrap gap-x-3 gap-y-1 p-0 font-sans text-[11px] text-[var(--os-text-muted)]" aria-label="Play by play">
        {b.log.slice(-4).map((l, i) => <li key={`${i}-${l}`}>{l}</li>)}
      </ol>
    </div>
  );
}

function Btn({ a, act, children, className, pressed }: { a: string; act: (name: string) => void; children: React.ReactNode; className?: string; pressed?: boolean }) {
  return (
    <button type="button" onPointerDown={(e) => { e.preventDefault(); act(a); }} aria-pressed={pressed} className={cn("os-tool bevel-out !h-11 !min-w-[56px] !text-[9px]", className)}>
      {children}
    </button>
  );
}

function hudOf(s: GameState, kind: PitchKind): Hud {
  const bat = kidById(s, currentBatterId(s)), pit = kidById(s, pitcherId(s));
  const special = pit.trait === "rocket-arm" ? "Rocket" : pit.trait === "curveball" ? "Hook" : "Eephus";
  return {
    phase: s.phase, needsInput: s.needsInput, result: s.lastResult, log: s.log,
    batter: bat.nickname ?? bat.name.split(" ")[0], pitcher: pit.nickname ?? pit.name.split(" ")[0], batTeam: battingTeam(s).name,
    humanBatting: battingTeam(s).human, humanFielding: fieldingTeam(s).human, runnerMode: s.runnerMode,
    special: fieldingTeam(s).human ? special : null,
  };
  void kind;
}
