import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2010 — PERSONAL CONTENT (age 5). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2010 lives in content/culture/2010.ts — keep them separate.
 */
export const personal2010: PersonalYearInput = {
  year: 2010,
  location: "Wooden Bridge Road, Cold Spring, Potomac",
  intro: "Kindergarten at Cold Spring Elementary.",
  memories: [
    placeholder("A kindergarten memory: the classroom, a teacher, the bus, the first friend.", "memory", "2010-memory-1"),
  ],
  photos: [placeholder("A photo from 2010. Drop files in public/photos/2010/ and run npm run photos.", "photo", "2010-photo-1")],
  videos: [placeholder("A short clip from 2010: an mp4 in public/photos/2010/ or an unlisted YouTube link.", "video", "2010-video-1")],
  music: [placeholder("A song that was always on in the house in 2010.", "track", "2010-track-1")],
  interests: [placeholder("What you were into in 2010.", "item", "2010-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2010.", "item", "2010-screen-1")],
  tech: [placeholder("A device or app you used in 2010.", "item", "2010-tech-1")],
  milestones: [{"id": "2010-k", "title": "Kindergarten at Cold Spring Elementary", "kind": "school", "date": "2010-08", "tags": ["school", "cold-spring-es"]}],
  capsule: [],
  links: [],
  tags: [],
};
