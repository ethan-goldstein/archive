import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2006 — PERSONAL CONTENT (age 1). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2006 lives in content/culture/2006.ts — keep them separate.
 */
export const personal2006: PersonalYearInput = {
  year: 2006,
  location: "Olney, Maryland",
  intro: "Olney, age one. Everything cool in the house was already Jeremy's.",
  memories: [
    {"id": "siblings", "title": "Older siblings", "body": "Jeremy is five years older, Kyra three and a half. I thought my brother was the coolest person alive and wanted to be him.", "tags": ["family", "jeremy", "kyra"]},
    placeholder("A story from when you were one, as your family tells it.", "memory", "2006-memory-2"),
  ],
  photos: [placeholder("A family photo from 2006. Drop files in public/photos/2006/ and run npm run photos.", "photo", "2006-photo-1")],
  videos: [],
  music: [placeholder("A song that was always on in the house in 2006.", "track", "2006-track-1")],
  interests: [placeholder("What you were into in 2006.", "item", "2006-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2006.", "item", "2006-screen-1")],
  tech: [placeholder("A device or app you used in 2006.", "item", "2006-tech-1")],
  milestones: [placeholder("A milestone from 2006. Only real ones.", "milestone", "2006-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
