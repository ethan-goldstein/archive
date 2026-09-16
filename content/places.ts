/**
 * MEMORY MAP — places tied to Ethan's life. Only real places go in `places`.
 * Coordinates are decimal degrees. `from`/`to` are years; omit `to` for "still".
 * Placeholders describe what could go here and never become pins.
 */
export type PlaceKind = "home" | "school" | "trip" | "family" | "other";

export interface Place {
  id: string;
  label: string;
  short: string;
  lat: number;
  lng: number;
  from: number;
  to?: number;
  kind: PlaceKind;
  note?: string;
}

export const places: Place[] = [
  { id: "potomac", label: "Potomac, Maryland", short: "Potomac, MD", lat: 39.018, lng: -77.208, from: 2005, kind: "home", note: "Born here, February 10, 2005." },
];

/** EDIT: turn these into real entries above. */
export const placePlaceholders: { hint: string; kind: PlaceKind }[] = [
  { hint: "The house or neighbourhood you grew up in, if different from Potomac.", kind: "home" },
  { hint: "Your schools, with the years you were there.", kind: "school" },
  { hint: "A trip you still think about.", kind: "trip" },
  { hint: "Where family lives and you spent holidays.", kind: "family" },
  { hint: "College, or wherever 2023 onward happened.", kind: "school" },
];
