import type { Trait } from "@/lib/game/types";

export const traitInfo: Record<Trait, { label: string; blurb: string }> = {
  clutch: { label: "Clutch", blurb: "Hits better with runners on base." },
  moonshot: { label: "Moonshot", blurb: "Fly balls carry an extra 15 feet." },
  "stolen-base": { label: "Jet Shoes", blurb: "Takes an extra base on any hit." },
  "rocket-arm": { label: "Rocket Arm", blurb: "Fastballs arrive a tick sooner." },
  "lucky-bounce": { label: "Lucky Bounce", blurb: "Grounders take strange hops away from gloves." },
  "twin-telepathy": { label: "Twin Telepathy", blurb: "Both twins on one team: +1 fielding for everyone." },
  "sticky-glove": { label: "Sticky Glove", blurb: "Never drops a ball he reaches." },
  "bunt-queen": { label: "Bunt Queen", blurb: "Bunts are nearly impossible to field in time." },
  "all-or-nothing": { label: "All or Nothing", blurb: "Huge power, tiny contact window." },
  curveball: { label: "Curveball", blurb: "Curves break twice as far." },
  robbed: { label: "Robbed!", blurb: "Can leap the fence to steal a home run." },
  "wild-card": { label: "Wild Card", blurb: "Every stat is rerolled each at-bat." },
  tough: { label: "Tough", blurb: "Never gets thrown out at home." },
  homework: { label: "Homework", blurb: "Never makes an error." },
  none: { label: "—", blurb: "" },
};

export const announcer = {
  playBall: ["Play ball!", "Batter up!", "Here we go, sandlot."],
  strikeLooking: ["Strike! Right down the middle.", "Called strike. That one was hittable.", "Strike, looking."],
  strikeSwinging: ["Swing and a miss!", "Whiff!", "Big cut, no contact."],
  ball: ["Ball.", "Outside. Ball.", "That one bounced. Ball."],
  foul: ["Foul ball, into the neighbour's yard.", "Foul, off the garage.", "Foul tip."],
  walk: ["Take your base.", "Four balls. Walk.", "Free pass."],
  strikeout: ["Strike three! Sit down.", "Struck out. Back to the fence.", "Three strikes. Next."],
  grounder: ["Ground ball!", "Chopper on the grass.", "Grounder, rolling."],
  liner: ["Line drive!", "Frozen rope!", "Rocket off the bat."],
  fly: ["Fly ball, deep!", "High fly ball.", "Way up there."],
  popup: ["Pop-up.", "Popped it up.", "Little pop fly."],
  bunt: ["Bunt!", "Laid one down.", "Drag bunt."],
  homerun: ["GONE! Over the fence!", "That's in the pool. Home run!", "See ya! Home run!"],
  caught: ["Caught!", "Got it.", "Out, on the catch."],
  out: ["Out!", "Got 'em.", "Thrown out."],
  safe: ["Safe!", "Beat the throw!", "Safe at the bag."],
  score: ["Run scores!", "Touches home.", "That's a run."],
  error: ["Error! It got through.", "Dropped it.", "Bad throw!"],
  side: ["Three outs. Switch sides.", "Side retired.", "Change sides."],
  robbed: ["ROBBED! Over the fence and back!", "He took it back!"],
};

export const teamTaunts = ["No batter, no batter!", "Easy out!", "Swing, batter batter!", "Hey pitcher, pitcher!"];
