import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2019 — PERSONAL CONTENT (age 14)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2019 lives in content/culture/2019.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2019: PersonalYearInput = {
  year: 2019,
  location: placeholder("Where you lived in 2019 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2019 for you."),
  memories: [
    placeholder("A memory from 2019: a moment, a habit, a person, a place. Write it like you'd tell a friend.", "memory", "2019-memory-1"),
    placeholder("Another memory from 2019.", "memory", "2019-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2019. Drop the file in public/photos/2019/ and fill in src, width, height, alt.", "photo", "2019-photo-1"),
    placeholder("Another photo from 2019.", "photo", "2019-photo-2"),
    placeholder("Another photo from 2019.", "photo", "2019-photo-3"),
  ],
  videos: [placeholder("A short clip from 2019: a local mp4 in public/photos/2019/ or an unlisted YouTube link.", "video", "2019-video-1")],
  music: [placeholder("A song you actually listened to in 2019. Add a Spotify/Apple/YouTube url or a local file.", "track", "2019-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2019.", "item", "2019-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2019.", "item", "2019-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2019.", "item", "2019-tech-1")],
  milestones: [placeholder("A milestone from 2019: school, a move, a trip, an achievement. Only real ones.", "milestone", "2019-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
