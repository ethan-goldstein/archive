import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2021 — PERSONAL CONTENT (age 16)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2021 lives in content/culture/2021.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2021: PersonalYearInput = {
  year: 2021,
  location: placeholder("Where you lived in 2021 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2021 for you."),
  memories: [
    placeholder("A memory from 2021: a moment, a habit, a person, a place. Write it like you'd tell a friend.", "memory", "2021-memory-1"),
    placeholder("Another memory from 2021.", "memory", "2021-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2021. Drop the file in public/photos/2021/ and fill in src, width, height, alt.", "photo", "2021-photo-1"),
    placeholder("Another photo from 2021.", "photo", "2021-photo-2"),
    placeholder("Another photo from 2021.", "photo", "2021-photo-3"),
  ],
  videos: [placeholder("A short clip from 2021: a local mp4 in public/photos/2021/ or an unlisted YouTube link.", "video", "2021-video-1")],
  music: [placeholder("A song you actually listened to in 2021. Add a Spotify/Apple/YouTube url or a local file.", "track", "2021-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2021.", "item", "2021-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2021.", "item", "2021-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2021.", "item", "2021-tech-1")],
  milestones: [placeholder("A milestone from 2021: school, a move, a trip, an achievement. Only real ones.", "milestone", "2021-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
