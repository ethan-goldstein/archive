import type { Kid } from "@/lib/game/types";

export const PALETTE = {
  skin: ["#ffd7b5", "#e8b48a", "#c68642", "#7a4a26"],
  grass: "#4caf50", grassDark: "#3d9142", dirt: "#c9955c", dirtDark: "#a8763f", line: "#fff5d6",
  sky: "#8fd3ff", skyDeep: "#3aa0ff", fence: "#8b5a2b", fenceLight: "#b07a3f",
  ball: "#ffffff", ballShadow: "rgba(0,0,0,0.35)", bat: "#c18a4b", glove: "#7a4a26",
  ink: "#1a1a1a", paper: "#fff8e1", hud: "#0a246a",
};

type Ctx = CanvasRenderingContext2D;
const px = (c: Ctx, x: number, y: number, w: number, h: number, color: string) => { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), w, h); };

export type Pose = "idle" | "run" | "bat-ready" | "bat-swing" | "pitch-wind" | "pitch-throw" | "field" | "catch";

/**
 * Draws a kid at (x, y) where y is the feet line. All integer rectangles, so it stays crisp.
 * Height by size: small 14, medium 16, big 19 pixels.
 */
export function drawKid(c: Ctx, kid: Kid, x: number, y: number, color: string, pose: Pose, frame: number, facing: 1 | -1 = 1) {
  const h = kid.look.size === "small" ? 14 : kid.look.size === "big" ? 19 : 16;
  const w = kid.look.size === "big" ? 8 : 6;
  const skin = PALETTE.skin[kid.look.skin];
  const legH = Math.round(h * 0.3);
  const bodyH = Math.round(h * 0.4);
  const headH = h - legH - bodyH;
  const top = y - h;
  const bob = pose === "run" ? (frame % 2 === 0 ? 0 : -1) : 0;
  const bx = Math.round(x - w / 2);

  // legs
  if (pose === "run") {
    px(c, bx + 1, y - legH + bob, 2, legH, "#2b3a67");
    px(c, bx + w - 3, y - legH - (frame % 2 ? 2 : 0), 2, legH, "#2b3a67");
  } else {
    px(c, bx + 1, y - legH, 2, legH, "#2b3a67");
    px(c, bx + w - 3, y - legH, 2, legH, "#2b3a67");
  }
  // shoes
  px(c, bx, y - 1, 3, 1, PALETTE.ink); px(c, bx + w - 3, y - 1, 3, 1, PALETTE.ink);
  // body
  px(c, bx, top + headH + bob, w, bodyH, color);
  px(c, bx + 1, top + headH + 1 + bob, w - 2, 1, "rgba(255,255,255,0.35)");
  // arms
  const armY = top + headH + 1 + bob;
  if (pose === "bat-ready") { px(c, bx + (facing > 0 ? w : -2), armY, 2, 3, skin); }
  else if (pose === "bat-swing") { px(c, bx + (facing > 0 ? w + 1 : -4), armY + 2, 3, 2, skin); }
  else if (pose === "pitch-wind") { px(c, bx + w, armY - 4, 2, 5, skin); }
  else if (pose === "pitch-throw") { px(c, bx + w, armY + 1, 4, 2, skin); }
  else if (pose === "catch") { px(c, bx - 2, armY - 3, 2, 4, skin); px(c, bx - 4, armY - 5, 4, 4, PALETTE.glove); }
  else { px(c, bx - 1, armY, 1, 3, skin); px(c, bx + w, armY, 1, 3, skin); }
  // glove for fielders
  if (pose === "field" || pose === "idle") px(c, bx - 3, armY + 1, 3, 3, PALETTE.glove);
  // head
  px(c, bx + 1, top + 1 + bob, w - 2, headH - 1, skin);
  // hair
  const hc = kid.look.hairColor;
  switch (kid.look.hair) {
    case 0: px(c, bx + 1, top + bob, w - 2, 2, hc); break;                       // short
    case 1: px(c, bx + 1, top + bob, w - 2, 1, hc); break;                       // buzz
    case 2: px(c, bx, top + bob, w, 2, hc); px(c, bx, top + 2 + bob, 1, headH - 2, hc); break; // bob/long side
    case 3: px(c, bx, top - 1 + bob, w, 3, hc); break;                           // big/curly
    case 4: px(c, bx + 1, top + bob, w - 2, 2, hc); px(c, bx + w - 1, top + 1 + bob, 2, headH - 1, hc); break; // ponytail
    case 5: px(c, bx, top + bob, w, 2, hc); px(c, bx - 1, top + 1 + bob, 1, 2, hc); px(c, bx + w, top + 1 + bob, 1, 2, hc); break; // pigtails
  }
  // accessories
  switch (kid.look.accessory) {
    case "cap": px(c, bx, top - 1 + bob, w, 2, color); px(c, bx + (facing > 0 ? w : -2), top + bob, 2, 1, color); break;
    case "glasses": px(c, bx + 1, top + 2 + bob, w - 2, 1, PALETTE.ink); break;
    case "headband": px(c, bx + 1, top + 1 + bob, w - 2, 1, "#ffffff"); break;
    case "bandana": px(c, bx, top + bob, w, 2, "#d93a3a"); break;
    case "cast": px(c, bx - 1, armY, 1, 3, "#ffffff"); break;
    default: break;
  }
  // eyes
  px(c, bx + (facing > 0 ? w - 3 : 2), top + 3 + bob, 1, 1, PALETTE.ink);
  // bat
  if (pose === "bat-ready") { c.strokeStyle = PALETTE.bat; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + (facing > 0 ? w + 1 : -1), armY + 1); c.lineTo(bx + (facing > 0 ? w + 4 : -4), armY - 9); c.stroke(); }
  if (pose === "bat-swing") { c.strokeStyle = PALETTE.bat; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + (facing > 0 ? w + 2 : -2), armY + 3); c.lineTo(bx + (facing > 0 ? w + 12 : -12), armY + 1); c.stroke(); }
}

/** A tiny portrait for cards and the HUD: the kid, big, on a plain colour. */
export function drawPortrait(c: Ctx, kid: Kid, color: string, size = 48) {
  c.imageSmoothingEnabled = false;
  c.fillStyle = "#ff00ff00";
  c.clearRect(0, 0, size, size);
  c.fillStyle = color;
  c.fillRect(0, 0, size, size);
  c.fillStyle = "rgba(255,255,255,0.18)";
  c.fillRect(0, size - 8, size, 8);
  c.save();
  c.translate(0, 0);
  c.scale(2, 2);
  drawKid(c, kid, size / 4, size / 2 - 2, "#ffffff", "idle", 0, 1);
  c.restore();
}
