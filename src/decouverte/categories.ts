import type { Streamer0V } from "./types";

export type LiveCategory = { slug: string; name: string; count: number; boxArtUrl: string; streamers: Streamer0V[] };

/** Twitch category id -> box art template ({width}x{height}) */
export type BoxArt = Record<string, string>;

export const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const SYMBOLS: Record<string, string> = { "+": " plus ", "#": " sharp ", "&": " et " };

export function slugifyCategory(name: string): string {
  return fold(name).replace(/[+#&]/g, (c) => SYMBOLS[c]).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function groupByCategory(streamers: Streamer0V[], boxArt: BoxArt = {}): LiveCategory[] {
  const categories = new Map<string, LiveCategory>();
  for (const s of streamers) {
    const slug = slugifyCategory(s.categoryName);
    if (!slug) continue;
    const category = categories.get(slug);
    if (category) {
      category.count++;
      category.streamers.push(s);
    } else categories.set(slug, { slug, name: s.categoryName, count: 1, boxArtUrl: boxArt[s.categoryId] ?? "", streamers: [s] });
  }
  return [...categories.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, "fr"));
}
