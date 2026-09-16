import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2014 — PERSONAL CONTENT (age 9)
 * Everything in this file is Ethan's. Replace each placeholder(...) with real content.
 * Cultural context for 2014 lives in content/culture/2014.ts — keep them separate.
 * See content/_TEMPLATE.personal.ts for a filled-in example of every field.
 */
export const personal2014: PersonalYearInput = {
  year: 2014,
  location: placeholder("Where you lived in 2014 (city, state).", "location"),
  intro: placeholder("One or two sentences that sum up 2014 for you."),
  memories: [
    placeholder("Something that happened in 2014 that you still think about. 2–4 sentences.", "memory", "2014-memory-1"),
    placeholder("Another memory from 2014.", "memory", "2014-memory-2"),
  ],
  photos: [
    placeholder("A photo from 2014. Drop the file in public/photos/2014/ and fill in src, width, height, alt.", "photo", "2014-photo-1"),
    placeholder("Another photo from 2014.", "photo", "2014-photo-2"),
    placeholder("Another photo from 2014.", "photo", "2014-photo-3"),
  ],
  videos: [placeholder("A short clip from 2014: a local mp4 in public/photos/2014/ or an unlisted YouTube link.", "video", "2014-video-1")],
  music: [placeholder("A song you actually listened to in 2014. Add a Spotify/Apple/YouTube url or a local file.", "track", "2014-track-1")],
  interests: [placeholder("A hobby, sport, game, show, or website you were into in 2014.", "item", "2014-interest-1")],
  onMyScreen: [placeholder("Something you watched or played on repeat in 2014.", "item", "2014-screen-1")],
  tech: [placeholder("A device, console, or app you used in 2014.", "item", "2014-tech-1")],
  milestones: [placeholder("A milestone from 2014: school, a move, a trip, an achievement. Only real ones.", "milestone", "2014-milestone-1")],
  capsule: [],
  links: [],
  tags: [],
};
