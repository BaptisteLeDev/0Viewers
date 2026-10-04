import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { fixtureCategories, fixtureChannels, fixtureGames, fixtureStreams, fixtureUsers } from "./fixtures";
import { slugifyCategory, type BoxArt } from "./categories";
import { saveLiveCount } from "./live-count";
import { selectStreams, toSetAside, toStreamers0V } from "./rule";
import { fetchAppToken, fetchChannels, fetchFrenchStreams, fetchGames, fetchUsers, searchHelixCategories } from "./twitch";
import { getHiddenBroadcasters } from "@/vote";
import type { Category, HelixCategory, HelixStream, SetAsideStream, Streamer0V } from "./types";

export type { Category, LivePoint, SetAsideReason, SetAsideStream, Streamer0V } from "./types";
export { CRYPTO_WORDS, GAMBLING, MAX_STREAMERS, MAX_VIEWERS, MEDIA_TAG_WORDS, MEDIA_WORDS, MIN_LIVE_MINUTES } from "./rule";
export { getLiveCounts } from "./live-count";
export { groupByCategory, slugifyCategory, type BoxArt, type LiveCategory } from "./categories";

// liveCount / zeroCount: every FR live (and those at 0) seen by the crawl,
// before the rule, from the same pages: no extra call. Floor if capped.
type Crawl = { streamers: Streamer0V[]; setAside: SetAsideStream[]; boxArt: BoxArt; liveCount: number; zeroCount: number; crawledAt: number };

const toBoxArt = (categories: HelixCategory[]): BoxArt => Object.fromEntries(categories.map((g) => [g.id, g.box_art_url]));

function merge(selected: ReturnType<typeof selectStreams>, profiled: ReturnType<typeof toStreamers0V>, boxArt: BoxArt, streams: HelixStream[]) {
  const zeroCount = streams.filter((s) => s.viewer_count === 0).length;
  return { streamers: profiled.kept, setAside: [...selected.setAside, ...profiled.setAside], boxArt, liveCount: streams.length, zeroCount };
}

async function crawl(): Promise<Omit<Crawl, "crawledAt">> {
  const now = new Date();
  if (process.env.TWITCH_FIXTURES === "1") {
    const streams = fixtureStreams(now);
    const selected = selectStreams(streams, now);
    const ids = selected.kept.map((s) => s.user_id);
    const gameIds = [...new Set(selected.kept.map((s) => s.game_id))];
    return merge(selected, toStreamers0V(selected.kept, fixtureUsers(ids), fixtureChannels(ids)), toBoxArt(fixtureGames(gameIds)), streams);
  }
  const token = await fetchAppToken();
  const streams = await fetchFrenchStreams(token);
  const selected = selectStreams(streams, now);
  const ids = selected.kept.map((s) => s.user_id);
  const gameIds = [...new Set(selected.kept.map((s) => s.game_id).filter(Boolean))];
  // box art is cosmetic: a /categories failure must not kill the crawl
  const categories = fetchGames(gameIds, token).catch((error) => (console.error(error), []));
  const [users, channels, boxArt] = await Promise.all([fetchUsers(ids, token), fetchChannels(ids, token), categories.then(toBoxArt)]);
  return merge(selected, toStreamers0V(selected.kept, users, channels), boxArt, streams);
}

// Full crawl: ~100 Helix pages, every 4 min. Not less: each page
// re-renders at this pace (Vercel Hobby: 4 CPU-h). Throw never cached.
async function cachedCrawl(): Promise<Crawl> {
  "use cache";
  cacheLife({ stale: 60, revalidate: 240, expire: 3600 });
  cacheTag("streams");
  const full = { ...(await crawl()), crawledAt: Date.now() };
  await saveLiveCount(full.liveCount, full.crawledAt);
  return full;
}

// Outside the crawl cache: a vote busting "hidden" must not re-crawl Twitch.
export async function getCrawl(): Promise<Crawl> {
  const [crawl, hidden] = await Promise.all([cachedCrawl(), getHiddenBroadcasters()]);
  if (hidden.length === 0) return crawl;
  const ids = new Set(hidden);
  const flagged = crawl.streamers.filter((s) => ids.has(s.id)).map((s) => toSetAside(s, "signalements"));
  return { ...crawl, streamers: crawl.streamers.filter((s) => !ids.has(s.id)), setAside: [...crawl.setAside, ...flagged] };
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
