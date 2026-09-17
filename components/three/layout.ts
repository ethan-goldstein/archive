import type { Season } from "@/lib/content/seasons";

/** The four season sets sit side by side along X, far enough apart that fog hides the neighbours. */
export const SET_GAP = 90;
export const SET_X: Record<Season, number> = { winter: 0, spring: SET_GAP, summer: SET_GAP * 2, fall: SET_GAP * 3 };
