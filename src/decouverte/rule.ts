import { fold } from "./categories";
import type { HelixChannel, HelixStream, HelixUser, Streamer0V } from "./types";

export const MAX_VIEWERS = 5;
export const MIN_LIVE_MINUTES = 10;
export const MAX_STREAMERS = 150;

const MEDIA_WORDS = ["radio", "tv", "france", "ville"];
// camelCase split so "FranceTV" hits, word bounds so "souffrance" does not
const MEDIA_TEXT = new RegExp(`(?<!\\p{L})(${MEDIA_WORDS.join("|")})s?(?!\\p{L})`, "iu");
const splitCamel = (text: string) => text.replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2");

// tags are single glued tokens ("webradio", "Années80"): substring match
const MEDIA_TAG = /radio|tv|france|ville|oldies|annees?[78]0/;

const isMediaStream = (s: HelixStream) =>
  MEDIA_TEXT.test(splitCamel(`${s.title} ${s.game_name}`)) || (s.tags ?? []).some((t) => MEDIA_TAG.test(fold(t)));
const hasMediaLogin = (s: HelixStream) => MEDIA_WORDS.some((w) => s.user_login.toLowerCase().includes(w));

// prefix match: "cryptomonnaie", "BTCUSD"
const CRYPTO = /(?<!\p{L})(trading|crypto|btc)/iu;
const CRYPTO_GLUED = /trading|crypto|btc/;
const isCryptoChannel = (s: HelixStream) =>
  CRYPTO_GLUED.test(s.user_login.toLowerCase()) || CRYPTO.test(s.game_name) || (s.tags ?? []).some((t) => CRYPTO_GLUED.test(fold(t)));
const isRankedLast = (s: HelixStream) => hasMediaLogin(s) || CRYPTO.test(splitCamel(s.title));

export function selectStreams(streams: HelixStream[], now: Date): HelixStream[] {
  const minStart = now.getTime() - MIN_LIVE_MINUTES * 60_000;
  return streams
    .filter((s) => s.viewer_count <= MAX_VIEWERS && Date.parse(s.started_at) < minStart && !isMediaStream(s) && !isCryptoChannel(s))
    .sort((a, b) => +isRankedLast(a) - +isRankedLast(b) || a.viewer_count - b.viewer_count || Date.parse(a.started_at) - Date.parse(b.started_at))
    .slice(0, MAX_STREAMERS);
}

// Bio comes from /users, fetched after the cut: list may end under 150.
export function toStreamers0V(streams: HelixStream[], users: Map<string, HelixUser>, channels: Map<string, HelixChannel>): Streamer0V[] {
  return streams
    .filter((s) => !CRYPTO.test(splitCamel(users.get(s.user_id)?.description ?? "")))
    .map((s) => toStreamer0V(s, users.get(s.user_id), channels.get(s.user_id)));
}

export function toStreamer0V(stream: HelixStream, user: HelixUser | undefined, channel?: HelixChannel): Streamer0V {
  return {
    id: stream.user_id,
    login: user?.login ?? stream.user_login,
    displayName: user?.display_name ?? stream.user_name,
    title: stream.title,
    categoryId: stream.game_id,
    categoryName: stream.game_name,
    startedAt: stream.started_at,
    viewerCount: stream.viewer_count,
    thumbnailUrl: stream.thumbnail_url,
    profileImageUrl: user?.profile_image_url ?? "",
    mature: (channel?.content_classification_labels.length ?? 0) > 0,
  };
}
