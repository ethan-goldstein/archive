import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2013 — PERSONAL CONTENT (age 8)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2013 lives in content/culture/2013.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2013: PersonalYearInput = {
  year: 2013,
  location: placeholder("Where you lived in 2013 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2013 for you."),
  memories: [
    placeholder("A memory from age 8: a toy, a place, a routine, a birthday. 2–4 sentences.", "memory", "2013-memory-1"),
    placeholder("Another memory from 2013.", "memory", "2013-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2013. Drop the file in public/photos/2013/ and fill in src, width, height, alt.", "photo", "2013-photo-1"),
    placeholder("Another photo from 2013.", "photo", "2013-photo-2"),
    placeholder("Another photo from 2013.", "photo", "2013-photo-3"),
  ],
  videos: [placeholder("A short clip from 2013: a local mp4 in public/photos/2013/ or an unlisted YouTube link.", "video", "2013-video-1")],
  music: [placeholder("A song you actually listened to in 2013. Add a Spotify/Apple/YouTube url or a local file.", "track", "2013-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2013.", "item", "2013-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2013.", "item", "2013-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2013.", "item", "2013-tech-1")],
  milestones: [placeholder("A milestone from 2013: school, a move, a trip, an achievement. Only real ones.", "milestone", "2013-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
