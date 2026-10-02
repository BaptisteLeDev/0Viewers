import type { Streamer0V } from "@/decouverte/types";
import { matchesQuery } from "./search";

export const VIEWERS = ["", "0", "1-2", "3-5"] as const;
export const DURATIONS = ["", "moins-1h", "1-3h", "plus-3h"] as const;
export const SORTS = ["spectateurs", "recent", "long"] as const;
export const CONTENTS = ["", "tout-public", "adulte"] as const;

export type Filters = {
  q: string;
  viewers: (typeof VIEWERS)[number];
  category: string;
  duration: (typeof DURATIONS)[number];
  sort: (typeof SORTS)[number];
  content: (typeof CONTENTS)[number];
};

export const DEFAULT_FILTERS: Filters = { q: "", viewers: "", category: "", duration: "", sort: "spectateurs", content: "" };

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
    if (f.category && s.categoryName !== f.category) return false;
    if (f.content && s.mature !== (f.content === "adulte")) return false;
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

export function parseFilters(params: { get(name: string): string | null }, categories: string[]): Filters {
  const category = params.get("categorie") ?? "";
  return {
    q: params.get("q") ?? "",
    viewers: pick(VIEWERS, params.get("spectateurs"), ""),
    category: categories.includes(category) ? category : "",
    duration: pick(DURATIONS, params.get("duree"), ""),
    sort: pick(SORTS, params.get("tri"), "spectateurs"),
    content: pick(CONTENTS, params.get("contenu"), ""),
  };
}

export function toSearch(f: Filters): string {
  const params = new URLSearchParams();
  if (f.q.trim()) params.set("q", f.q);
  if (f.viewers) params.set("spectateurs", f.viewers);
  if (f.category) params.set("categorie", f.category);
  if (f.duration) params.set("duree", f.duration);
  if (f.sort !== DEFAULT_FILTERS.sort) params.set("tri", f.sort);
  if (f.content) params.set("contenu", f.content);
  return params.toString();
}

export function activeCount(f: Filters): number {
  return [f.viewers, f.category, f.duration, f.content, f.sort !== DEFAULT_FILTERS.sort].filter(Boolean).length;
}
