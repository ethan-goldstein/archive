import type { Placeholder } from "./schema";

type Kind = Placeholder["kind"];

/**
 * Marks a slot that Ethan will fill in later. The hint says what belongs there.
 * Rendered by <Placeholder/> with an EDIT badge pointing at the content file.
 */
export function placeholder(hint: string, kind: Kind = "text", id?: string): Placeholder {
  return { placeholder: true, hint, kind, id };
}

export function isPlaceholder(value: unknown): value is Placeholder {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as { placeholder?: unknown }).placeholder === true
  );
}

/** Split a mixed array into real entries and placeholders, preserving order info. */
export function partition<T>(items: Array<T | Placeholder>): { real: T[]; placeholders: Placeholder[] } {
  const real: T[] = [];
  const placeholders: Placeholder[] = [];
  for (const item of items) {
    if (isPlaceholder(item)) placeholders.push(item);
    else real.push(item as T);
  }
  return { real, placeholders };
}
