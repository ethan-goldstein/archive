import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2017 — PERSONAL CONTENT (age 12)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2017 lives in content/culture/2017.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2017: PersonalYearInput = {
  year: 2017,
  location: placeholder("Where you lived in 2017 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2017 for you."),
  memories: [
    placeholder("Something that happened in 2017 that you still think about. 2–4 sentences.", "memory", "2017-memory-1"),
    placeholder("Another memory from 2017.", "memory", "2017-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2017. Drop the file in public/photos/2017/ and fill in src, width, height, alt.", "photo", "2017-photo-1"),
    placeholder("Another photo from 2017.", "photo", "2017-photo-2"),
    placeholder("Another photo from 2017.", "photo", "2017-photo-3"),
  ],
  videos: [placeholder("A short clip from 2017: a local mp4 in public/photos/2017/ or an unlisted YouTube link.", "video", "2017-video-1")],
  music: [placeholder("A song you actually listened to in 2017. Add a Spotify/Apple/YouTube url or a local file.", "track", "2017-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2017.", "item", "2017-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2017.", "item", "2017-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2017.", "item", "2017-tech-1")],
  milestones: [placeholder("A milestone from 2017: school, a move, a trip, an achievement. Only real ones.", "milestone", "2017-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
