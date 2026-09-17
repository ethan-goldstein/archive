import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2026 — PERSONAL CONTENT (age 21). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2026 lives in content/culture/2026.ts — keep them separate.
 */
export const personal2026: PersonalYearInput = {
  year: 2026,
  location: "Columbia, South Carolina",
  intro: "College senior. Still being written.",
  memories: [
    placeholder("What this year has been so far.", "memory", "2026-memory-1"),
  ],
  photos: [placeholder("A photo from 2026. Drop files in public/photos/2026/ and run npm run photos.", "photo", "2026-photo-1")],
  videos: [placeholder("A short clip from 2026: an mp4 in public/photos/2026/ or an unlisted YouTube link.", "video", "2026-video-1")],
  music: [placeholder("Your top songs of 2026 from Apple Music Replay.", "track", "2026-track-1")],
  interests: [placeholder("What you were into in 2026.", "item", "2026-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2026.", "item", "2026-screen-1")],
  tech: [placeholder("A device or app you used in 2026.", "item", "2026-tech-1")],
  milestones: [placeholder("A milestone from 2026. Only real ones.", "milestone", "2026-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
