import "server-only";
import { cacheLife } from "next/cache";
import { sql } from "@/db";
import type { LivePoint } from "./types";

const HOUR = 3_600_000;
let savedHour = -1;

// Neon free: 100 CU-h/month, ~400 h awake. A write per crawl (4 min)
// keeps compute awake 24/7: one write per hour per instance, 1 year kept.
// Budget: src/decouverte/README.md, section Neon.
export async function saveLiveCount(lives: number, crawledAt: number): Promise<void> {
  const hour = Math.floor(crawledAt / HOUR);
  if (!sql || process.env.TWITCH_FIXTURES === "1" || hour === savedHour) return;
  try {
    await sql`WITH purge AS (DELETE FROM live_count WHERE crawled_at < now() - interval '1 year')
      INSERT INTO live_count (crawled_at, lives) VALUES (${new Date(hour * HOUR)}, ${lives})
      ON CONFLICT (crawled_at) DO UPDATE SET lives = GREATEST(live_count.lives, EXCLUDED.lives)`;
    savedHour = hour;
  } catch (error) {
    console.error(error);
  }
}

// Hourly like the writes: a faster read would wake Neon for nothing.
export async function getLiveCounts(): Promise<LivePoint[]> {
  "use cache: remote";
  cacheLife("hours");
  if (!sql) return [];
  try {
    const rows = await sql`SELECT extract(epoch FROM crawled_at) * 1000 AS at, lives FROM live_count ORDER BY crawled_at`;
    return rows.map((r) => ({ at: Number(r.at), lives: Number(r.lives) }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
