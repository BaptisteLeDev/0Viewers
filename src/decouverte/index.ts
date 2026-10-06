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
  const [users, channels, boxArt] = await Promise.all([fetchUsers(ids, token), fetchChannels(ids, token), knownBoxArt(gameIds, token)]);
  return merge(selected, toStreamers0V(selected.kept, users, channels), boxArt, streams);
}

// Box art never changes per game: only unseen ids hit /games.
// ponytail: per-instance memory, unbounded (FR games seen stay ~thousands)
const boxArtSeen: BoxArt = {};

async function knownBoxArt(gameIds: string[], token: string): Promise<BoxArt> {
  const missing = gameIds.filter((id) => !(id in boxArtSeen));
  if (missing.length > 0) {
    // box art is cosmetic: a /games failure must not kill the crawl
    const fetched = await fetchGames(missing, token).catch((error) => (console.error(error), []));
    Object.assign(boxArtSeen, toBoxArt(fetched));
  }
  return Object.fromEntries(gameIds.filter((id) => id in boxArtSeen).map((id) => [id, boxArtSeen[id]]));
}

// Full crawl: ~100 Helix pages. Same 15 min as the /api/crawl CDN cache:
// Hobby quota (4 CPU-h). Throw never cached. ADR 0002.
export const CRAWL_SECONDS = 900;

async function cachedCrawl(): Promise<Crawl> {
  "use cache";
  cacheLife({ stale: 60, revalidate: CRAWL_SECONDS, expire: 3600 });
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

export type LiveCrawl = Omit<Crawl, "setAside">;

export async function getLiveCrawl(): Promise<LiveCrawl> {
  const { streamers, boxArt, liveCount, zeroCount, crawledAt } = await getCrawl();
  return { streamers, boxArt, liveCount, zeroCount, crawledAt };
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

// Twitch search is fuzzy: slug words as query, exact slug match only.
// Names never change, hence weeks; a throw is not cached.
export async function findCategory(slug: string): Promise<Category | null> {
  "use cache";
  cacheLife("weeks");
  const found = await searchCategories(slug.replace(/-/g, " "));
  return found.find((c) => c.slug === slug) ?? null;
}
