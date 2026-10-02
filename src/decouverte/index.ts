import "server-only";
import { unstable_cache } from "next/cache";
import { cache } from "react";
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

// unstable_cache, not "use cache": Cache Components would forbid the
// route revalidate/dynamicParams configs. A throw is never cached.
const sharedCrawl = unstable_cache(crawl, ["streams"], { revalidate: 240, tags: ["streams"] });

export const getZeroViewersStreamers = cache(sharedCrawl);
