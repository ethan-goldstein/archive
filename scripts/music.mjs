/**
 * Music ingest (macOS only).  Usage:  npm run music
 *
 * 1. Reads the Music app's library over AppleScript (read-only: titles, artists, play counts, date added,
 *    and the contents of your own playlists).
 * 2. Recovers DELETED playlists from the library backups macOS keeps in
 *    ~/Music/Music/Previous Libraries.localized/ (your own files; decoded locally, never uploaded).
 *    A recovered "Replay <year>" playlist is the real Apple Music Replay for that year, in rank order.
 * 3. Writes content/generated/music.json, which every year page merges in automatically.
 *
 * Where no Replay survives, the honest proxy is used and labelled on the site: the most played songs among
 * those ADDED that year, plus picks from your own seasonal playlists for the summer and fall chapters.
 * Play counts are lifetime counts, not per-year counts.
 */
import { execFileSync } from "node:child_process";
import { createDecipheriv } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { inflateSync } from "node:zlib";
import { homedir } from "node:os";
import path from "node:path";

const FALL_PLAYLISTS = ["elder fall", "october", "oVo🎃"];
const SUMMER_PLAYLISTS = ["summer "];
const TOP = 8, REPLAY_TOP = 10, SEASONAL = 5, MIN_PLAYS = 5;
const SEP = " ||| ";

/* ---------- 1. the live library ---------- */
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

/* ---------- 2. deleted playlists, from library backups ---------- */
function decodeLibrary(file) {
  const raw = readFileSync(file);
  if (raw.subarray(0, 4).toString() !== "hfma") throw new Error("not a music library");
  const headerLen = raw.readUInt32LE(4), maxCrypt = raw.readUInt32LE(84);
  const body = raw.subarray(headerLen);
  let n = Math.min(maxCrypt, body.length); n -= n % 16;
  const aes = createDecipheriv("aes-128-ecb", Buffer.from("BHUILuilfghuila3"), null); aes.setAutoPadding(false);
  return inflateSync(Buffer.concat([aes.update(body.subarray(0, n)), aes.final(), body.subarray(n)]));
}
function parseLibrary(d) {
  const byId = new Map(), playlists = [];
  let pos = 0, cur = null, kind = "";
  while (pos + 12 <= d.length) {
    const tag = d.subarray(pos, pos + 4).toString("latin1");
    const len = tag === "boma" ? d.readUInt32LE(pos + 8) : d.readUInt32LE(pos + 4);
    if (tag === "boma" && cur) {
      const sub = d.readUInt32LE(pos + 12);
      if (sub === 206 && kind === "p" && d.subarray(pos + 20, pos + 24).toString("latin1") === "ipfa") cur.ids.push(d.readBigUInt64LE(pos + 40));
      else if ([2, 3, 4, 200].includes(sub) && len > 36) {
        const sl = d.readUInt32LE(pos + 24), enc = d.readUInt32LE(pos + 20);
        const s = d.subarray(pos + 36, pos + 36 + sl).toString(enc === 1 ? "utf16le" : "utf8");
        if (kind === "t") cur[{ 2: "n", 3: "al", 4: "a" }[sub]] = s; else if (sub === 200) cur.name = s;
      }
    } else if (tag === "itma") { cur = { id: d.readBigUInt64LE(pos + 16) }; byId.set(cur.id, cur); kind = "t"; }
    else if (tag === "lpma") { cur = { name: "", ids: [] }; playlists.push(cur); kind = "p"; }
    if (len <= 0) break;
    pos += len;
  }
  return playlists.map((p) => ({ name: p.name, tracks: p.ids.map((i) => byId.get(i)).filter((t) => t?.n && t?.a) }));
}
const SYSTEM = new Set(["Library", "Music", "Music Videos", "TV & Movies", "Downloaded", "Genius", "Favorite Songs", "Hidden Cloud PlaylistOnly Tracks"]);
const recovered = {};
const backups = path.join(homedir(), "Music/Music/Previous Libraries.localized");
if (existsSync(backups)) {
  for (const dir of readdirSync(backups).filter((f) => f.endsWith(".musiclibrary")).sort()) {
    try {
      for (const p of parseLibrary(decodeLibrary(path.join(backups, dir, "Library.musicdb")))) {
        if (SYSTEM.has(p.name) || p.name in lists || !p.tracks.length || p.tracks.length > 2000 || /\.(net|com)|_\d+x\d+/.test(p.name)) continue;
        recovered[p.name] = { from: dir.match(/\[(\d{4}-\d{2}-\d{2})/)?.[1] ?? dir, tracks: p.tracks };
      }
    } catch (e) { console.warn(`skipped backup ${dir}: ${e.message}`); }
  }
}
for (const [name, r] of Object.entries(recovered)) console.log(`recovered deleted playlist "${name.trim()}" (${r.tracks.length} tracks, backup of ${r.from})`);

/* ---------- 3. one list per year ---------- */
const key = (t) => `${t.n}${SEP}${t.a}`;
const inAny = (names) => { const s = new Set(); for (const n of names) for (const k of lists[n] ?? []) s.add(k); return s; };
const fall = inAny(FALL_PLAYLISTS), summer = inAny(SUMMER_PLAYLISTS);
const playsOf = new Map(tracks.map((t) => [key(t), t.p]));
const slug = (s) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "track";
const search = (t) => `https://music.apple.com/us/search?term=${encodeURIComponent(`${t.n} ${t.a}`)}`;

const byYear = {};
for (const t of tracks) { if (!t.d || !t.n || !t.a || t.p < MIN_PLAYS) continue; (byYear[t.d.slice(0, 4)] ??= []).push(t); }
for (const name of Object.keys(recovered)) { const y = /^Replay (\d{4})$/.exec(name)?.[1]; if (y) byYear[y] ??= []; }

const out = {};
for (const [year, list] of Object.entries(byYear).sort()) {
  list.sort((x, y) => y.p - x.p);
  const used = new Set(), ids = new Set(), rows = [];
  const push = (t, extra) => {
    let id = `${year}-${slug(`${t.n}-${t.a}`)}`; while (ids.has(id)) id += "-2"; ids.add(id); used.add(key(t));
    rows.push({ id, title: t.n, artist: t.a, album: t.al || undefined, plays: playsOf.get(key(t)) ?? t.p, source: { type: "apple", url: search(t) }, ...extra });
  };
  const replay = recovered[`Replay ${year}`];
  if (replay) replay.tracks.slice(0, REPLAY_TOP).forEach((t, i) => push(t, { replayRank: i + 1 }));
  else for (const t of list.slice(0, TOP)) push(t, {});
  for (const t of list.filter((t) => fall.has(key(t)) && !used.has(key(t))).slice(0, SEASONAL)) push(t, { season: "fall" });
  for (const t of list.filter((t) => summer.has(key(t)) && !used.has(key(t))).slice(0, SEASONAL)) push(t, { season: "summer" });
  out[year] = rows;
  console.log(`${year}: ${rows.length} tracks${replay ? " (real Replay)" : ""}; first: ${rows[0]?.title} by ${rows[0]?.artist}`);
}
writeFileSync("content/generated/music.json", JSON.stringify(out, null, 1) + "\n");
console.log("wrote content/generated/music.json");
