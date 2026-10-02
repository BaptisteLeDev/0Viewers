import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { fixtureCategories, fixtureChannels, fixtureStreams, fixtureUsers } from "./fixtures";
import { slugifyGame } from "./games";
import { selectStreams, toStreamer0V } from "./rule";
import { fetchAppToken, fetchChannels, fetchFrenchStreams, fetchUsers, searchHelixCategories } from "./twitch";
import type { Category, HelixCategory, Streamer0V } from "./types";

export type { Category, Streamer0V } from "./types";
export { MAX_VIEWERS, MIN_LIVE_MINUTES } from "./rule";
export { groupByGame, slugifyGame, type Game } from "./games";

async function crawl(): Promise<Streamer0V[]> {
  const now = new Date();
  if (process.env.TWITCH_FIXTURES === "1") {
    const selected = selectStreams(fixtureStreams(now), now);
    const ids = selected.map((s) => s.user_id);
    const [users, channels] = [fixtureUsers(ids), fixtureChannels(ids)];
    return selected.map((s) => toStreamer0V(s, users.get(s.user_id), channels.get(s.user_id)));
  }
  const token = await fetchAppToken();
  const selected = selectStreams(await fetchFrenchStreams(token), now);
  const ids = selected.map((s) => s.user_id);
  const [users, channels] = await Promise.all([fetchUsers(ids, token), fetchChannels(ids, token)]);
  return selected.map((s) => toStreamer0V(s, users.get(s.user_id), channels.get(s.user_id)));
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

const toCategory = (c: HelixCategory): Category => ({
  id: c.id, name: c.name, slug: slugifyGame(c.name), boxArtUrl: c.box_art_url.replace(/\{width\}x\{height\}|\d+x\d+/, "52x72"),
});

// Caller validates query length. Categories barely change: 1 day.
// ponytail: one app token per uncached query, cache the token if rate-limited
export async function searchCategories(query: string): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  const found = process.env.TWITCH_FIXTURES === "1" ? fixtureCategories(query) : await searchHelixCategories(query, await fetchAppToken());
  return found.map(toCategory).filter((c) => c.slug);
}
