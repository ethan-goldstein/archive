import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2012 — PERSONAL CONTENT (age 7)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2012 lives in content/culture/2012.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2012: PersonalYearInput = {
  year: 2012,
  location: placeholder("Where you lived in 2012 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2012 for you."),
  memories: [
    placeholder("A memory from age 7: a toy, a place, a routine, a birthday. 2–4 sentences.", "memory", "2012-memory-1"),
    placeholder("Another memory from 2012.", "memory", "2012-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2012. Drop the file in public/photos/2012/ and fill in src, width, height, alt.", "photo", "2012-photo-1"),
    placeholder("Another photo from 2012.", "photo", "2012-photo-2"),
    placeholder("Another photo from 2012.", "photo", "2012-photo-3"),
  ],
  videos: [placeholder("A short clip from 2012: a local mp4 in public/photos/2012/ or an unlisted YouTube link.", "video", "2012-video-1")],
  music: [placeholder("A song you actually listened to in 2012. Add a Spotify/Apple/YouTube url or a local file.", "track", "2012-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2012.", "item", "2012-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2012.", "item", "2012-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2012.", "item", "2012-tech-1")],
  milestones: [placeholder("A milestone from 2012: school, a move, a trip, an achievement. Only real ones.", "milestone", "2012-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
