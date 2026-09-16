/**
 * TEMPLATE — a fully filled-in example of every personal field.
 * Copy pieces of this into content/personal/<year>.ts. This file is not imported anywhere.
 * (The details below are illustrative examples, not Ethan's real history.)
 */
import { placeholder } from "@/lib/content/placeholders";
import type { PersonalYearInput } from "@/lib/content/schema";

export const personalTemplate: PersonalYearInput = {
  year: 2012,
  // Optional: force the layout. Years ≤ 2008 default to "fragment", later years to "full".
  mode: "full",
  // Optional: override the life-stage label from content/profile.ts for this year only.
  lifeStage: "Fourth grade",
  location: "Potomac, Maryland",
  intro: "The year of the first real camera and a very loud handheld.",

  memories: [
    {
      id: "2012-first-camera",
      title: "The camera in the drawer",
      body: "Two to four sentences. Write it like you'd tell a friend, not a resume.",
      date: "Summer 2012", // free text or ISO date
      photoId: "2012-photo-1", // optional: links this memory to a photo below
      tags: ["camera", "summer"],
    },
    // Leave a slot for later:
    placeholder("A memory from the winter.", "memory", "2012-memory-2"),
  ],

  photos: [
    {
      id: "2012-photo-1",
      src: "/photos/2012/camera.jpg", // put the file in public/photos/2012/ (strip EXIF first)
      width: 1600,
      height: 1200,
      alt: "A silver point-and-shoot camera on a wooden desk", // required
      caption: "Found in a drawer, still had the batteries in it.",
      takenAt: "2012-07-04",
      tags: ["camera"],
    },
  ],

  videos: [
    { id: "2012-video-1", src: "/photos/2012/birthday.mp4", caption: "The cake moment.", takenAt: "2012-02-10", tags: ["birthday"] },
    { id: "2012-video-2", src: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", caption: "An unlisted upload.", tags: [] },
  ],

  music: [
    {
      id: "2012-track-1",
      title: "Song Title",
      artist: "Artist",
      album: "Album",
      art: "/music/art/song-title.jpg", // optional, your own file
      source: { type: "spotify", url: "https://open.spotify.com/track/..." },
      // other sources: { type: "local", src: "/music/2012/song.mp3" }
      //                { type: "preview", src: "/music/2012/song-preview.mp3" }
      //                { type: "apple", url: "https://music.apple.com/..." }
      //                { type: "youtube", url: "https://www.youtube.com/watch?v=..." }
      personal: true,
      note: "Played this on repeat on the bus.",
      tags: ["pop"],
    },
  ],

  interests: [
    { label: "Skateboarding", kind: "sport", icon: "skateboard", note: "Mostly falling." },
    { label: "Building things in Minecraft", kind: "game", icon: "controller" },
  ],
  onMyScreen: [
    { label: "A cartoon", kind: "show", icon: "tv" },
    { label: "A YouTube channel", kind: "youtube", icon: "video" },
  ],
  tech: [
    { label: "Family desktop", kind: "computer", icon: "desktop" },
    { label: "A handheld console", kind: "console", icon: "ds" },
  ],

  milestones: [
    { id: "2012-school", title: "Started a new school", date: "2012-08", kind: "school", tags: ["school"] },
  ],

  // Small objects shown in the Time Capsule module (personal: true marks yours vs cultural ones).
  capsule: [{ label: "Blue backpack", icon: "backpack", personal: true }],

  links: [{ label: "A related link", url: "https://example.com" }],
  tags: ["camera", "school"],
};
