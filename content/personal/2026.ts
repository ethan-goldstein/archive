import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2026 — PERSONAL CONTENT (age 21)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2026 lives in content/culture/2026.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2026: PersonalYearInput = {
  year: 2026,
  location: placeholder("Where you lived in 2026 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2026 for you."),
  memories: [
    placeholder("A memory from 2026: a moment, a habit, a person, a place. Write it like you'd tell a friend.", "memory", "2026-memory-1"),
    placeholder("Another memory from 2026.", "memory", "2026-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2026. Drop the file in public/photos/2026/ and fill in src, width, height, alt.", "photo", "2026-photo-1"),
    placeholder("Another photo from 2026.", "photo", "2026-photo-2"),
    placeholder("Another photo from 2026.", "photo", "2026-photo-3"),
  ],
  videos: [placeholder("A short clip from 2026: a local mp4 in public/photos/2026/ or an unlisted YouTube link.", "video", "2026-video-1")],
  music: [placeholder("A song you actually listened to in 2026. Add a Spotify/Apple/YouTube url or a local file.", "track", "2026-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2026.", "item", "2026-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2026.", "item", "2026-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2026.", "item", "2026-tech-1")],
  milestones: [placeholder("A milestone from 2026: school, a move, a trip, an achievement. Only real ones.", "milestone", "2026-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
