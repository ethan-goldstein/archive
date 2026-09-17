import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2023 — PERSONAL CONTENT (age 18). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2023 lives in content/culture/2023.ts — keep them separate.
 */
export const personal2023: PersonalYearInput = {
  year: 2023,
  location: "South Carolina",
  intro: "Graduated Wootton and moved to South Carolina for college.",
  memories: [
    placeholder("A first-semester memory.", "memory", "2023-memory-1"),
  ],
  photos: [placeholder("A photo from 2023. Drop files in public/photos/2023/ and run npm run photos.", "photo", "2023-photo-1")],
  videos: [placeholder("A short clip from 2023: an mp4 in public/photos/2023/ or an unlisted YouTube link.", "video", "2023-video-1")],
  music: [placeholder("Your top songs of 2023 from Apple Music Replay.", "track", "2023-track-1")],
  interests: [placeholder("What you were into in 2023.", "item", "2023-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2023.", "item", "2023-screen-1")],
  tech: [placeholder("A device or app you used in 2023.", "item", "2023-tech-1")],
  milestones: [{"id": "2023-grad", "title": "Graduated from Wootton High School", "kind": "achievement", "date": "2023-06", "body": "Class of 2023.", "tags": ["school"]}, {"id": "2023-college", "title": "Moved to South Carolina for college", "kind": "move", "date": "2023-08", "body": "2023 to 2027. School and city to confirm.", "tags": ["college", "move"]}],
  capsule: [],
  links: [],
  tags: [],
};
