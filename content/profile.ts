/**
 * PERSONAL PROFILE — the only hard facts the archive knows.
 * Edit freely. Anything with `placeholder: true` is an assumption derived from
 * the birthday alone, not something Ethan has confirmed.
 */
export const profile = {
  name: "Ethan Goldstein",
  wordmark: "ETHAN.GOLDSTEIN",
  archiveLabel: "ARCHIVE 2005—2026",
  tagline: "An archive of growing up.",
  birthday: { year: 2005, month: 2, day: 10 },
  birthplace: { label: "Potomac, Maryland", short: "Potomac, MD", lat: 39.018, lng: -77.208 },

  /**
   * Life-stage labels shown in the year header and the timeline scrubber.
   * Defaults are arithmetic on the birthday (age 5–6 elementary, 11 middle, 14 high, 18 college).
   * EDIT: replace labels, adjust ranges, or set placeholder: false once confirmed.
   */
  lifeStages: [
    { from: 2005, to: 2010, label: "Early childhood", placeholder: true },
    { from: 2011, to: 2015, label: "Childhood", placeholder: true },
    { from: 2016, to: 2018, label: "Middle school era", placeholder: true },
    { from: 2019, to: 2022, label: "High school era", placeholder: true },
    { from: 2023, to: 2026, label: "College era", placeholder: true },
  ],

  /** Show dashed "EDIT ME" placeholder slots on the public site. Flip to false when content is filled. */
  showPlaceholders: true,
} as const;
