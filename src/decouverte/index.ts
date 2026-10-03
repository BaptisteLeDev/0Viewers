import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { fixtureCategories, fixtureChannels, fixtureGames, fixtureStreams, fixtureUsers } from "./fixtures";
import { slugifyCategory, type BoxArt } from "./categories";
import { selectStreams, toStreamers0V } from "./rule";
import { fetchAppToken, fetchChannels, fetchFrenchStreams, fetchGames, fetchUsers, searchHelixCategories } from "./twitch";
import type { Category, HelixCategory, Streamer0V } from "./types";

export type { Category, Streamer0V } from "./types";
export { MAX_STREAMERS, MAX_VIEWERS, MIN_LIVE_MINUTES } from "./rule";
export { groupByCategory, slugifyCategory, type BoxArt, type LiveCategory } from "./categories";

type Crawl = { streamers: Streamer0V[]; boxArt: BoxArt; crawledAt: number };

const toBoxArt = (categories: HelixCategory[]): BoxArt => Object.fromEntries(categories.map((g) => [g.id, g.box_art_url]));

async function crawl(): Promise<Omit<Crawl, "crawledAt">> {
  const now = new Date();
  if (process.env.TWITCH_FIXTURES === "1") {
    const selected = selectStreams(fixtureStreams(now), now);
    const ids = selected.map((s) => s.user_id);
    const [users, channels] = [fixtureUsers(ids), fixtureChannels(ids)];
    const gameIds = [...new Set(selected.map((s) => s.game_id))];
    return { streamers: toStreamers0V(selected, users, channels), boxArt: toBoxArt(fixtureGames(gameIds)) };
  }
  const token = await fetchAppToken();
  const selected = selectStreams(await fetchFrenchStreams(token), now);
  const ids = selected.map((s) => s.user_id);
  const gameIds = [...new Set(selected.map((s) => s.game_id).filter(Boolean))];
  // box art is cosmetic: a /categories failure must not kill the crawl
  const categories = fetchGames(gameIds, token).catch((error) => (console.error(error), []));
  const [users, channels, boxArt] = await Promise.all([fetchUsers(ids, token), fetchChannels(ids, token), categories.then(toBoxArt)]);
  return { streamers: toStreamers0V(selected, users, channels), boxArt };
}

// stale 60 = old page revalidate, revalidate 240 = old crawl window.
// A throw is never cached.
export async function getCrawl(): Promise<Crawl> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 240, expire: 3600 });
  cacheTag("streams");
  return { ...(await crawl()), crawledAt: Date.now() };
}

export async function getZeroViewersStreamers(): Promise<Streamer0V[]> {
  return (await getCrawl()).streamers;
}

const toCategory = (c: HelixCategory): Category => ({
  id: c.id, name: c.name, slug: slugifyCategory(c.name), boxArtUrl: c.box_art_url.replace(/\{width\}x\{height\}|\d+x\d+/, "52x72"),
});

// Caller validates query length. Categories barely change: 1 day.
// ponytail: one app token per uncached query, cache the token if rate-limited
export async function searchCategories(query: string): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  const found = process.env.TWITCH_FIXTURES === "1" ? fixtureCategories(query) : await searchHelixCategories(query, await fetchAppToken());
  return found.map(toCategory).filter((c) => c.slug);
}
