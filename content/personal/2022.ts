import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2022 — PERSONAL CONTENT (age 17). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2022 lives in content/culture/2022.ts — keep them separate.
 */
export const personal2022: PersonalYearInput = {
  year: 2022,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Senior year at Wootton.",
  memories: [
    placeholder("A senior-year memory.", "memory", "2022-memory-1"),
  ],
  photos: [placeholder("A photo from 2022. Drop files in public/photos/2022/ and run npm run photos.", "photo", "2022-photo-1")],
  videos: [placeholder("A short clip from 2022: an mp4 in public/photos/2022/ or an unlisted YouTube link.", "video", "2022-video-1")],
  music: [placeholder("Your top songs of 2022 from Apple Music Replay.", "track", "2022-track-1")],
  interests: [{"label": "Baseball", "kind": "sport", "icon": "ball"}],
  onMyScreen: [placeholder("What you watched or played on repeat in 2022.", "item", "2022-screen-1")],
  tech: [placeholder("A device or app you used in 2022.", "item", "2022-tech-1")],
  milestones: [placeholder("A milestone from 2022. Only real ones.", "milestone", "2022-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
