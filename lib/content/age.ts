import { profile } from "@/content/profile";

/** Age Ethan turns during the given calendar year. 2005 -> 0. */
export function ageInYear(year: number): number {
  return year - profile.birthday.year;
}

/** Exact age on a given date. */
export function ageAt(date: Date): number {
  const { year, month, day } = profile.birthday;
  let age = date.getFullYear() - year;
  const beforeBirthday =
    date.getMonth() + 1 < month || (date.getMonth() + 1 === month && date.getDate() < day);
  if (beforeBirthday) age -= 1;
  return age;
}

export function ageLabel(year: number): string {
  const age = ageInYear(year);
  if (age === 0) return "Born";
  return `Age ${age}`;
}

export function turnsLabel(year: number): string {
  const age = ageInYear(year);
  if (age === 0) return "Born this year";
  return `Turns ${age} in February`;
}

export function lifeStageFor(year: number): { label: string; placeholder: boolean } {
  const stage = profile.lifeStages.find((s) => year >= s.from && year <= s.to);
  if (!stage) return { label: "Unlabelled", placeholder: true };
  return { label: stage.label, placeholder: stage.placeholder ?? false };
}
