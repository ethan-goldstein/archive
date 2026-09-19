/**
 * PERSONAL PROFILE — the facts the archive knows, as Ethan gave them.
 * Privacy rule for the public site: street names without house numbers, friends by first name only.
 */
export const profile = {
  name: "Ethan Goldstein",
  wordmark: "ETHAN.GOLDSTEIN",
  archiveLabel: "ARCHIVE 2005—2026",
  tagline: "An archive of growing up.",
  birthday: { year: 2005, month: 2, day: 10 },
  birthplace: { label: "Potomac, Maryland", short: "Potomac, MD", hospital: "Shady Grove Hospital", lat: 39.018, lng: -77.208 },

  family: [
    { name: "Jeremy", relation: "brother", born: "2000-04-25", note: "Five years older. I thought he was the coolest person alive and wanted to be him." },
    { name: "Kyra", relation: "sister", born: "2001-07-02", note: "Three and a half years older." },
    { name: "Fenway", relation: "first dog", born: undefined, note: "The Wooden Bridge Road dog. Passed in 2013, when I was in 3rd grade." },
    { name: "Parker", relation: "dog", born: undefined, note: "The goldendoodle. EDIT: add the year Parker arrived and he joins the 3D winter scene from then on." },
  ],

  /** Moods the archive leans into. Fall first, always. */
  themes: ["fall", "older siblings", "baseball", "the pool", "the basement"],

  /** Confirmed life stages, labelled by the grade that started in the fall of each year. */
  lifeStages: [
    { from: 2005, to: 2005, label: "Born", placeholder: false },
    { from: 2006, to: 2007, label: "Olney", placeholder: false },
    { from: 2008, to: 2008, label: "Preschool", placeholder: false },
    { from: 2009, to: 2009, label: "Moved to Cold Spring", placeholder: false },
    { from: 2010, to: 2010, label: "Kindergarten", placeholder: false },
    { from: 2011, to: 2011, label: "1st grade", placeholder: false },
    { from: 2012, to: 2012, label: "2nd grade", placeholder: false },
    { from: 2013, to: 2013, label: "3rd grade", placeholder: false },
    { from: 2014, to: 2014, label: "4th grade", placeholder: false },
    { from: 2015, to: 2015, label: "5th grade", placeholder: false },
    { from: 2016, to: 2016, label: "6th grade · Cabin John", placeholder: false },
    { from: 2017, to: 2017, label: "7th grade", placeholder: false },
    { from: 2018, to: 2018, label: "8th grade", placeholder: false },
    { from: 2019, to: 2019, label: "Freshman · Wootton", placeholder: false },
    { from: 2020, to: 2020, label: "Sophomore", placeholder: false },
    { from: 2021, to: 2021, label: "Junior", placeholder: false },
    { from: 2022, to: 2022, label: "Senior", placeholder: false },
    { from: 2023, to: 2023, label: "College freshman", placeholder: false },
    { from: 2024, to: 2024, label: "College sophomore", placeholder: false },
    { from: 2025, to: 2025, label: "College junior", placeholder: false },
    { from: 2026, to: 2026, label: "College senior", placeholder: false },
  ],

  /** Show dashed "EDIT ME" placeholder slots on the public site. Flip to false when content is filled. */
  showPlaceholders: true,
} as const;
