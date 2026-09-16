import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2022 — PERSONAL CONTENT (age 17)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2022 lives in content/culture/2022.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2022: PersonalYearInput = {
  year: 2022,
  location: placeholder("Where you lived in 2022 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2022 for you."),
  memories: [
    placeholder("A memory from 2022: a moment, a habit, a person, a place. Write it like you'd tell a friend.", "memory", "2022-memory-1"),
    placeholder("Another memory from 2022.", "memory", "2022-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2022. Drop the file in public/photos/2022/ and fill in src, width, height, alt.", "photo", "2022-photo-1"),
    placeholder("Another photo from 2022.", "photo", "2022-photo-2"),
    placeholder("Another photo from 2022.", "photo", "2022-photo-3"),
  ],
  videos: [placeholder("A short clip from 2022: a local mp4 in public/photos/2022/ or an unlisted YouTube link.", "video", "2022-video-1")],
  music: [placeholder("A song you actually listened to in 2022. Add a Spotify/Apple/YouTube url or a local file.", "track", "2022-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2022.", "item", "2022-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2022.", "item", "2022-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2022.", "item", "2022-tech-1")],
  milestones: [placeholder("A milestone from 2022: school, a move, a trip, an achievement. Only real ones.", "milestone", "2022-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
