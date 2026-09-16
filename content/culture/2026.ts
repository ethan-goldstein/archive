import type { CultureYearInput } from "@/lib/content/schema";

/**
 * 2026 — CULTURAL CONTEXT (general history, not personal).
 * This year is still being written. Items are what has happened so far, plus a few
 * scheduled events. Update as the year goes on.
 */
export const culture2026: CultureYearInput = {
  year: 2026,
  headline: "Still being written.",
  blurb:
    "The year the archive catches up to the present. Bad Bunny headlined the Super Bowl in February, the Winter Olympics came to Milan and Cortina, and the World Cup arrived in North America for the summer. GTA VI is on the calendar for November.",
  design:
    "Liquid Glass everywhere, AI assistants in every app, and a return to physical objects, film cameras, and wired headphones as reaction to all of it.",
  internet: [
    { label: "AI in everything", kind: "trend", icon: "ai", note: "Agents that browse, code, and book for you became ordinary." },
    { label: "TikTok's US joint venture", kind: "event", icon: "music", note: "The deal closed in January after a year of deadlines." },
    { label: "Bad Bunny's Super Bowl halftime", kind: "event", icon: "music", note: "February 8; a Spanish-language halftime show." },
    { label: "The World Cup feed", kind: "event", icon: "trophy", note: "June 11–July 19 across the US, Canada, and Mexico." },
    { label: "Debí Tirar Más Fotos wins Album of the Year", kind: "event", icon: "music", note: "February 1; the first Spanish-language album to win." },
  ],
  tech: [
    { label: "Switch 2, year two", kind: "console", icon: "switch" },
    { label: "Steam Machine and Steam Frame", kind: "console", icon: "controller", note: "Valve's living-room and VR hardware." },
    { label: "iPhone 17e", kind: "phone", icon: "iphone", note: "February." },
    { label: "GTA VI", kind: "game", icon: "video", note: "Scheduled for November 19." },
    { label: "Film cameras and wired headphones", kind: "trend", icon: "camera", note: "Analog as the new flex." },
  ],
  games: [
    { label: "Resident Evil Requiem", kind: "game", icon: "controller", note: "February 27." },
    { label: "Mario Tennis Fever and Pokémon Pokopia", kind: "game", icon: "switch", note: "February and March." },
    { label: "Crimson Desert", kind: "game", icon: "desktop", note: "March." },
    { label: "Saros and Pragmata", kind: "game", icon: "playstation", note: "April." },
    { label: "Forza Horizon 6", kind: "game", icon: "xbox", note: "May." },
    { label: "007 First Light", kind: "game", icon: "controller" },
    { label: "Marvel's Wolverine", kind: "game", icon: "playstation", note: "Scheduled for the fall." },
    { label: "Grand Theft Auto VI", kind: "game", icon: "video", note: "Scheduled for November 19." },
  ],
  onScreen: [
    { label: "The Super Mario Galaxy Movie", kind: "movie", icon: "controller", note: "April 3." },
    { label: "Project Hail Mary", kind: "movie", icon: "rocket", note: "March 20." },
    { label: "Michael", kind: "movie", icon: "music", note: "April 24." },
    { label: "The Mandalorian and Grogu", kind: "movie", icon: "film", note: "May 22." },
    { label: "Toy Story 5 and Supergirl", kind: "movie", icon: "film", note: "June." },
    { label: "The Odyssey and Spider-Man: Brand New Day", kind: "movie", icon: "film", note: "July." },
    { label: "Avengers: Doomsday and Dune: Part Three", kind: "movie", icon: "film", note: "December 18." },
    { label: "Bridgerton season 4 and One Piece season 2", kind: "show", icon: "stream", note: "Winter." },
    { label: "Euphoria season 3 and The Boys' final season", kind: "show", icon: "tv", note: "Spring." },
    { label: "House of the Dragon season 3", kind: "show", icon: "tv", note: "Summer." },
  ],
  music: [
    { id: "c2026-dtmf", title: "Debí Tirar Más Fotos", artist: "Bad Bunny", note: "Album of the Year." },
    { id: "c2026-fateofophelia", title: "The Fate of Ophelia", artist: "Taylor Swift" },
    { id: "c2026-golden", title: "Golden", artist: "HUNTR/X" },
  ],
  culture: [
    { label: "Super Bowl LX", kind: "event", icon: "trophy", note: "February 8; the Seahawks beat the Patriots." },
    { label: "Winter Olympics in Milan-Cortina", kind: "event", icon: "snow", note: "February 6–22." },
    { label: "The World Cup in North America", kind: "event", icon: "trophy", note: "48 teams, 104 matches." },
    { label: "The 250th anniversary of the United States", kind: "event", icon: "flag", note: "July 4." },
    { label: "Coachella: Sabrina Carpenter, Justin Bieber, Karol G", kind: "event", icon: "music", note: "April." },
  ],
  capsule: [
    { label: "World Cup ball", icon: "ball" },
    { label: "Film camera", icon: "camera" },
    { label: "Wired headphones", icon: "headphones" },
    { label: "Steam Machine", icon: "desktop" },
    { label: "A blank page", icon: "note" },
  ],
};
