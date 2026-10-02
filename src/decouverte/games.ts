import type { Streamer0V } from "./types";

export type Game = { slug: string; name: string; count: number; streamers: Streamer0V[] };

export const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const SYMBOLS: Record<string, string> = { "+": " plus ", "#": " sharp ", "&": " et " };

export function slugifyGame(name: string): string {
  return fold(name).replace(/[+#&]/g, (c) => SYMBOLS[c]).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function groupByGame(streamers: Streamer0V[]): Game[] {
  const games = new Map<string, Game>();
  for (const s of streamers) {
    const slug = slugifyGame(s.gameName);
    if (!slug) continue;
    const game = games.get(slug);
    if (game) {
      game.count++;
      game.streamers.push(s);
    } else games.set(slug, { slug, name: s.gameName, count: 1, streamers: [s] });
  }
  return [...games.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));
}
