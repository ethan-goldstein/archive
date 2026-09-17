# Ethan Goldstein — Archive 2005–2026

An interactive digital time capsule: one page per year from 2005 to 2026, each a scroll through its four seasons over a
Three.js world. The site is clean and modern throughout; what changes with the year is rendering quality, from 240p in 2005
to 4K in 2026, the way screens actually improved.
It also ships **Potomac Sandlot**, an original 8-bit backyard baseball game at `/backyard`.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, three.js (react-three-fiber), Lenis and Motion. Deployed to GitHub Pages.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # validates content, then builds
npm run start      # serve the production build
```

Other scripts:

| Script | What it does |
|---|---|
| `npm run check:content` | Validates every year against the schema and prints what is filled in vs still a placeholder |
| `npm test` | Unit tests (age maths, eras, content invariants) |
| `npm run test:e2e` | Playwright smoke suite at desktop, tablet, and phone widths (starts the server for you) |
| `node scripts/screenshots.mjs <dir>` | Screenshots of every key screen, for a visual check |
| `npm run lint` / `npm run typecheck` | ESLint / `tsc --noEmit` |

## How to add your life

Everything personal lives in `content/personal/<year>.ts`. Cultural context lives in `content/culture/<year>.ts`
and is deliberately separate: it describes the world that year, never what you did.
Dashed "EDIT" slots on the site are `placeholder(...)` calls in the personal files; replace them with real entries and they disappear.
`content/_TEMPLATE.personal.ts` shows a filled-in example of every field.

### A memory

```ts
memories: [
  {
    id: "2012-first-camera",
    title: "The camera in the drawer",
    body: "Two to four sentences, told like you'd tell a friend.",
    date: "Summer 2012",
    tags: ["camera", "summer"],
  },
],
```

### Photos (the easy way)

1. Drop originals into `public/photos/<year>/` (jpg, png, webp, heic).
2. Run `npm run photos`. It converts HEIC, fixes rotation, resizes to 1800px, **strips all metadata (GPS, camera)**,
   writes a blur preview, and records everything in `content/generated/media.json`. Originals are replaced by the cleaned files, so keep your own backups.
3. Every processed photo shows up on its year page automatically. To add a caption, alt text, a date or tags, describe it in
   `content/personal/<year>.ts` using the same `src` (the generated entry steps aside for yours):

```ts
photos: [
  { id: "2012-camera", src: "/photos/2012/img-0412.jpg", width: 1800, height: 1200, alt: "A silver camera on a desk", caption: "Found in a drawer.", takenAt: "2012-07-04", tags: ["camera"] },
],
```

The gallery style follows the era automatically (camera roll → album → grid → feed → cinematic).

### Videos

Short local clips (`.mp4`, keep them under ~20 MB) go in the same `public/photos/<year>/` folder and `npm run photos` lists them.
For anything longer, upload it to YouTube as **unlisted** and reference the link; it plays inline with a tap:

```ts
videos: [
  { id: "2016-trip", src: "/photos/2016/beach.mp4", caption: "Beach, day two.", takenAt: "2016-07", tags: ["trip"] },
  { id: "2016-recital", src: "https://www.youtube.com/watch?v=…", caption: "Spring recital." },
],
```

### A track

```ts
music: [
  { id: "2012-track-1", title: "Song", artist: "Artist", personal: true,
    source: { type: "spotify", url: "https://open.spotify.com/track/..." } },   // shows an Open link
  { id: "2012-track-2", title: "Song", artist: "Artist", personal: true, art: "/music/art/song.jpg",
    source: { type: "local", src: "/music/2012/song.mp3" } },                   // plays in the site's player
],
```

Sources: `local` and `preview` play in the built-in player; `youtube` plays through a small visible YouTube player in the player bar; `spotify` and `apple` open externally.
Only use audio and artwork you have the rights to publish.

### A milestone, a location, an intro

```ts
location: "Potomac, Maryland",
intro: "The year of the first real camera.",
milestones: [{ id: "2012-school", title: "Started a new school", date: "2012-08", kind: "school", tags: ["school"] }],
```

### Life-stage labels and the birthplace

`content/profile.ts`. The default stage labels are arithmetic on the birthday and are marked `placeholder: true`,
which shows an "assumed" badge. Change the labels or ranges and set `placeholder: false`.
Set `showPlaceholders: false` there to hide every remaining slot on the public site.

### Interests, screen, tech, capsule objects

`interests`, `onMyScreen`, and `tech` take `{ label, kind, note?, icon?, url? }`. Icon names are listed in `lib/content/schema.ts` (`ICON_NAMES`).
`capsule` objects (`{ label, icon, personal: true }`) appear in the Time Capsule shelf next to the era's objects.

## How the site looks: clean everywhere, quality that grows with the year

There is no retro costume. One clean design (Geist, Instrument Serif, Geist Mono, a single top nav) runs through every page. What changes with the year is **rendering quality**, the way screens actually improved:

| Years | Label | 2D finish | Motion | 3D scene |
|---|---|---|---|---|
| 2005–08 | 240p | square panels, 2px hard borders, hard offset shadows, static grain | `steps()`, no easing | pixelated, posterized, flat shading |
| 2009–12 | 480p | small radius, one soft highlight | 150 ms eases | half resolution, gloss, light bloom |
| 2013–16 | 720p | flat colour, accent strip | 200 ms | full resolution, pastel toon |
| 2017–20 | 1080p | charcoal, ambient shadow, fine grain | 300 ms | PBR, grain, vignette |
| 2021–26 | 4K | translucent solids with hairlines, layered shadows | long soft curves | depth of field, bloom, chromatic aberration |

- The tokens live in `styles/eras/*.css`; `--era-t` slides values within an era so 2011 sits between 2009 and 2012. `components/year/Surface.tsx` is the one panel; its finish is all tokens. `lib/three/profile.ts` is the 3D side of the same ladder. `lib/content/quality.ts` holds the labels.
- **`/` is the overview hub**: all 22 years as cards, each finished at its own year's quality, plus Timeline, Map, Stats, the game, Random and About. No intro, no gate.
- **Every year page** scrolls title → Winter → Spring → Summer → Fall → "The world that year" over a Three.js world of four procedural sets; the camera rides one spline through them. `lib/content/seasons.ts` files content by month (undated memories land in fall, music in winter, placeholders are spread).
- **`/timeline`** is a 3D road with 22 markers; the sky cycles through the seasons inside every year you drag past.
- Pixel fonts and Windows-98 bevels survive only inside the 8-bit game at `/backyard`, which is a deliberate 2005 artifact; those fonts are never preloaded elsewhere.

### Smoothness is a rule, with a measurement

`BASE=http://localhost:3000 node scripts/scroll-perf.mjs` wheel-scrolls a full year and fires rapid year changes at 2005, 2012 and 2024 on a real GPU, and reports frame times, hitches a visitor could see, and layout shift. It should stay flat at ~16.7 ms with zero long frames. The rules that keep it there, each learned from a measured regression:

- No `backdrop-filter`, no full-viewport `mix-blend-mode`, no `background-attachment: fixed`. Panels over the WebGL canvas are translucent **solids**. An e2e test enforces this.
- A year change never animates the tall article. A viewport-sized wash covers the swap and is held until the new year has painted; the scroll reset goes through Lenis (`lenis.scrollTo(0, { immediate: true })`), never `window.scrollTo`, which Lenis would snap back from.
- Only four colour tokens transition on an era change. Radius and shadow never transition.
- 3D: particle geometry is built once and only its draw range moves; the posterize pass is stable per era so the effect chain is never rebuilt inside one; the shadow map exists only in 2021+.
- Scroll reveals use the CSS scroll timeline (compositor only). Chapter heights are `svh`, not `dvh`.
- Reduced motion: native scrolling, a still 3D frame, no wash. No WebGL: the era wallpaper shows and nothing else changes. The sparkle button in the nav turns the 3D layer off entirely.

Visual checks: `node scripts/screenshots.mjs <dir>` (hub, one year per quality level, secondary pages, phones) and `node scripts/season-shots.mjs <dir>` (every chapter of several years, phone, reduced motion).

## Privacy on the public site

Two rules keep the archive shareable without giving away too much:

- **Friends are first names only.** "Josh and Max, the twins" is fine; surnames stay out of the repo.
- **Street names, never house numbers.** "Paddock Lane, Cold Spring" is the most specific a home address gets.

The map pins in `content/places.ts` are neighbourhood- and school-level coordinates, not front doors. The one exact date published is the birthday, which Ethan chose to show.

## Potomac Sandlot (the game)

Draft seven kids from an original neighbourhood cast, then play three or six innings against the CPU (three difficulty levels) or a friend on the same keyboard.
Pitch (pick a pitch, aim with arrows, Space starts the meter and Space throws), bat (Space swings, B bunts),
field (1–4 throw to a base, ↑ sends runners, ↓ holds), all with on-screen buttons too. Records are kept in your browser.

- Cast, stats, traits, team names, and the title: `content/game/roster.ts` and `content/game/text.ts`.
  Add yourself and friends to `personalSlots`; they show up in the draft with a "you" badge.
- Engine: `lib/game/` is pure and seeded (`npm test` covers rules and determinism). Renderer, scenes, and chiptune audio: `components/game/`.
- Art: character cards, the field, and the cover under `public/game/` were generated with Higgsfield from one locked pixel-art prompt
  and processed by `scripts/game-assets.mjs` (magenta key, nearest-neighbour downscale, palette quantise). In-game sprites are drawn in code.
- Everything is original: no characters, names, sprites, or sounds from the games it tips its cap to.

## Where things are

```
app/            routes (intro, /year/[year], /timeline, /search, /random, /about)
components/     browser (the window frame), shell, year system, modules, gallery, player, timeline, search, game, ui
content/        profile.ts, site.ts, personal/<year>.ts, culture/<year>.ts
lib/            content schema + loaders, era + settings stores, player, search, hooks
styles/         tokens (with @property), one stylesheet per era, effects, os.css (Win98/Mac skins), pixels.css (clouds, POW type)
scripts/        check-content.ts, screenshots.mjs
tests/          unit tests and Playwright e2e
```

Era chrome lives only in `styles/globals.css` under `.surface`; modules never hard-code era colours.
Every colour is a token that each era redefines, so adding a sixth era means one CSS file and one entry in `lib/content/eras.ts`.

## Extras

- `/stats` — My Life in Data: counts computed from the content files (placeholders count as slots, never as memories).
- `/map` — Memory Map: real places from `content/places.ts` pinned on a US or world map rendered at build time.
- In the 2005–2012 window eras on a desktop, module windows can be dragged by their title bars (double-click to snap back).
- Two idle minutes bring up a screensaver. ↑↑↓↓←→←→BA opens a secret folder. The Recycle Bin is not empty.

## Keyboard

← → previous/next year · Home/End first/last · ⌘K or / search · Esc closes anything · Space play/pause while the player is open.
The address bar takes a year or a path; the menu bar is fully keyboard navigable.

## Deploying

**GitHub Pages (live now).** Every push to `main` runs `.github/workflows/pages.yml`: a static export with
`STATIC_EXPORT=1` and `NEXT_PUBLIC_BASE_PATH=/archive`, published at https://ethan-goldstein.github.io/archive/.
CI (`ci.yml`) runs lint, typecheck, tests, the content check, and a build on every push and pull request.

**Vercel (optional upgrade).** Import the repo, framework preset Next.js, set `NEXT_PUBLIC_SITE_URL` to the production URL,
and leave `STATIC_EXPORT` and `NEXT_PUBLIC_BASE_PATH` unset. You get image optimization and a root URL; nothing else changes.

`npm run og` regenerates the social preview image at `public/og.png`.
