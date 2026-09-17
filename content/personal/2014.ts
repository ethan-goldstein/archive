import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2014 — PERSONAL CONTENT (age 9). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2014 lives in content/culture/2014.ts — keep them separate.
 */
export const personal2014: PersonalYearInput = {
  year: 2014,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Fourth grade, and a move down the street to Paddock Lane, where I would live until I was twenty.",
  memories: [
    {"id": "2014-paddock", "title": "Paddock Lane", "body": "Same neighbourhood, new house. This one lasted: 4th grade to age 20.", "tags": ["home", "move"]},
  ],
  photos: [placeholder("A photo from 2014. Drop files in public/photos/2014/ and run npm run photos.", "photo", "2014-photo-1")],
  videos: [placeholder("A short clip from 2014: an mp4 in public/photos/2014/ or an unlisted YouTube link.", "video", "2014-video-1")],
  music: [placeholder("A song that was always on in the house in 2014.", "track", "2014-track-1")],
  interests: [placeholder("What you were into in 2014.", "item", "2014-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2014.", "item", "2014-screen-1")],
  tech: [placeholder("A device or app you used in 2014.", "item", "2014-tech-1")],
  milestones: [{"id": "2014-move", "title": "Moved to Paddock Lane", "kind": "move", "date": "2014", "body": "Fourth grade. Still Cold Spring.", "tags": ["move", "paddock"]}],
  capsule: [],
  links: [],
  tags: [],
};
