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

export function selectStreams(streams: HelixStream[], now: Date): HelixStream[] {
  const minStart = now.getTime() - MIN_LIVE_MINUTES * 60_000;
  return streams
    .filter((s) => s.viewer_count <= MAX_VIEWERS && Date.parse(s.started_at) < minStart && !isMediaStream(s))
    .sort((a, b) => +hasMediaLogin(a) - +hasMediaLogin(b) || a.viewer_count - b.viewer_count || Date.parse(a.started_at) - Date.parse(b.started_at))
    .slice(0, MAX_STREAMERS);
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
