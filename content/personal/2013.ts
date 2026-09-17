import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2013 — PERSONAL CONTENT (age 8). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2013 lives in content/culture/2013.ts — keep them separate.
 */
export const personal2013: PersonalYearInput = {
  year: 2013,
  location: "Wooden Bridge Road, Cold Spring, Potomac",
  intro: "Third grade. The year we lost Fenway.",
  memories: [
    {"id": "2013-fenway", "title": "Losing Fenway", "body": "Our first dog passed when I was in third grade.", "date": "3rd grade (2013–14)", "tags": ["fenway", "family"]},
  ],
  photos: [placeholder("A photo from 2013. Drop files in public/photos/2013/ and run npm run photos.", "photo", "2013-photo-1")],
  videos: [placeholder("A short clip from 2013: an mp4 in public/photos/2013/ or an unlisted YouTube link.", "video", "2013-video-1")],
  music: [placeholder("A song that was always on in the house in 2013.", "track", "2013-track-1")],
  interests: [placeholder("What you were into in 2013.", "item", "2013-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2013.", "item", "2013-screen-1")],
  tech: [placeholder("A device or app you used in 2013.", "item", "2013-tech-1")],
  milestones: [{"id": "2013-fenway", "title": "Fenway passed", "kind": "life", "date": "2013–14 school year", "body": "Third grade. Year to confirm: 2013 or 2014.", "tags": ["fenway"]}],
  capsule: [],
  links: [],
  tags: [],
};
