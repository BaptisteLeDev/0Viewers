import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { sql } from "@/db";
import { HIDE_AT, type VoteValue } from "./rule";

export { HIDE_AT, nextVote, parseVote, type VoteValue } from "./rule";

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

// Hourly + tag busted by votes near the threshold: never a Neon
// read per visit (free plan budget, src/decouverte/README.md).
export async function getHiddenBroadcasters(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(HIDDEN_TAG);
  if (!sql) return [];
  try {
    const rows = await sql`SELECT broadcaster_id FROM broadcaster_score WHERE signalements >= ${HIDE_AT}`;
    return rows.map((r) => String(r.broadcaster_id));
  } catch (error) {
    console.error(error);
    return [];
  }
}
