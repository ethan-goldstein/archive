import type { GameState, PlayEvent, Team } from "./types";

export function battingTeam(s: GameState): Team {
  return s.top ? s.teams.away : s.teams.home;
}
export function fieldingTeam(s: GameState): Team {
  return s.top ? s.teams.home : s.teams.away;
}
export function currentBatterId(s: GameState): string {
  const t = battingTeam(s);
  return t.lineup[s.batterIndex[t.id] % t.lineup.length];
}
export function kidById(s: GameState, id: string) {
  return [...s.teams.home.kids, ...s.teams.away.kids].find((k) => k.id === id)!;
}
export function pitcherId(s: GameState): string {
  return fieldingTeam(s).positions.P;
}

export function resetCount(s: GameState) {
  s.balls = 0;
  s.strikes = 0;
}

export function nextBatter(s: GameState) {
  const t = battingTeam(s);
  s.batterIndex[t.id] = (s.batterIndex[t.id] + 1) % t.lineup.length;
  resetCount(s);
}

export function addOut(s: GameState, ev: PlayEvent) {
  s.outs += 1;
  s.events.push(ev);
}

export function scoreRun(s: GameState, kidId: string) {
  const t = battingTeam(s);
  s.score[t.id] += 1;
  s.events.push({ type: "score", runner: kidId });
  const st = stat(s, kidId);
  st.r += 1;
}

export function stat(s: GameState, kidId: string) {
  if (!s.stats[kidId]) s.stats[kidId] = { ab: 0, h: 0, hr: 0, rbi: 0, k: 0, r: 0 };
  return s.stats[kidId];
}

/** True when the game should end after the half-inning that just finished. */
export function gameShouldEnd(s: GameState): boolean {
  const { home, away } = s.score;
  const last = s.config.innings;
  const lead = Math.abs(home - away);
  if (s.inning >= 3 && lead >= s.config.mercy) return true;
  if (s.top) {
    // top just finished; bottom is skipped if the home team already leads in the final inning
    return s.inning >= last && home > away;
  }
  // bottom just finished
  if (s.inning < last) return false;
  return home !== away;
}

export function winner(s: GameState): "home" | "away" | "tie" {
  if (s.score.home === s.score.away) return "tie";
  return s.score.home > s.score.away ? "home" : "away";
}

export function inningLabel(s: GameState) {
  return `${s.top ? "Top" : "Bot"} ${s.inning}`;
}
