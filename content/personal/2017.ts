import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2017 — PERSONAL CONTENT (age 12). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2017 lives in content/culture/2017.ts — keep them separate.
 */
export const personal2017: PersonalYearInput = {
  year: 2017,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Seventh grade.",
  memories: [
    placeholder("A seventh-grade memory.", "memory", "2017-memory-1"),
  ],
  photos: [placeholder("A photo from 2017. Drop files in public/photos/2017/ and run npm run photos.", "photo", "2017-photo-1")],
  videos: [placeholder("A short clip from 2017: an mp4 in public/photos/2017/ or an unlisted YouTube link.", "video", "2017-video-1")],
  music: [placeholder("Your top songs of 2017 from Apple Music Replay.", "track", "2017-track-1")],
  interests: [placeholder("What you were into in 2017.", "item", "2017-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2017.", "item", "2017-screen-1")],
  tech: [placeholder("A device or app you used in 2017.", "item", "2017-tech-1")],
  milestones: [placeholder("A milestone from 2017. Only real ones.", "milestone", "2017-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
