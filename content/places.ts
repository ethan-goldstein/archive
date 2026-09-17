/**
 * MEMORY MAP — places tied to Ethan's life. Street names only, no house numbers (public site).
 * Coordinates are approximate neighbourhood/school locations from public map data.
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
  { id: "shady-grove", label: "Shady Grove Hospital", short: "Shady Grove", lat: 39.11, lng: -77.183, from: 2005, to: 2005, kind: "other", note: "Born here, February 10, 2005." },
  { id: "olney", label: "Olney, Maryland", short: "Olney", lat: 39.153, lng: -77.067, from: 2005, to: 2008, kind: "home", note: "The first house." },
  { id: "wooden-bridge", label: "Wooden Bridge Road, Cold Spring, Potomac", short: "Cold Spring", lat: 39.047, lng: -77.19, from: 2009, to: 2013, kind: "home", note: "A massive basement, a pool, and Fenway." },
  { id: "paddock", label: "Paddock Lane, Cold Spring, Potomac", short: "Paddock Ln", lat: 39.05, lng: -77.186, from: 2014, to: 2025, kind: "home", note: "Same neighbourhood, from 4th grade until I was 20." },
  { id: "cold-spring-es", label: "Cold Spring Elementary School", short: "Cold Spring ES", lat: 39.047, lng: -77.187, from: 2010, to: 2016, kind: "school", note: "Kindergarten through 5th grade." },
  { id: "cabin-john-ms", label: "Cabin John Middle School", short: "Cabin John MS", lat: 39.038, lng: -77.145, from: 2016, to: 2019, kind: "school", note: "6th through 8th." },
  { id: "wootton-hs", label: "Wootton High School", short: "Wootton", lat: 39.061, lng: -77.18, from: 2019, to: 2023, kind: "school", note: "Class of 2023. Baseball." },
  { id: "usc", label: "University of South Carolina, Columbia", short: "USC, Columbia", lat: 33.994, lng: -81.03, from: 2023, to: 2027, kind: "school", note: "2023 to 2027." },
];

/** EDIT: turn these into real entries above. */
export const placePlaceholders: { hint: string; kind: PlaceKind }[] = [
  { hint: "The Baseball Zone (Chris's dad's place, where I was a manager 2021 to 2024): add the town and it becomes a pin.", kind: "other" },
  { hint: "The synagogue where you did preschool.", kind: "school" },
  { hint: "A trip you still think about.", kind: "trip" },
  { hint: "Where family lives and you spent holidays.", kind: "family" },
];
