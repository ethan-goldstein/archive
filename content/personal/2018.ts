import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2018 — PERSONAL CONTENT (age 13)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2018 lives in content/culture/2018.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2018: PersonalYearInput = {
  year: 2018,
  location: placeholder("Where you lived in 2018 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2018 for you."),
  memories: [
    placeholder("Something that happened in 2018 that you still think about. 2–4 sentences.", "memory", "2018-memory-1"),
    placeholder("Another memory from 2018.", "memory", "2018-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2018. Drop the file in public/photos/2018/ and fill in src, width, height, alt.", "photo", "2018-photo-1"),
    placeholder("Another photo from 2018.", "photo", "2018-photo-2"),
    placeholder("Another photo from 2018.", "photo", "2018-photo-3"),
  ],
  videos: [placeholder("A short clip from 2018: a local mp4 in public/photos/2018/ or an unlisted YouTube link.", "video", "2018-video-1")],
  music: [placeholder("A song you actually listened to in 2018. Add a Spotify/Apple/YouTube url or a local file.", "track", "2018-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2018.", "item", "2018-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2018.", "item", "2018-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2018.", "item", "2018-tech-1")],
  milestones: [placeholder("A milestone from 2018: school, a move, a trip, an achievement. Only real ones.", "milestone", "2018-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
