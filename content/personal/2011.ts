import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2011 — PERSONAL CONTENT (age 6). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2011 lives in content/culture/2011.ts — keep them separate.
 */
export const personal2011: PersonalYearInput = {
  year: 2011,
  location: "Wooden Bridge Road, Cold Spring, Potomac",
  intro: "First grade.",
  memories: [
    {"id": "siblings", "title": "Older siblings", "body": "Jeremy is five years older, Kyra three and a half. I thought my brother was the coolest person alive and wanted to be him.", "tags": ["family", "jeremy", "kyra"]},
    placeholder("A first-grade memory.", "memory", "2011-memory-2"),
  ],
  photos: [placeholder("A photo from 2011. Drop files in public/photos/2011/ and run npm run photos.", "photo", "2011-photo-1")],
  videos: [placeholder("A short clip from 2011: an mp4 in public/photos/2011/ or an unlisted YouTube link.", "video", "2011-video-1")],
  music: [placeholder("A song that was always on in the house in 2011.", "track", "2011-track-1")],
  interests: [placeholder("What you were into in 2011.", "item", "2011-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2011.", "item", "2011-screen-1")],
  tech: [placeholder("A device or app you used in 2011.", "item", "2011-tech-1")],
  milestones: [placeholder("A milestone from 2011. Only real ones.", "milestone", "2011-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
