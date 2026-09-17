import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2021 — PERSONAL CONTENT (age 16). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2021 lives in content/culture/2021.ts — keep them separate.
 */
export const personal2021: PersonalYearInput = {
  year: 2021,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Junior year.",
  memories: [
    {"id": "2021-team", "title": "Wootton baseball", "body": "Ryan and Josh were my Wootton teammates.", "tags": ["baseball", "friends"]},
  ],
  photos: [placeholder("A photo from 2021. Drop files in public/photos/2021/ and run npm run photos.", "photo", "2021-photo-1")],
  videos: [placeholder("A short clip from 2021: an mp4 in public/photos/2021/ or an unlisted YouTube link.", "video", "2021-video-1")],
  music: [placeholder("Your top songs of 2021 from Apple Music Replay.", "track", "2021-track-1")],
  interests: [{"label": "Baseball", "kind": "sport", "icon": "ball"}, {"label": "Working at The Baseball Zone", "kind": "hobby", "icon": "trophy"}],
  onMyScreen: [placeholder("What you watched or played on repeat in 2021.", "item", "2021-screen-1")],
  tech: [placeholder("A device or app you used in 2021.", "item", "2021-tech-1")],
  milestones: [{"id": "2021-job", "title": "Worked at The Baseball Zone", "kind": "other", "date": "High school (years to confirm)", "tags": ["baseball", "work"]}],
  capsule: [],
  links: [],
  tags: [],
};
