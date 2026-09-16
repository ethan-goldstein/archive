import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2015 — PERSONAL CONTENT (age 10)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2015 lives in content/culture/2015.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2015: PersonalYearInput = {
  year: 2015,
  location: placeholder("Where you lived in 2015 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2015 for you."),
  memories: [
    placeholder("Something that happened in 2015 that you still think about. 2–4 sentences.", "memory", "2015-memory-1"),
    placeholder("Another memory from 2015.", "memory", "2015-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2015. Drop the file in public/photos/2015/ and fill in src, width, height, alt.", "photo", "2015-photo-1"),
    placeholder("Another photo from 2015.", "photo", "2015-photo-2"),
    placeholder("Another photo from 2015.", "photo", "2015-photo-3"),
  ],
  videos: [placeholder("A short clip from 2015: a local mp4 in public/photos/2015/ or an unlisted YouTube link.", "video", "2015-video-1")],
  music: [placeholder("A song you actually listened to in 2015. Add a Spotify/Apple/YouTube url or a local file.", "track", "2015-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2015.", "item", "2015-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2015.", "item", "2015-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2015.", "item", "2015-tech-1")],
  milestones: [placeholder("A milestone from 2015: school, a move, a trip, an achievement. Only real ones.", "milestone", "2015-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
