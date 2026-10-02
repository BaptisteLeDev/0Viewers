export function formatLiveDuration(startedAt: string, now: number): string {
  const elapsed = now - Date.parse(startedAt);
  if (!Number.isFinite(elapsed)) return "";
  const minutes = Math.max(0, Math.floor(elapsed / 60_000));
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
}
