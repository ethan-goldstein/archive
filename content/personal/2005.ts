import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2005 — PERSONAL CONTENT (age 0, born this year)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2005 lives in content/culture/2005.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2005: PersonalYearInput = {
  year: 2005,
  location: "Potomac, Maryland",
  intro: placeholder("A sentence about the year you arrived."),
  memories: [
    placeholder("The story of the day you were born, as told by family (February 10, 2005).", "memory", "2005-memory-1"),
    placeholder("Another memory from 2005.", "memory", "2005-memory-2"),
  ],
  photos: [
    placeholder("A family photo from 2005. Drop the file in public/photos/2005/ and fill in src, width, height, alt.", "photo", "2005-photo-1"),
    placeholder("Another photo from 2005.", "photo", "2005-photo-2"),
    placeholder("Another photo from 2005.", "photo", "2005-photo-3"),
  ],
  music: [placeholder("A song your family played around you in 2005, if anyone remembers one.", "track", "2005-track-1")],
  interests: [placeholder("A favourite toy, show, or thing you were obsessed with at 0.", "item", "2005-interest-1")],
  onMyScreen: [placeholder("A show or movie that was always on in the house in 2005.", "item", "2005-screen-1")],
  tech: [placeholder("A device that was in the house in 2005 (family computer, camera, console).", "item", "2005-tech-1")],
  milestones: [
    {
      id: "born",
      title: "Born in Potomac, Maryland",
      date: "2005-02-10",
      kind: "life",
      tags: ["birth", "potomac"],
    },
  ],
  capsule: [],
  links: [],
  tags: [],
};
