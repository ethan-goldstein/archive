import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2016 — PERSONAL CONTENT (age 11). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2016 lives in content/culture/2016.ts — keep them separate.
 */
export const personal2016: PersonalYearInput = {
  year: 2016,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Sixth grade at Cabin John Middle School.",
  memories: [
    {"id": "2016-cabin-john", "title": "New names at Cabin John", "body": "The elementary crew came with me, and middle school added Ryan, Justin, Justin, Wyatt, Mace, Chris and Zane.", "tags": ["friends", "school"]},
  ],
  photos: [placeholder("A photo from 2016. Drop files in public/photos/2016/ and run npm run photos.", "photo", "2016-photo-1")],
  videos: [placeholder("A short clip from 2016: an mp4 in public/photos/2016/ or an unlisted YouTube link.", "video", "2016-video-1")],
  music: [placeholder("Your top songs of 2016 from Apple Music Replay.", "track", "2016-track-1")],
  interests: [placeholder("What you were into in 2016.", "item", "2016-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2016.", "item", "2016-screen-1")],
  tech: [placeholder("A device or app you used in 2016.", "item", "2016-tech-1")],
  milestones: [{"id": "2016-ms", "title": "Started Cabin John Middle School", "kind": "school", "date": "2016-08", "body": "6th through 8th grade.", "tags": ["school", "cabin-john"]}],
  capsule: [],
  links: [],
  tags: [],
};
