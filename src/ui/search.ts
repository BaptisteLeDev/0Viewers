import type { Streamer0V } from "@/decouverte/types";

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function matchesQuery(s: Streamer0V, query: string): boolean {
  const q = fold(query.trim());
  if (!q) return true;
  return [s.displayName, s.title, s.gameName].some((field) => fold(field).includes(q));
}

export function viewerLabel(n: number): string {
  return `${n} viewer${n > 1 ? "s" : ""}`;
}
