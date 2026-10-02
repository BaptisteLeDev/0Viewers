import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { fixtureStreams, fixtureUsers } from "./fixtures";
import { selectStreams, toStreamer0V } from "./rule";
import { fetchAppToken, fetchFrenchStreams, fetchUsers } from "./twitch";
import type { Streamer0V } from "./types";

export type { Streamer0V } from "./types";
export { MAX_VIEWERS, MIN_LIVE_MINUTES } from "./rule";
export { groupByGame, slugifyGame, type Game } from "./games";

async function crawl(): Promise<Streamer0V[]> {
  const now = new Date();
  if (process.env.TWITCH_FIXTURES === "1") {
    const selected = selectStreams(fixtureStreams(now), now);
    const users = fixtureUsers(selected.map((s) => s.user_id));
    return selected.map((s) => toStreamer0V(s, users.get(s.user_id)));
  }
  const token = await fetchAppToken();
  const selected = selectStreams(await fetchFrenchStreams(token), now);
  const users = await fetchUsers(selected.map((s) => s.user_id), token);
  return selected.map((s) => toStreamer0V(s, users.get(s.user_id)));
}

// stale 60 = old page revalidate, revalidate 240 = old crawl window.
// A throw is never cached.
export async function getCrawl(): Promise<{ streamers: Streamer0V[]; crawledAt: number }> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 240, expire: 3600 });
  cacheTag("streams");
  return { streamers: await crawl(), crawledAt: Date.now() };
}

export async function getZeroViewersStreamers(): Promise<Streamer0V[]> {
  return (await getCrawl()).streamers;
}
