import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2012 — PERSONAL CONTENT (age 7). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2012 lives in content/culture/2012.ts — keep them separate.
 */
export const personal2012: PersonalYearInput = {
  year: 2012,
  location: "Wooden Bridge Road, Cold Spring, Potomac",
  intro: "Second grade.",
  memories: [
    placeholder("A second-grade memory: something in the basement, something at the pool.", "memory", "2012-memory-1"),
  ],
  photos: [placeholder("A photo from 2012. Drop files in public/photos/2012/ and run npm run photos.", "photo", "2012-photo-1")],
  videos: [placeholder("A short clip from 2012: an mp4 in public/photos/2012/ or an unlisted YouTube link.", "video", "2012-video-1")],
  music: [placeholder("A song that was always on in the house in 2012.", "track", "2012-track-1")],
  interests: [placeholder("What you were into in 2012.", "item", "2012-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2012.", "item", "2012-screen-1")],
  tech: [placeholder("A device or app you used in 2012.", "item", "2012-tech-1")],
  milestones: [placeholder("A milestone from 2012. Only real ones.", "milestone", "2012-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
