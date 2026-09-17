import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2005 — PERSONAL CONTENT (age 0). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2005 lives in content/culture/2005.ts — keep them separate.
 */
export const personal2005: PersonalYearInput = {
  year: 2005,
  location: "Olney, Maryland",
  intro: "Born February 10 at Shady Grove Hospital. Home was the first house, in Olney.",
  memories: [
    {"id": "2005-born", "title": "The day I arrived", "body": "February 10, 2005, Shady Grove Hospital. Jeremy was four, Kyra was three. They had a head start on everything.", "date": "2005-02-10", "tags": ["birth", "family"]},
    placeholder("A story from the day you were born, as your family tells it.", "memory", "2005-memory-2"),
  ],
  photos: [placeholder("A family photo from 2005. Drop files in public/photos/2005/ and run npm run photos.", "photo", "2005-photo-1")],
  videos: [],
  music: [placeholder("A song that was always on in the house in 2005.", "track", "2005-track-1")],
  interests: [placeholder("What you were into in 2005.", "item", "2005-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2005.", "item", "2005-screen-1")],
  tech: [placeholder("A device or app you used in 2005.", "item", "2005-tech-1")],
  milestones: [{"id": "born", "title": "Born at Shady Grove Hospital", "kind": "life", "date": "2005-02-10", "body": "Potomac, Maryland.", "tags": ["birth", "potomac"]}, {"id": "2005-olney", "title": "Home to Olney", "kind": "move", "date": "2005", "body": "The first house.", "tags": ["olney", "home"]}],
  capsule: [],
  links: [],
  tags: [],
};
