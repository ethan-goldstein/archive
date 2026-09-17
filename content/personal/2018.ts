import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2018 — PERSONAL CONTENT (age 13). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2018 lives in content/culture/2018.ts — keep them separate.
 */
export const personal2018: PersonalYearInput = {
  year: 2018,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Eighth grade, the last year at Cabin John.",
  memories: [
    placeholder("An eighth-grade memory.", "memory", "2018-memory-1"),
  ],
  photos: [placeholder("A photo from 2018. Drop files in public/photos/2018/ and run npm run photos.", "photo", "2018-photo-1")],
  videos: [placeholder("A short clip from 2018: an mp4 in public/photos/2018/ or an unlisted YouTube link.", "video", "2018-video-1")],
  music: [placeholder("Your top songs of 2018 from Apple Music Replay.", "track", "2018-track-1")],
  interests: [placeholder("What you were into in 2018.", "item", "2018-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2018.", "item", "2018-screen-1")],
  tech: [placeholder("A device or app you used in 2018.", "item", "2018-tech-1")],
  milestones: [{"id": "2018-ms-end", "title": "Finished Cabin John Middle School", "kind": "school", "date": "2019-06", "tags": ["school"]}],
  capsule: [],
  links: [],
  tags: [],
};
