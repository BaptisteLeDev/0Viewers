import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "@/db";
import { HIDE_AT, hiddenSince, type VoteValue } from "./rule";

export { HIDE_AT, nextVote, parseBroadcasterId, parseVote, type VoteValue } from "./rule";

export const HIDDEN_TAG = "hidden";

// Returns the broadcaster's Signalement count after the vote.
export async function castVote(viewerId: string, broadcasterId: string, value: VoteValue): Promise<number> {
  if (!sql) throw new Error("Missing env DATABASE_URL");
  if (value === 0) {
    await sql`DELETE FROM vote WHERE viewer_id = ${viewerId} AND broadcaster_id = ${broadcasterId}`;
  } else {
    await sql`INSERT INTO vote (viewer_id, broadcaster_id, value) VALUES (${viewerId}, ${broadcasterId}, ${value})
      ON CONFLICT (viewer_id, broadcaster_id) DO UPDATE SET value = EXCLUDED.value, voted_at = now()`;
  }
  const [row] = await sql`SELECT signalements::int AS n FROM broadcaster_score WHERE broadcaster_id = ${broadcasterId}`;
  return row?.n ?? 0;
}

export type HiddenBroadcaster = { broadcasterId: string; signalements: number; hiddenAt: number };

// Oldest hidden first. Uncached: admin only, callers go through the cache.
export async function listHidden(): Promise<HiddenBroadcaster[]> {
  if (!sql) return [];
  const rows = await sql`SELECT v.broadcaster_id, array_agg(extract(epoch FROM v.voted_at) * 1000) AS dates,
      extract(epoch FROM max(o.unhidden_at)) * 1000 AS unhidden_at
    FROM vote v LEFT JOIN vote_override o USING (broadcaster_id)
    WHERE v.value = -1 GROUP BY v.broadcaster_id HAVING count(*) >= ${HIDE_AT}`;
  return rows
    .map((r) => {
      const dates = (r.dates as unknown[]).map(Number);
      const unhiddenAt = r.unhidden_at === null ? null : Number(r.unhidden_at);
      return { broadcasterId: String(r.broadcaster_id), signalements: dates.length, hiddenAt: hiddenSince(dates, unhiddenAt) };
    })
    .filter((h): h is HiddenBroadcaster => h.hiddenAt !== null)
    .sort((a, b) => a.hiddenAt - b.hiddenAt);
}

// Hourly + tag busted by votes near the threshold: never a Neon
// read per visit (free plan budget, src/decouverte/README.md).
export async function getHiddenBroadcasters(): Promise<string[]> {
  "use cache: remote";
  cacheLife("hours");
  cacheTag(HIDDEN_TAG);
  try {
    return (await listHidden()).map((h) => h.broadcasterId);
  } catch (error) {
    console.error(error);
    return [];
  }
}

// Never deletes votes: an override row makes old Signalements stop counting.
export async function unhide(broadcasterId: string): Promise<void> {
  if (!sql) throw new Error("Missing env DATABASE_URL");
  await sql`INSERT INTO vote_override (broadcaster_id) VALUES (${broadcasterId})
    ON CONFLICT (broadcaster_id) DO UPDATE SET unhidden_at = now()`;
}

export type ActivityDay = { at: number; viewers: number; signalements: number };

// New viewers and Signalements per UTC day, last 7 days. Admin only.
export async function communityActivity(): Promise<ActivityDay[]> {
  if (!sql) return [];
  const rows = await sql`SELECT extract(epoch FROM d) * 1000 AS at,
      (SELECT count(*) FROM viewer WHERE created_at >= d AND created_at < d + interval '1 day')::int AS viewers,
      (SELECT count(*) FROM vote WHERE value = -1 AND voted_at >= d AND voted_at < d + interval '1 day')::int AS signalements
    FROM generate_series(date_trunc('day', now()) - interval '6 days', date_trunc('day', now()), interval '1 day') AS d
    ORDER BY d`;
  return rows.map((r) => ({ at: Number(r.at), viewers: r.viewers, signalements: r.signalements }));
}
