import { z } from "zod";

/**
 * Source of truth for every piece of archive content.
 * Personal content (content/personal/<year>.ts) and cultural context
 * (content/culture/<year>.ts) are validated separately, then merged by getYear().
 */

export const ERA_IDS = ["xp", "aero", "flat", "dark", "glass"] as const;
export const EraIdSchema = z.enum(ERA_IDS);
export type EraId = z.infer<typeof EraIdSchema>;

export const PLACEHOLDER_KINDS = [
  "text",
  "memory",
  "photo",
  "video",
  "track",
  "milestone",
  "location",
  "item",
] as const;

/** A clearly-marked slot for personal content Ethan has not supplied yet. */
export const PlaceholderSchema = z.object({
  placeholder: z.literal(true),
  id: z.string().optional(),
  hint: z.string(),
  kind: z.enum(PLACEHOLDER_KINDS).default("text"),
});
export type Placeholder = z.infer<typeof PlaceholderSchema>;

const field = <T extends z.ZodTypeAny>(inner: T) => z.union([inner, PlaceholderSchema]);
const Tags = z.array(z.string()).default([]);

export const ICON_NAMES = [
  "folder", "floppy", "cd", "cassette", "vinyl", "ipod", "ipod-touch", "iphone", "flip-phone",
  "phone", "tablet", "laptop", "desktop", "crt", "tv", "camera", "camcorder", "film", "polaroid",
  "ds", "wii", "xbox", "playstation", "psp", "switch", "controller", "arcade", "headphones",
  "earbuds", "speaker", "music", "play", "pause", "shuffle", "note", "mic", "globe", "chat",
  "mail", "at", "heart", "star", "sparkle", "pin", "calendar", "clock", "search", "info",
  "volume", "mute", "close", "arrow-left", "arrow-right", "cloud", "rocket", "video", "blog",
  "ghost", "bird", "reel", "stream", "headset", "watch", "ai", "wifi", "battery", "bin",
  "window", "cursor", "keyboard", "mouse", "printer", "book", "backpack", "ball", "trophy",
  "ticket", "car", "plane", "house", "cake", "gift", "toy", "lego", "skateboard", "bike",
  "pizza", "sun", "moon", "snow", "leaf", "flag", "map", "key", "lock", "bug", "smile",
] as const;
export const IconNameSchema = z.enum(ICON_NAMES);
export type IconName = z.infer<typeof IconNameSchema>;

export const ITEM_KINDS = [
  "hobby", "sport", "game", "show", "movie", "youtube", "toy", "site", "app", "device",
  "console", "computer", "phone", "trend", "meme", "product", "fashion", "slang", "music",
  "event", "book", "food", "place", "other",
] as const;
export const ItemKindSchema = z.enum(ITEM_KINDS);
export type ItemKind = z.infer<typeof ItemKindSchema>;

export const ItemSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  kind: ItemKindSchema.default("other"),
  note: z.string().optional(),
  icon: IconNameSchema.optional(),
  url: z.string().url().optional(),
  tags: Tags,
});
export type Item = z.infer<typeof ItemSchema>;

export const MemorySchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  date: z.string().optional(),
  photoId: z.string().optional(),
  tags: Tags,
});
export type Memory = z.infer<typeof MemorySchema>;

export const GALLERY_STYLES = ["camera-roll", "album", "grid", "feed", "cinematic"] as const;
export const GalleryStyleSchema = z.enum(GALLERY_STYLES);
export type GalleryStyle = z.infer<typeof GalleryStyleSchema>;

export const PhotoSchema = z.object({
  id: z.string(),
  src: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: z.string().min(1, "Every photo needs alt text"),
  caption: z.string().optional(),
  takenAt: z.string().optional(),
  blurDataURL: z.string().optional(),
  tags: Tags,
});
export type Photo = z.infer<typeof PhotoSchema>;

export const VideoSchema = z.object({
  id: z.string(),
  /** local file under public/photos/<year>/ or a YouTube url */
  src: z.string(),
  poster: z.string().optional(),
  caption: z.string().optional(),
  takenAt: z.string().optional(),
  tags: Tags,
});
export type Video = z.infer<typeof VideoSchema>;

export const TrackSourceSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("local"), src: z.string() }),
  z.object({ type: z.literal("preview"), src: z.string() }),
  z.object({ type: z.literal("spotify"), url: z.string().url() }),
  z.object({ type: z.literal("apple"), url: z.string().url() }),
  z.object({ type: z.literal("youtube"), url: z.string().url() }),
]);
export type TrackSource = z.infer<typeof TrackSourceSchema>;

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  art: z.string().optional(),
  source: TrackSourceSchema.optional(),
  /** true = Ethan's own pick; false = cultural chart context */
  personal: z.boolean().default(false),
  note: z.string().optional(),
  tags: Tags,
});
export type Track = z.infer<typeof TrackSchema>;

export const MILESTONE_KINDS = ["school", "move", "achievement", "travel", "life", "other"] as const;
export const MilestoneSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string().optional(),
  date: z.string().optional(),
  kind: z.enum(MILESTONE_KINDS).default("life"),
  tags: Tags,
});
export type Milestone = z.infer<typeof MilestoneSchema>;

export const CapsuleObjectSchema = z.object({
  id: z.string().optional(),
  label: z.string(),
  icon: IconNameSchema,
  note: z.string().optional(),
  personal: z.boolean().default(false),
});
export type CapsuleObject = z.infer<typeof CapsuleObjectSchema>;

export const LinkSchema = z.object({ label: z.string(), url: z.string().url() });
export type Link = z.infer<typeof LinkSchema>;

export const YEAR_MODES = ["fragment", "full"] as const;

/** What Ethan writes in content/personal/<year>.ts. Everything optional. */
export const PersonalYearSchema = z.object({
  year: z.number().int(),
  mode: z.enum(YEAR_MODES).optional(),
  lifeStage: z.string().optional(),
  location: field(z.string()).optional(),
  intro: field(z.string()).optional(),
  memories: z.array(z.union([MemorySchema, PlaceholderSchema])).default([]),
  photos: z.array(z.union([PhotoSchema, PlaceholderSchema])).default([]),
  videos: z.array(z.union([VideoSchema, PlaceholderSchema])).default([]),
  music: z.array(z.union([TrackSchema, PlaceholderSchema])).default([]),
  interests: z.array(z.union([ItemSchema, PlaceholderSchema])).default([]),
  onMyScreen: z.array(z.union([ItemSchema, PlaceholderSchema])).default([]),
  tech: z.array(z.union([ItemSchema, PlaceholderSchema])).default([]),
  milestones: z.array(z.union([MilestoneSchema, PlaceholderSchema])).default([]),
  capsule: z.array(CapsuleObjectSchema).default([]),
  links: z.array(LinkSchema).default([]),
  tags: Tags,
});
export type PersonalYearInput = z.input<typeof PersonalYearSchema>;
export type PersonalYear = z.infer<typeof PersonalYearSchema>;

/** General cultural context, written by the archive, never personal. */
export const CultureYearSchema = z.object({
  year: z.number().int(),
  headline: z.string(),
  blurb: z.string(),
  design: z.string(),
  internet: z.array(ItemSchema).default([]),
  tech: z.array(ItemSchema).default([]),
  games: z.array(ItemSchema).default([]),
  onScreen: z.array(ItemSchema).default([]),
  music: z.array(TrackSchema).default([]),
  culture: z.array(ItemSchema).default([]),
  capsule: z.array(CapsuleObjectSchema).default([]),
});
export type CultureYearInput = z.input<typeof CultureYearSchema>;
export type CultureYear = z.infer<typeof CultureYearSchema>;

/** Merged, derived, validated: what every component receives. */
export interface YearData {
  year: number;
  era: EraId;
  age: number;
  ageLabel: string;
  lifeStage: string;
  lifeStageIsPlaceholder: boolean;
  mode: (typeof YEAR_MODES)[number];
  location: string | Placeholder;
  intro: string | Placeholder;
  personal: PersonalYear;
  culture: CultureYear;
  tags: string[];
  placeholderCount: number;
}
