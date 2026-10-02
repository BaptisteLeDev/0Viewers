import type { Streamer0V } from "@/decouverte/types";
import { matchesQuery } from "./search";

export const VIEWERS = ["", "0", "1-2", "3-5"] as const;
export const DURATIONS = ["", "moins-1h", "1-3h", "plus-3h"] as const;
export const SORTS = ["spectateurs", "recent", "long"] as const;

export type Filters = {
  q: string;
  viewers: (typeof VIEWERS)[number];
  game: string;
  duration: (typeof DURATIONS)[number];
  sort: (typeof SORTS)[number];
};

export const DEFAULT_FILTERS: Filters = { q: "", viewers: "", game: "", duration: "", sort: "spectateurs" };

const VIEWER_RANGES: Record<Exclude<Filters["viewers"], "">, [number, number]> = { "0": [0, 0], "1-2": [1, 2], "3-5": [3, 5] };
const MINUTE_RANGES: Record<Exclude<Filters["duration"], "">, [number, number]> = {
  "moins-1h": [0, 60], "1-3h": [60, 180], "plus-3h": [180, Infinity],
};

const liveMinutes = (s: Streamer0V, now: number) => (now - Date.parse(s.startedAt)) / 60_000;

export function applyFilters(streamers: Streamer0V[], f: Filters, now: number): Streamer0V[] {
  const shown = streamers.filter((s) => {
    if (f.viewers) {
      const [min, max] = VIEWER_RANGES[f.viewers];
      if (s.viewerCount < min || s.viewerCount > max) return false;
    }
    if (f.game && s.gameName !== f.game) return false;
    if (f.duration) {
      const [min, max] = MINUTE_RANGES[f.duration];
      const m = liveMinutes(s, now);
      if (!(m >= min && m < max)) return false;
    }
    return matchesQuery(s, f.q);
  });
  if (f.sort === "spectateurs") return shown.sort((a, b) => a.viewerCount - b.viewerCount);
  const sign = f.sort === "recent" ? 1 : -1;
  const key = (s: Streamer0V) => {
    const m = liveMinutes(s, now);
    return Number.isFinite(m) ? sign * m : Infinity;
  };
  return shown.sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    return ka === kb ? 0 : ka < kb ? -1 : 1;
  });
}

const pick = <T extends string>(allowed: readonly T[], value: string | null, fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

export function parseFilters(params: { get(name: string): string | null }, games: string[]): Filters {
  const game = params.get("jeu") ?? "";
  return {
    q: params.get("q") ?? "",
    viewers: pick(VIEWERS, params.get("spectateurs"), ""),
    game: games.includes(game) ? game : "",
    duration: pick(DURATIONS, params.get("duree"), ""),
    sort: pick(SORTS, params.get("tri"), "spectateurs"),
  };
}

export function toSearch(f: Filters): string {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q);
  if (f.viewers) params.set("spectateurs", f.viewers);
  if (f.game) params.set("jeu", f.game);
  if (f.duration) params.set("duree", f.duration);
  if (f.sort !== DEFAULT_FILTERS.sort) params.set("tri", f.sort);
  return params.toString();
}

export function activeCount(f: Filters): number {
  return [f.viewers, f.game, f.duration, f.sort !== DEFAULT_FILTERS.sort].filter(Boolean).length;
}
