import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2020 — PERSONAL CONTENT (age 15). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2020 lives in content/culture/2020.ts — keep them separate.
 */
export const personal2020: PersonalYearInput = {
  year: 2020,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Sophomore year, most of it at home.",
  memories: [
    placeholder("A sophomore-year memory: what the lockdown year was actually like for you.", "memory", "2020-memory-1"),
  ],
  photos: [placeholder("A photo from 2020. Drop files in public/photos/2020/ and run npm run photos.", "photo", "2020-photo-1")],
  videos: [placeholder("A short clip from 2020: an mp4 in public/photos/2020/ or an unlisted YouTube link.", "video", "2020-video-1")],
  music: [placeholder("Your top songs of 2020 from Apple Music Replay.", "track", "2020-track-1")],
  interests: [{"label": "Baseball", "kind": "sport", "icon": "ball", "note": "Training with Antonio, Josh, Chris and Zane."}],
  onMyScreen: [placeholder("What you watched or played on repeat in 2020.", "item", "2020-screen-1")],
  tech: [placeholder("A device or app you used in 2020.", "item", "2020-tech-1")],
  milestones: [placeholder("A milestone from 2020. Only real ones.", "milestone", "2020-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
