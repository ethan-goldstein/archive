import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2009 — PERSONAL CONTENT (age 4)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2009 lives in content/culture/2009.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2009: PersonalYearInput = {
  year: 2009,
  location: placeholder("Where you lived in 2009 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2009 for you."),
  memories: [
    placeholder("A memory from age 4: a toy, a place, a routine, a birthday. 2–4 sentences.", "memory", "2009-memory-1"),
    placeholder("Another memory from 2009.", "memory", "2009-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2009. Drop the file in public/photos/2009/ and fill in src, width, height, alt.", "photo", "2009-photo-1"),
    placeholder("Another photo from 2009.", "photo", "2009-photo-2"),
    placeholder("Another photo from 2009.", "photo", "2009-photo-3"),
  ],
  videos: [placeholder("A short clip from 2009: a local mp4 in public/photos/2009/ or an unlisted YouTube link.", "video", "2009-video-1")],
  music: [placeholder("A song your family played around you in 2009, if anyone remembers one.", "track", "2009-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2009.", "item", "2009-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2009.", "item", "2009-screen-1")],
  tech: [placeholder("A device that was in the house in 2009 (family computer, camera, console).", "item", "2009-tech-1")],
  milestones: [placeholder("A milestone from 2009: school, a move, a trip, an achievement. Only real ones.", "milestone", "2009-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
