import type { CultureYearInput } from "@/lib/content/schema";

/** 2006 — CULTURAL CONTEXT (general history, not personal). */
export const culture2006: CultureYearInput = {
  year: 2006,
  headline: "You were Time's Person of the Year.",
  blurb:
    "Facebook opened to everyone and added the News Feed, Twitter quietly launched, and Google bought YouTube for $1.65 billion. In November the Wii put a motion controller in every family's hands and the PlayStation 3 arrived alongside it.",
  design:
    "Still XP on most desks, but Vista's frosted 'Aero' glass was on the way. The Wii's clean white plastic and the DS Lite made tech look friendly.",
  internet: [
    { label: "Facebook opens to everyone", kind: "site", icon: "globe", note: "Plus the News Feed, which people initially hated." },
    { label: "Twitter launches", kind: "site", icon: "bird", note: "140 characters, sent by text message." },
    { label: "Google buys YouTube", kind: "site", icon: "video" },
    { label: "Roblox goes public", kind: "site", icon: "controller", note: "Version 1.0 released in September." },
    { label: "MySpace peaks", kind: "site", icon: "music", note: "The biggest site in the US by page views." },
    { label: "Wikipedia hits 1 million English articles", kind: "site", icon: "book" },
    { label: "Digg and del.icio.us", kind: "site", icon: "globe", note: "Social bookmarking, the pre-Reddit front page." },
  ],
  tech: [
    { label: "Nintendo Wii", kind: "console", icon: "wii", note: "Wii Sports in the box; wrist straps mandatory." },
    { label: "PlayStation 3", kind: "console", icon: "playstation", note: "Blu-ray, $599, and long lines." },
    { label: "Nintendo DS Lite", kind: "console", icon: "ds", note: "Slimmer, brighter, and everywhere." },
    { label: "MacBook and Intel Macs", kind: "computer", icon: "laptop", note: "The white plastic MacBook debuted in May." },
    { label: "Zune", kind: "device", icon: "ipod", note: "Microsoft's brown answer to the iPod." },
    { label: "Windows Vista (to businesses)", kind: "computer", icon: "window", note: "Consumers got it in January 2007." },
    { label: "Blu-ray vs HD DVD", kind: "device", icon: "cd", note: "The last physical format war." },
    { label: "T-Mobile Sidekick 3", kind: "phone", icon: "phone", note: "The swivel-screen keyboard phone." },
  ],
  games: [
    { label: "Wii Sports", kind: "game", icon: "wii", note: "Bowling in the living room." },
    { label: "New Super Mario Bros.", kind: "game", icon: "ds" },
    { label: "The Legend of Zelda: Twilight Princess", kind: "game", icon: "wii" },
    { label: "Gears of War", kind: "game", icon: "xbox" },
    { label: "The Elder Scrolls IV: Oblivion", kind: "game", icon: "xbox" },
    { label: "Guitar Hero II", kind: "game", icon: "controller" },
    { label: "Brain Age", kind: "game", icon: "ds" },
  ],
  onScreen: [
    { label: "Cars", kind: "movie", icon: "car" },
    { label: "Happy Feet", kind: "movie", icon: "film" },
    { label: "Pirates of the Caribbean: Dead Man's Chest", kind: "movie", icon: "film" },
    { label: "High School Musical", kind: "movie", icon: "tv", note: "A Disney Channel movie that became a phenomenon." },
    { label: "Hannah Montana premieres", kind: "show", icon: "tv" },
    { label: "Planet Earth", kind: "show", icon: "tv", note: "The BBC series in HD." },
    { label: "Heroes premieres", kind: "show", icon: "tv" },
    { label: "Evolution of Dance", kind: "youtube", icon: "video", note: "The most-viewed YouTube video of the year." },
  ],
  music: [
    { id: "c2006-crazy", title: "Crazy", artist: "Gnarls Barkley" },
    { id: "c2006-hips", title: "Hips Don't Lie", artist: "Shakira ft. Wyclef Jean" },
    { id: "c2006-sexyback", title: "SexyBack", artist: "Justin Timberlake" },
    { id: "c2006-badday", title: "Bad Day", artist: "Daniel Powter" },
    { id: "c2006-chasingcars", title: "Chasing Cars", artist: "Snow Patrol" },
    { id: "c2006-promiscuous", title: "Promiscuous", artist: "Nelly Furtado ft. Timbaland" },
  ],
  culture: [
    { label: "Time's Person of the Year: \"You\"", kind: "event", icon: "star", note: "A mirror on the cover." },
    { label: "Chuck Norris facts", kind: "meme", icon: "smile" },
    { label: "Snakes on a Plane", kind: "meme", icon: "film", note: "Internet hype ahead of the movie." },
    { label: "Heelys", kind: "fashion", icon: "skateboard", note: "Shoes with wheels, banned in most hallways." },
    { label: "Webkinz mania", kind: "toy", icon: "toy" },
    { label: "Crazy Frog", kind: "meme", icon: "music" },
    { label: "Sudoku everywhere", kind: "trend", icon: "book" },
  ],
  capsule: [
    { label: "Wii Remote", icon: "wii" },
    { label: "DS Lite", icon: "ds" },
    { label: "White MacBook", icon: "laptop" },
    { label: "Sidekick", icon: "phone" },
    { label: "Blu-ray disc", icon: "cd" },
    { label: "Heelys", icon: "skateboard" },
  ],
};
