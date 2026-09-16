import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2010 — PERSONAL CONTENT (age 5)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2010 lives in content/culture/2010.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2010: PersonalYearInput = {
  year: 2010,
  location: placeholder("Where you lived in 2010 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2010 for you."),
  memories: [
    placeholder("A memory from age 5: a toy, a place, a routine, a birthday. 2–4 sentences.", "memory", "2010-memory-1"),
    placeholder("Another memory from 2010.", "memory", "2010-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2010. Drop the file in public/photos/2010/ and fill in src, width, height, alt.", "photo", "2010-photo-1"),
    placeholder("Another photo from 2010.", "photo", "2010-photo-2"),
    placeholder("Another photo from 2010.", "photo", "2010-photo-3"),
  ],
  videos: [placeholder("A short clip from 2010: a local mp4 in public/photos/2010/ or an unlisted YouTube link.", "video", "2010-video-1")],
  music: [placeholder("A song your family played around you in 2010, if anyone remembers one.", "track", "2010-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2010.", "item", "2010-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2010.", "item", "2010-screen-1")],
  tech: [placeholder("A device that was in the house in 2010 (family computer, camera, console).", "item", "2010-tech-1")],
  milestones: [placeholder("A milestone from 2010: school, a move, a trip, an achievement. Only real ones.", "milestone", "2010-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
