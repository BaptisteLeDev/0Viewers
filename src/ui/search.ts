import { fold } from "@/decouverte/categories";
import type { Streamer0V } from "@/decouverte/types";

export function matchesQuery(s: Streamer0V, query: string): boolean {
  const q = fold(query.trim());
  if (!q) return true;
  return [s.displayName, s.title, s.categoryName].some((field) => fold(field).includes(q));
}

export function viewerLabel(n: number): string {
  return `${n} spectateur${n > 1 ? "s" : ""}`;
}
