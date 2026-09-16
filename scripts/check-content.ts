/**
 * Validates every year's personal + cultural content against the schema,
 * then prints a table of what is filled in and what is still a placeholder.
 * Run: npm run check:content   (also runs in prebuild)
 */
import { getAllYears } from "../lib/content/getYear";
import { isPlaceholder } from "../lib/content/placeholders";
import { profile } from "../content/profile";

function count<T>(arr: Array<T>, real: boolean): number {
  return arr.filter((x) => (real ? !isPlaceholder(x) : isPlaceholder(x))).length;
}

try {
  const years = getAllYears();
  const rows = years.map((y) => ({
    year: y.year,
    age: y.age,
    era: y.era,
    mode: y.mode,
    memories: count(y.personal.memories, true),
    photos: count(y.personal.photos, true),
    videos: count(y.personal.videos, true),
    tracks: count(y.personal.music, true),
    milestones: count(y.personal.milestones, true),
    placeholders: y.placeholderCount,
    culture: y.culture.internet.length + y.culture.tech.length + y.culture.games.length +
      y.culture.onScreen.length + y.culture.culture.length + y.culture.music.length,
  }));
  console.table(rows);
  const totalPlaceholders = rows.reduce((n, r) => n + r.placeholders, 0);
  const totalCulture = rows.reduce((n, r) => n + r.culture, 0);
  console.log(`\n${years.length} years validated. ${totalPlaceholders} personal placeholders remaining. ${totalCulture} cultural items.`);
  const stagePlaceholders = profile.lifeStages.filter((s) => s.placeholder).length;
  if (stagePlaceholders) console.log(`${stagePlaceholders} life-stage labels are still assumptions (content/profile.ts).`);
} catch (err) {
  console.error("Content validation failed:\n", err);
  process.exit(1);
}
