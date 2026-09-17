import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2024 — PERSONAL CONTENT (age 19). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2024 lives in content/culture/2024.ts — keep them separate.
 */
export const personal2024: PersonalYearInput = {
  year: 2024,
  location: "Columbia, South Carolina",
  intro: "Sophomore year at South Carolina. Last year at The Baseball Zone back home.",
  memories: [
    placeholder("A sophomore-year memory.", "memory", "2024-memory-1"),
  ],
  photos: [placeholder("A photo from 2024. Drop files in public/photos/2024/ and run npm run photos.", "photo", "2024-photo-1")],
  videos: [placeholder("A short clip from 2024: an mp4 in public/photos/2024/ or an unlisted YouTube link.", "video", "2024-video-1")],
  music: [placeholder("Your top songs of 2024 from Apple Music Replay.", "track", "2024-track-1")],
  interests: [placeholder("What you were into in 2024.", "item", "2024-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2024.", "item", "2024-screen-1")],
  tech: [placeholder("A device or app you used in 2024.", "item", "2024-tech-1")],
  milestones: [placeholder("A milestone from 2024. Only real ones.", "milestone", "2024-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
