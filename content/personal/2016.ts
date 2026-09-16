import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2016 — PERSONAL CONTENT (age 11)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2016 lives in content/culture/2016.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2016: PersonalYearInput = {
  year: 2016,
  location: placeholder("Where you lived in 2016 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2016 for you."),
  memories: [
    placeholder("Something that happened in 2016 that you still think about. 2–4 sentences.", "memory", "2016-memory-1"),
    placeholder("Another memory from 2016.", "memory", "2016-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2016. Drop the file in public/photos/2016/ and fill in src, width, height, alt.", "photo", "2016-photo-1"),
    placeholder("Another photo from 2016.", "photo", "2016-photo-2"),
    placeholder("Another photo from 2016.", "photo", "2016-photo-3"),
  ],
  videos: [placeholder("A short clip from 2016: a local mp4 in public/photos/2016/ or an unlisted YouTube link.", "video", "2016-video-1")],
  music: [placeholder("A song you actually listened to in 2016. Add a Spotify/Apple/YouTube url or a local file.", "track", "2016-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2016.", "item", "2016-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2016.", "item", "2016-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2016.", "item", "2016-tech-1")],
  milestones: [placeholder("A milestone from 2016: school, a move, a trip, an achievement. Only real ones.", "milestone", "2016-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
