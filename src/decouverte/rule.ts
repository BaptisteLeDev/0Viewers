import { fold } from "./categories";
import type { HelixChannel, HelixStream, HelixUser, SetAsideReason, SetAsideStream, Streamer0V } from "./types";

export const MAX_VIEWERS = 5;
export const MIN_LIVE_MINUTES = 10;
export const MAX_STREAMERS = 150;

export const MEDIA_WORDS = ["radio", "tv", "france", "ville", "media", "journal", "journaux"];
export const MEDIA_TAG_WORDS = ["oldies", "annee70", "annees70", "annee80", "annees80"];
export const CRYPTO_WORDS = ["trading", "crypto", "btc"];
// Twitch CCL id for "Paris" (jeux d'argent)
export const GAMBLING = "Gambling";
// camelCase split so "FranceTV" hits, word bounds so "souffrance" does not
const MEDIA_TEXT = new RegExp(`(?<!\\p{L})(${MEDIA_WORDS.join("|")})s?(?!\\p{L})`, "iu");
const splitCamel = (text: string) => text.replace(/(\p{Ll})(\p{Lu})/gu, "$1 $2");

// tags are single glued tokens ("webradio", "Années80"): substring match
const MEDIA_TAG = new RegExp([...MEDIA_WORDS, ...MEDIA_TAG_WORDS].join("|"));

const isMediaStream = (s: HelixStream) =>
  MEDIA_TEXT.test(fold(splitCamel(`${s.title} ${s.game_name}`))) || (s.tags ?? []).some((t) => MEDIA_TAG.test(fold(t)));
const hasMediaLogin = (s: HelixStream) => MEDIA_WORDS.some((w) => s.user_login.toLowerCase().includes(w));

// prefix match: "cryptomonnaie", "BTCUSD"
const CRYPTO = new RegExp(`(?<!\\p{L})(${CRYPTO_WORDS.join("|")})`, "iu");
const CRYPTO_GLUED = new RegExp(CRYPTO_WORDS.join("|"));
const isCryptoChannel = (s: HelixStream) =>
  CRYPTO_GLUED.test(s.user_login.toLowerCase()) || CRYPTO.test(s.game_name) || (s.tags ?? []).some((t) => CRYPTO_GLUED.test(fold(t)));
const isRankedLast = (s: HelixStream) => hasMediaLogin(s) || CRYPTO.test(splitCamel(s.title));

const streamReason = (s: HelixStream): SetAsideReason | null => (isMediaStream(s) ? "media" : isCryptoChannel(s) ? "crypto" : null);

const byRank = (a: HelixStream, b: HelixStream) =>
  +isRankedLast(a) - +isRankedLast(b) || a.viewer_count - b.viewer_count || Date.parse(a.started_at) - Date.parse(b.started_at);

export function toSetAside(s: Omit<SetAsideStream, "reason">, reason: SetAsideReason): SetAsideStream {
  const { id, login, displayName, title, categoryName, viewerCount } = s;
  return { id, login, displayName, title, categoryName, viewerCount, reason };
}

const helixSetAside = (s: HelixStream, reason: SetAsideReason) =>
  toSetAside({ id: s.user_id, login: s.user_login, displayName: s.user_name, title: s.title, categoryName: s.game_name, viewerCount: s.viewer_count }, reason);

export function selectStreams(streams: HelixStream[], now: Date): { kept: HelixStream[]; setAside: SetAsideStream[] } {
  const minStart = now.getTime() - MIN_LIVE_MINUTES * 60_000;
  const eligible = streams.filter((s) => s.viewer_count <= MAX_VIEWERS && Date.parse(s.started_at) < minStart).sort(byRank);
  const kept: HelixStream[] = [];
  const setAside: SetAsideStream[] = [];
  for (const s of eligible) {
    const reason = streamReason(s);
    if (reason) setAside.push(helixSetAside(s, reason));
    else kept.push(s);
  }
  return { kept: kept.slice(0, MAX_STREAMERS), setAside: setAside.slice(0, MAX_STREAMERS) };
}

// Bio and CCL come from /users and /channels, fetched after the cut:
// list may end under 150.
export function toStreamers0V(
  streams: HelixStream[],
  users: Map<string, HelixUser>,
  channels: Map<string, HelixChannel>,
): { kept: Streamer0V[]; setAside: SetAsideStream[] } {
  const kept: Streamer0V[] = [];
  const setAside: SetAsideStream[] = [];
  for (const s of streams) {
    const user = users.get(s.user_id);
    const channel = channels.get(s.user_id);
    const reason = CRYPTO.test(splitCamel(user?.description ?? ""))
      ? "crypto"
      : channel?.content_classification_labels.includes(GAMBLING)
        ? "gambling"
        : null;
    const streamer = toStreamer0V(s, user, channel);
    if (reason) setAside.push(toSetAside(streamer, reason));
    else kept.push(streamer);
  }
  return { kept, setAside };
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
