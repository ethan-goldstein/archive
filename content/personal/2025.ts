import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2025 — PERSONAL CONTENT (age 20)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2025 lives in content/culture/2025.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2025: PersonalYearInput = {
  year: 2025,
  location: placeholder("Where you lived in 2025 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2025 for you."),
  memories: [
    placeholder("A memory from 2025: a moment, a habit, a person, a place. Write it like you'd tell a friend.", "memory", "2025-memory-1"),
    placeholder("Another memory from 2025.", "memory", "2025-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2025. Drop the file in public/photos/2025/ and fill in src, width, height, alt.", "photo", "2025-photo-1"),
    placeholder("Another photo from 2025.", "photo", "2025-photo-2"),
    placeholder("Another photo from 2025.", "photo", "2025-photo-3"),
  ],
  videos: [placeholder("A short clip from 2025: a local mp4 in public/photos/2025/ or an unlisted YouTube link.", "video", "2025-video-1")],
  music: [placeholder("A song you actually listened to in 2025. Add a Spotify/Apple/YouTube url or a local file.", "track", "2025-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2025.", "item", "2025-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2025.", "item", "2025-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2025.", "item", "2025-tech-1")],
  milestones: [placeholder("A milestone from 2025: school, a move, a trip, an achievement. Only real ones.", "milestone", "2025-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
