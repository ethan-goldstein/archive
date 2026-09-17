import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2019 — PERSONAL CONTENT (age 14). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2019 lives in content/culture/2019.ts — keep them separate.
 */
export const personal2019: PersonalYearInput = {
  year: 2019,
  location: "Paddock Lane, Cold Spring, Potomac",
  intro: "Freshman year at Wootton. Baseball became a daily thing.",
  memories: [
    {"id": "2019-wootton", "title": "Wootton", "body": "Jake, Ryan, Jake, Ethan, Harel, Eli, Peter, and more.", "tags": ["friends", "school"]},
    {"id": "2019-zone", "title": "The Baseball Zone", "body": "My baseball guys: Antonio, who I met in high school, Josh, Chris and Zane. We trained every day at Chris's dad's place, The Baseball Zone. I worked there in high school too.", "tags": ["baseball", "friends"]},
    {"id": "2019-older", "title": "The older guys", "body": "Brady and James were a year above us and I was close with them, and with their friends who played other sports, Ian and Nate.", "tags": ["friends"]},
  ],
  photos: [placeholder("A photo from 2019. Drop files in public/photos/2019/ and run npm run photos.", "photo", "2019-photo-1")],
  videos: [placeholder("A short clip from 2019: an mp4 in public/photos/2019/ or an unlisted YouTube link.", "video", "2019-video-1")],
  music: [placeholder("Your top songs of 2019 from Apple Music Replay.", "track", "2019-track-1")],
  interests: [{"label": "Baseball", "kind": "sport", "icon": "ball", "note": "Every day, at The Baseball Zone."}, {"label": "The Baseball Zone", "kind": "place", "icon": "trophy", "note": "Chris's dad's place. Training, and later a job."}],
  onMyScreen: [placeholder("What you watched or played on repeat in 2019.", "item", "2019-screen-1")],
  tech: [placeholder("A device or app you used in 2019.", "item", "2019-tech-1")],
  milestones: [{"id": "2019-hs", "title": "Started Wootton High School", "kind": "school", "date": "2019-08", "tags": ["school", "wootton"]}],
  capsule: [],
  links: [],
  tags: [],
};
