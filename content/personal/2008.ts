import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2008 — PERSONAL CONTENT (age 3)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2008 lives in content/culture/2008.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2008: PersonalYearInput = {
  year: 2008,
  location: placeholder("Where you lived in 2008 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2008 for you."),
  memories: [
    placeholder("A story from when you were 3, as your family tells it. Even one sentence works.", "memory", "2008-memory-1"),
    placeholder("Another memory from 2008.", "memory", "2008-memory-2"),
  ],
  photos: [
    placeholder("A family photo from 2008. Drop the file in public/photos/2008/ and fill in src, width, height, alt.", "photo", "2008-photo-1"),
    placeholder("Another photo from 2008.", "photo", "2008-photo-2"),
    placeholder("Another photo from 2008.", "photo", "2008-photo-3"),
  ],
  music: [placeholder("A song your family played around you in 2008, if anyone remembers one.", "track", "2008-track-1")],
  interests: [placeholder("A favourite toy, show, or thing you were obsessed with at 3.", "item", "2008-interest-1")],
  onMyScreen: [placeholder("A show or movie that was always on in the house in 2008.", "item", "2008-screen-1")],
  tech: [placeholder("A device that was in the house in 2008 (family computer, camera, console).", "item", "2008-tech-1")],
  milestones: [placeholder("A milestone from 2008: school, a move, a trip, an achievement. Only real ones.", "milestone", "2008-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
