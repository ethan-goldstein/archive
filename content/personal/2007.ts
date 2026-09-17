import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2007 — PERSONAL CONTENT (age 2). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2007 lives in content/culture/2007.ts — keep them separate.
 */
export const personal2007: PersonalYearInput = {
  year: 2007,
  location: "Olney, Maryland",
  intro: "Olney, age two. The last full year in the first house.",
  memories: [
    placeholder("A story from when you were two, as your family tells it.", "memory", "2007-memory-1"),
  ],
  photos: [placeholder("A family photo from 2007. Drop files in public/photos/2007/ and run npm run photos.", "photo", "2007-photo-1")],
  videos: [],
  music: [placeholder("A song that was always on in the house in 2007.", "track", "2007-track-1")],
  interests: [placeholder("What you were into in 2007.", "item", "2007-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2007.", "item", "2007-screen-1")],
  tech: [placeholder("A device or app you used in 2007.", "item", "2007-tech-1")],
  milestones: [placeholder("A milestone from 2007. Only real ones.", "milestone", "2007-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
