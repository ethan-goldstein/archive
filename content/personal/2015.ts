import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2015 — PERSONAL CONTENT (age 10). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2015 lives in content/culture/2015.ts — keep them separate.
 */
export const personal2015: PersonalYearInput = {
  year: 2015,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Fifth grade, the last year at Cold Spring Elementary.",
  memories: [
    {"id": "2015-crew", "title": "The elementary crew", "body": "Josh and Max, the twins. Josh. Devlin. Kids I met at Cold Spring who are still my friends today.", "tags": ["friends"]},
  ],
  photos: [placeholder("A photo from 2015. Drop files in public/photos/2015/ and run npm run photos.", "photo", "2015-photo-1")],
  videos: [placeholder("A short clip from 2015: an mp4 in public/photos/2015/ or an unlisted YouTube link.", "video", "2015-video-1")],
  music: [placeholder("Your top songs of 2015 from Apple Music Replay.", "track", "2015-track-1")],
  interests: [placeholder("What you were into in 2015.", "item", "2015-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2015.", "item", "2015-screen-1")],
  tech: [placeholder("A device or app you used in 2015.", "item", "2015-tech-1")],
  milestones: [{"id": "2015-es-end", "title": "Finished Cold Spring Elementary", "kind": "school", "date": "2016-06", "body": "Kindergarten through 5th grade.", "tags": ["school"]}],
  capsule: [],
  links: [],
  tags: [],
};
