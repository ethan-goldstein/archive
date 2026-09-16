import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2011 — PERSONAL CONTENT (age 6)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2011 lives in content/culture/2011.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2011: PersonalYearInput = {
  year: 2011,
  location: placeholder("Where you lived in 2011 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2011 for you."),
  memories: [
    placeholder("A memory from age 6: a toy, a place, a routine, a birthday. 2–4 sentences.", "memory", "2011-memory-1"),
    placeholder("Another memory from 2011.", "memory", "2011-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2011. Drop the file in public/photos/2011/ and fill in src, width, height, alt.", "photo", "2011-photo-1"),
    placeholder("Another photo from 2011.", "photo", "2011-photo-2"),
    placeholder("Another photo from 2011.", "photo", "2011-photo-3"),
  ],
  videos: [placeholder("A short clip from 2011: a local mp4 in public/photos/2011/ or an unlisted YouTube link.", "video", "2011-video-1")],
  music: [placeholder("A song you actually listened to in 2011. Add a Spotify/Apple/YouTube url or a local file.", "track", "2011-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2011.", "item", "2011-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2011.", "item", "2011-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2011.", "item", "2011-tech-1")],
  milestones: [placeholder("A milestone from 2011: school, a move, a trip, an achievement. Only real ones.", "milestone", "2011-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
