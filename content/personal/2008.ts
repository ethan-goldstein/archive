import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2008 — PERSONAL CONTENT (age 3). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2008 lives in content/culture/2008.ts — keep them separate.
 */
export const personal2008: PersonalYearInput = {
  year: 2008,
  location: "Olney, Maryland",
  intro: "Preschool at our synagogue. Not much memory of it, which seems fair.",
  memories: [
    {"id": "2008-preschool", "title": "Preschool", "body": "At the synagogue. I remember almost none of it.", "tags": ["school"]},
  ],
  photos: [placeholder("A family photo from 2008. Drop files in public/photos/2008/ and run npm run photos.", "photo", "2008-photo-1")],
  videos: [],
  music: [placeholder("A song that was always on in the house in 2008.", "track", "2008-track-1")],
  interests: [placeholder("What you were into in 2008.", "item", "2008-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2008.", "item", "2008-screen-1")],
  tech: [placeholder("A device or app you used in 2008.", "item", "2008-tech-1")],
  milestones: [{"id": "2008-preschool", "title": "Started preschool at the synagogue", "kind": "school", "date": "2008", "tags": ["school"]}],
  capsule: [],
  links: [],
  tags: [],
};
