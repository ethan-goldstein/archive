import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2025 — PERSONAL CONTENT (age 20). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2025 lives in content/culture/2025.ts — keep them separate.
 */
export const personal2025: PersonalYearInput = {
  year: 2025,
  location: "Columbia, South Carolina",
  intro: "College junior, and the last year of Paddock Lane.",
  memories: [
    placeholder("A memory from the last summer at Paddock Lane.", "memory", "2025-memory-1"),
  ],
  photos: [placeholder("A photo from 2025. Drop files in public/photos/2025/ and run npm run photos.", "photo", "2025-photo-1")],
  videos: [placeholder("A short clip from 2025: an mp4 in public/photos/2025/ or an unlisted YouTube link.", "video", "2025-video-1")],
  music: [placeholder("Your top songs of 2025 from Apple Music Replay.", "track", "2025-track-1")],
  interests: [placeholder("What you were into in 2025.", "item", "2025-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2025.", "item", "2025-screen-1")],
  tech: [placeholder("A device or app you used in 2025.", "item", "2025-tech-1")],
  milestones: [{"id": "2025-paddock", "title": "Left Paddock Lane", "kind": "move", "date": "2025", "body": "Lived there from 4th grade until I was 20.", "tags": ["move", "paddock"]}],
  capsule: [],
  links: [],
  tags: [],
};
