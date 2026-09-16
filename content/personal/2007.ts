import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2007 — PERSONAL CONTENT (age 2)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2007 lives in content/culture/2007.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2007: PersonalYearInput = {
  year: 2007,
  location: placeholder("Where you lived in 2007 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2007 for you."),
  memories: [
    placeholder("A story from when you were 2, as your family tells it. Even one sentence works.", "memory", "2007-memory-1"),
    placeholder("Another memory from 2007.", "memory", "2007-memory-2"),
  ],
  photos: [
    placeholder("A family photo from 2007. Drop the file in public/photos/2007/ and fill in src, width, height, alt.", "photo", "2007-photo-1"),
    placeholder("Another photo from 2007.", "photo", "2007-photo-2"),
    placeholder("Another photo from 2007.", "photo", "2007-photo-3"),
  ],
  music: [placeholder("A song your family played around you in 2007, if anyone remembers one.", "track", "2007-track-1")],
  interests: [placeholder("A favourite toy, show, or thing you were obsessed with at 2.", "item", "2007-interest-1")],
  onMyScreen: [placeholder("A show or movie that was always on in the house in 2007.", "item", "2007-screen-1")],
  tech: [placeholder("A device that was in the house in 2007 (family computer, camera, console).", "item", "2007-tech-1")],
  milestones: [placeholder("A milestone from 2007: school, a move, a trip, an achievement. Only real ones.", "milestone", "2007-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
