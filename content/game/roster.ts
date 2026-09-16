import type { Kid } from "@/lib/game/types";

/**
 * POTOMAC SANDLOT — the neighbourhood roster.
 * An original cast in the spirit of the backyard-sports games Ethan grew up with.
 * Stats are 1–10. Traits are explained in content/game/text.ts.
 * Team names, the game title, and everything here can be edited freely.
 */
export const GAME_TITLE = "Potomac Sandlot";
export const TEAM_NAMES = ["Cul-de-Sac Comets", "River Road Rockets", "Falls Road Foxes", "Glen Hills Goats", "Tuckerman Tigers", "Seven Locks Sharks"];

export const kids: Kid[] = [
  {
    card: "/game/cards/pepper.png",
    id: "pepper", name: "Pepper Nakamura", nickname: "Pepper", age: 8,
    bio: "Smallest kid on the block. Nobody picks her first. Everybody regrets it.",
    batting: 8, power: 7, speed: 9, pitching: 8, fielding: 9, trait: "clutch",
    look: { skin: 1, hair: 2, hairColor: "#1a1a1a", size: "small", accessory: "cap" },
  },
  {
    card: "/game/cards/moose.png",
    id: "moose", name: "Marvin Delgado", nickname: "Moose", age: 12,
    bio: "Swings like a screen door in a hurricane. Runs like one too.",
    batting: 6, power: 10, speed: 2, pitching: 3, fielding: 5, trait: "moonshot",
    look: { skin: 2, hair: 0, hairColor: "#2b1a0e", size: "big", accessory: "none" },
  },
  {
    card: "/game/cards/zip.png",
    id: "zip", name: "Zoe Lindqvist", nickname: "Zip", age: 10,
    bio: "Has never been thrown out. Has also never stopped talking.",
    batting: 7, power: 3, speed: 10, pitching: 4, fielding: 7, trait: "stolen-base",
    look: { skin: 0, hair: 4, hairColor: "#e6b422", size: "medium", accessory: "headband" },
  },
  {
    card: "/game/cards/rocket.png",
    id: "rocket", name: "Marcus Bell", nickname: "Rocket", age: 11,
    bio: "Throws a fastball that has, allegedly, dented a garage door.",
    batting: 4, power: 5, speed: 5, pitching: 10, fielding: 6, trait: "rocket-arm",
    look: { skin: 3, hair: 1, hairColor: "#111111", size: "medium", accessory: "none" },
  },
  {
    card: "/game/cards/wendell.png",
    id: "wendell", name: "Wendell Okafor", age: 9,
    bio: "Talks to the ball. The ball, occasionally, listens.",
    batting: 5, power: 6, speed: 5, pitching: 6, fielding: 5, trait: "lucky-bounce",
    look: { skin: 3, hair: 3, hairColor: "#111111", size: "medium", accessory: "glasses" },
  },
  {
    card: "/game/cards/ari.png",
    id: "ari", name: "Ari Rosenthal", age: 10,
    bio: "One half of the twins. The one who catches.",
    batting: 6, power: 5, speed: 7, pitching: 5, fielding: 8, trait: "twin-telepathy",
    look: { skin: 0, hair: 2, hairColor: "#7a3b12", size: "medium", accessory: "cap" },
  },
  {
    card: "/game/cards/ida.png",
    id: "ida", name: "Ida Rosenthal", age: 10,
    bio: "The other half. The one who hits.",
    batting: 7, power: 6, speed: 6, pitching: 5, fielding: 6, trait: "twin-telepathy",
    look: { skin: 0, hair: 5, hairColor: "#7a3b12", size: "medium", accessory: "cap" },
  },
  {
    card: "/game/cards/gus.png",
    id: "gus", name: "Gus Petrakis", nickname: "The Glove", age: 12,
    bio: "His glove is bigger than his head. Nothing gets past it.",
    batting: 4, power: 4, speed: 3, pitching: 2, fielding: 10, trait: "sticky-glove",
    look: { skin: 1, hair: 0, hairColor: "#3d2b1f", size: "big", accessory: "none" },
  },
  {
    card: "/game/cards/priya.png",
    id: "priya", name: "Priya Venkatesan", age: 9,
    bio: "Will not swing hard. Will not miss. Will bunt you to death.",
    batting: 9, power: 2, speed: 8, pitching: 3, fielding: 6, trait: "bunt-queen",
    look: { skin: 2, hair: 4, hairColor: "#111111", size: "small", accessory: "none" },
  },
  {
    card: "/game/cards/tommy.png",
    id: "tommy", name: "Tommy Callahan", nickname: "Two-Bats", age: 11,
    bio: "Brings two bats to the plate in case the first one breaks. It usually does.",
    batting: 3, power: 9, speed: 4, pitching: 4, fielding: 4, trait: "all-or-nothing",
    look: { skin: 0, hair: 1, hairColor: "#c94a1c", size: "big", accessory: "bandana" },
  },
  {
    card: "/game/cards/leila.png",
    id: "leila", name: "Leila Haddad", age: 11,
    bio: "Her curveball has a nickname. It is not a nice one.",
    batting: 5, power: 4, speed: 5, pitching: 9, fielding: 6, trait: "curveball",
    look: { skin: 1, hair: 4, hairColor: "#1a1a1a", size: "medium", accessory: "cap" },
  },
  {
    card: "/game/cards/dash.png",
    id: "dash", name: "Dante Washington", nickname: "Dash", age: 10,
    bio: "Can jump the fence. Has jumped the fence. Will jump the fence.",
    batting: 6, power: 6, speed: 8, pitching: 3, fielding: 9, trait: "robbed",
    look: { skin: 3, hair: 0, hairColor: "#111111", size: "medium", accessory: "none" },
  },
  {
    card: "/game/cards/ruby.png",
    id: "ruby", name: "Ruby Kowalski", age: 7,
    bio: "Youngest on the field. Nobody, including Ruby, knows what she will do next.",
    batting: 5, power: 5, speed: 6, pitching: 5, fielding: 4, trait: "wild-card",
    look: { skin: 0, hair: 5, hairColor: "#d93a3a", size: "small", accessory: "none" },
  },
  {
    card: "/game/cards/benji.png",
    id: "benji", name: "Benji Ortega", age: 10,
    bio: "Broke his arm in April. Signed the cast himself. Still playing.",
    batting: 6, power: 7, speed: 4, pitching: 5, fielding: 5, trait: "tough",
    look: { skin: 2, hair: 3, hairColor: "#2b1a0e", size: "medium", accessory: "cast" },
  },
  {
    card: "/game/cards/stats.png",
    id: "stats", name: "Sam Cho", nickname: "Stats", age: 11,
    bio: "Keeps a notebook of every at-bat on the block. Including yours.",
    batting: 6, power: 6, speed: 6, pitching: 6, fielding: 6, trait: "homework",
    look: { skin: 1, hair: 1, hairColor: "#1a1a1a", size: "medium", accessory: "glasses" },
  },
];

/**
 * PERSONAL SLOTS — add yourself and real friends here. They appear in the draft next to the cast.
 * Example:
 * { id: "ethan", name: "Ethan Goldstein", nickname: "E", age: 9, bio: "Potomac, MD.",
 *   batting: 7, power: 6, speed: 7, pitching: 5, fielding: 7, trait: "clutch",
 *   look: { skin: 0, hair: 1, hairColor: "#3d2b1f", size: "medium", accessory: "cap" }, personal: true },
 */
export const personalSlots: Kid[] = [];

export function allKids(): Kid[] {
  return [...personalSlots.map((k) => ({ ...k, personal: true })), ...kids];
}
