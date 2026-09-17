import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

/**
 * 2009 — PERSONAL CONTENT (age 4). Facts as Ethan gave them; first names only, street names only.
 * Cultural context for 2009 lives in content/culture/2009.ts — keep them separate.
 */
export const personal2009: PersonalYearInput = {
  year: 2009,
  location: "Wooden Bridge Road, Cold Spring, Potomac",
  intro: "We moved to the Cold Spring neighbourhood, to a house on Wooden Bridge Road with a massive basement and a pool.",
  memories: [
    {"id": "2009-house", "title": "The basement and the pool", "body": "The Wooden Bridge Road house had a sweet, massive basement and a pool. That basement is where a lot of the next few years happened.", "tags": ["home", "pool", "basement"]},
    {"id": "2009-fenway", "title": "Fenway", "body": "Our first dog. He was there for the Wooden Bridge years.", "tags": ["fenway", "family"]},
  ],
  photos: [placeholder("A photo from 2009. Drop files in public/photos/2009/ and run npm run photos.", "photo", "2009-photo-1")],
  videos: [placeholder("A short clip from 2009: an mp4 in public/photos/2009/ or an unlisted YouTube link.", "video", "2009-video-1")],
  music: [placeholder("A song that was always on in the house in 2009.", "track", "2009-track-1")],
  interests: [placeholder("What you were into in 2009.", "item", "2009-interest-1")],
  onMyScreen: [placeholder("What you watched or played on repeat in 2009.", "item", "2009-screen-1")],
  tech: [placeholder("A device or app you used in 2009.", "item", "2009-tech-1")],
  milestones: [{"id": "2009-move", "title": "Moved to Wooden Bridge Road", "kind": "move", "date": "2009", "body": "Cold Spring neighbourhood, Potomac. Age four, probably.", "tags": ["move", "cold-spring"]}],
  capsule: [{"label": "The pool", "icon": "sun", "personal": true}, {"label": "The basement", "icon": "house", "personal": true}, {"label": "Fenway", "icon": "heart", "personal": true}],
  links: [],
  tags: [],
};
