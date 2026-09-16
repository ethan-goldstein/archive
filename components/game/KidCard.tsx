"use client";

import { useEffect, useRef } from "react";
import { drawKidPreview } from "./render/draw";
import { traitInfo } from "@/content/game/text";
import type { Kid } from "@/lib/game/types";
import { cn } from "@/lib/cn";
import { asset } from "@/lib/basePath";

const statNames = [["batting", "BAT"], ["power", "POW"], ["speed", "SPD"], ["pitching", "PIT"], ["fielding", "FLD"]] as const;

interface Props { kid: Kid; color: string; onPick?: () => void; disabled?: boolean; compact?: boolean; picked?: "you" | "cpu" }

/** A draft card: portrait, name, bio, five stat bars, trait. */
export function KidCard({ kid, color, onPick, disabled, compact, picked }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current?.getContext("2d");
    if (c) drawKidPreview(c, kid, color);
  }, [kid, color]);

  const body = (
    <>
      <div className="flex items-start gap-3">
        <div className="bevel-in shrink-0 overflow-hidden bg-[#8fd3ff]" style={{ width: compact ? 40 : 64, height: compact ? 40 : 64 }}>
          {kid.card ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(kid.card)} alt="" width={compact ? 40 : 64} height={compact ? 40 : 64} className="pixelated h-full w-full object-cover" />
          ) : (
            <canvas ref={canvas} width={compact ? 40 : 64} height={compact ? 40 : 64} className="pixelated h-full w-full" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="pow-sm m-0 truncate text-[16px] leading-tight text-[var(--os-text)]" style={{ ["--pow-shadow" as string]: "rgba(0,0,0,0.25)" }}>
            {kid.nickname ? `"${kid.nickname}"` : kid.name.split(" ")[0]}
          </p>
          <p className="m-0 truncate font-pixel text-[9px] uppercase tracking-[0.06em] text-[var(--os-text-muted)]">
            {kid.name} · age {kid.age}{kid.personal ? " · you" : ""}
          </p>
          {!compact ? <p className="m-0 mt-1 line-clamp-2 font-sans text-[12px] leading-snug">{kid.bio}</p> : null}
        </div>
      </div>
      {compact ? (
        <p className="m-0 mt-1 font-pixel text-[8px] tracking-[0.04em] text-[var(--os-text-muted)]">
          {statNames.map(([key, label]) => `${label} ${kid[key]}`).join(" · ")}
        </p>
      ) : (
        <ul className="m-0 mt-2 grid list-none grid-cols-1 gap-y-1 p-0 sm:grid-cols-2 sm:gap-x-4">
          {statNames.map(([key, label]) => (
            <li key={key} className="flex items-center gap-2" aria-label={`${label} ${kid[key]} of 10`}>
              <span className="w-7 shrink-0 font-pixel text-[8px] text-[var(--os-text-muted)]">{label}</span>
              <span className="bevel-in flex h-3 min-w-0 flex-1 gap-[1px] p-[2px]">
                {Array.from({ length: 10 }, (_, i) => (
                  <i key={i} className="min-w-0 flex-1" style={{ background: i < kid[key] ? (kid[key] >= 8 ? "#2ea043" : kid[key] >= 5 ? "#e0a800" : "#c94a1c") : "transparent" }} />
                ))}
              </span>
              <span className="w-4 shrink-0 text-right font-pixel text-[8px] tabular-nums">{kid[key]}</span>
            </li>
          ))}
        </ul>
      )}
      {!compact ? (
        <p className="m-0 mt-2 font-pixel text-[9px] uppercase tracking-[0.06em]">
          <span className="rounded-none bg-[var(--os-highlight)] px-1.5 py-0.5 text-[var(--os-highlight-fg)]">{traitInfo[kid.trait].label}</span>
          <span className="ml-2 normal-case tracking-normal text-[var(--os-text-muted)] font-sans text-[11px]">{traitInfo[kid.trait].blurb}</span>
        </p>
      ) : null}
      {picked ? <span className="pointer-events-none absolute right-2 top-2 bg-[var(--os-highlight)] px-1.5 py-0.5 font-pixel text-[8px] uppercase text-[var(--os-highlight-fg)]">{picked === "you" ? "Your team" : "CPU"}</span> : null}
    </>
  );

  const cls = cn("bevel-out relative w-full p-3 text-left text-[var(--os-text)]", disabled && "opacity-50", onPick && !disabled && "cursor-pointer hover:brightness-105 active:bevel-in");
  return onPick ? (
    <button type="button" onClick={onPick} disabled={disabled} className={cls} aria-label={`Draft ${kid.name}`}>
      {body}
    </button>
  ) : (
    <div className={cls}>{body}</div>
  );
}
