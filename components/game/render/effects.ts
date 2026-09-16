import type { PlayEvent } from "@/lib/game/types";

/** Big on-screen callouts derived from play events. */
export function calloutFor(ev: PlayEvent): { text: string; color: string } | null {
  switch (ev.type) {
    case "strike": return { text: "STRIKE!", color: "#ffcc00" };
    case "strikeout": return { text: "STRIKE THREE!", color: "#ff6b6b" };
    case "foul": return { text: "FOUL", color: "#ffffff" };
    case "walk": return { text: "WALK", color: "#9ecbff" };
    case "homerun": return { text: "HOME RUN!", color: "#ffe66d" };
    case "caught": return { text: "CAUGHT!", color: "#ff6b6b" };
    case "out": return { text: "OUT!", color: "#ff6b6b" };
    case "safe": return { text: "SAFE!", color: "#6cff8a" };
    case "score": return { text: "RUN SCORES!", color: "#6cff8a" };
    case "error": return { text: "ERROR!", color: "#ffa64d" };
    case "contact":
      if (ev.kind === "bunt") return { text: "BUNT!", color: "#ffffff" };
      if (ev.quality > 0.8) return { text: "CRACK!", color: "#ffe66d" };
      return { text: ev.kind === "grounder" ? "GROUND BALL" : ev.kind === "liner" ? "LINE DRIVE!" : ev.kind === "fly" ? "FLY BALL" : "POP UP", color: "#ffffff" };
    case "side": return { text: "SWITCH SIDES", color: "#ffffff" };
    default: return null;
  }
}
