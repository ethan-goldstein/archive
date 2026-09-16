export interface Records { games: number; wins: number; homers: number; bestScore: number; lastResult?: string }
const KEY = "archive:sandlot";
export function loadRecords(): Records {
  try { const raw = localStorage.getItem(KEY); if (raw) return { games: 0, wins: 0, homers: 0, bestScore: 0, ...JSON.parse(raw) }; } catch { /* ignore */ }
  return { games: 0, wins: 0, homers: 0, bestScore: 0 };
}
export function saveRecords(r: Records) {
  try { localStorage.setItem(KEY, JSON.stringify(r)); } catch { /* ignore */ }
}
