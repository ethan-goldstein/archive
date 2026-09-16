import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2006 — PERSONAL CONTENT (age 1)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2006 lives in content/culture/2006.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2006: PersonalYearInput = {
  year: 2006,
  location: placeholder("Where you lived in 2006 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2006 for you."),
  memories: [
    placeholder("A story from when you were 1, as your family tells it. Even one sentence works.", "memory", "2006-memory-1"),
    placeholder("Another memory from 2006.", "memory", "2006-memory-2"),
  ],
  photos: [
    placeholder("A family photo from 2006. Drop the file in public/photos/2006/ and fill in src, width, height, alt.", "photo", "2006-photo-1"),
    placeholder("Another photo from 2006.", "photo", "2006-photo-2"),
    placeholder("Another photo from 2006.", "photo", "2006-photo-3"),
  ],
  music: [placeholder("A song your family played around you in 2006, if anyone remembers one.", "track", "2006-track-1")],
  interests: [placeholder("A favourite toy, show, or thing you were obsessed with at 1.", "item", "2006-interest-1")],
  onMyScreen: [placeholder("A show or movie that was always on in the house in 2006.", "item", "2006-screen-1")],
  tech: [placeholder("A device that was in the house in 2006 (family computer, camera, console).", "item", "2006-tech-1")],
  milestones: [placeholder("A milestone from 2006: school, a move, a trip, an achievement. Only real ones.", "milestone", "2006-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
