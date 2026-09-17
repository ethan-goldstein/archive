/**
 * Music ingest (macOS only).  Usage:  npm run music
 *
 * Reads the Music app's library over AppleScript (read-only: titles, artists, play counts, date added,
 * and the contents of your own playlists) and writes content/generated/music.json, which every year
 * page merges in automatically.
 *
 * Apple Music Replay lists are not stored in the library, so this is the honest proxy:
 *   - per year: the most played songs among those ADDED to the library that year;
 *   - for the fall and summer chapters: the most played songs added that year that also sit in your own
 *     seasonal playlists (FALL_PLAYLISTS / SUMMER_PLAYLISTS below).
 * Play counts are lifetime counts, not per-year counts. The site says so.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const FALL_PLAYLISTS = ["elder fall", "october", "oVo🎃"];
const SUMMER_PLAYLISTS = ["summer "];
const TOP = 8, SEASONAL = 5, MIN_PLAYS = 5;
const SEP = " ||| ";

const jxa = `
const M = Application("Music");
const t = M.libraryPlaylists[0].tracks;
const n = t.name(), a = t.artist(), al = t.album(), p = t.playedCount(), d = t.dateAdded();
const tracks = n.map((x, i) => ({ n: x, a: a[i], al: al[i], p: p[i], d: d[i] ? d[i].toISOString().slice(0, 10) : null }));
const lists = {};
for (const pl of M.userPlaylists()) { const tt = pl.tracks; const nn = tt.name(), aa = tt.artist(); lists[pl.name()] = nn.map((x, i) => x + "${SEP}" + aa[i]); }
JSON.stringify({ tracks, lists });
`;
const { tracks, lists } = JSON.parse(execFileSync("osascript", ["-l", "JavaScript", "-e", jxa], { maxBuffer: 256 * 1024 * 1024 }).toString());
const key = (t) => `${t.n}${SEP}${t.a}`;
const inAny = (names) => { const s = new Set(); for (const n of names) for (const k of lists[n] ?? []) s.add(k); return s; };
const fall = inAny(FALL_PLAYLISTS), summer = inAny(SUMMER_PLAYLISTS);
const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "track";
const search = (t) => `https://music.apple.com/us/search?term=${encodeURIComponent(`${t.n} ${t.a}`)}`;

const byYear = {};
for (const t of tracks) { if (!t.d || !t.n || !t.a || t.p < MIN_PLAYS) continue; (byYear[t.d.slice(0, 4)] ??= []).push(t); }

const out = {};
for (const [year, list] of Object.entries(byYear).sort()) {
  list.sort((x, y) => y.p - x.p);
  const used = new Set(), ids = new Set(), rows = [];
  const push = (t, season) => {
    let id = `${year}-${slug(`${t.n}-${t.a}`)}`; while (ids.has(id)) id += "-2"; ids.add(id); used.add(key(t));
    rows.push({ id, title: t.n, artist: t.a, album: t.al || undefined, plays: t.p, season, source: { type: "apple", url: search(t) } });
  };
  for (const t of list.slice(0, TOP)) push(t, undefined);
  for (const t of list.filter((t) => fall.has(key(t)) && !used.has(key(t))).slice(0, SEASONAL)) push(t, "fall");
  for (const t of list.filter((t) => summer.has(key(t)) && !used.has(key(t))).slice(0, SEASONAL)) push(t, "summer");
  out[year] = rows;
  console.log(`${year}: ${rows.length} tracks (top: ${rows[0]?.title} by ${rows[0]?.artist}, ${rows[0]?.plays} plays)`);
}
writeFileSync("content/generated/music.json", JSON.stringify(out, null, 1) + "\n");
console.log("wrote content/generated/music.json");
