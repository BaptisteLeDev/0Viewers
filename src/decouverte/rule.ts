import type { HelixChannel, HelixStream, HelixUser, Streamer0V } from "./types";

export const MAX_VIEWERS = 5;
export const MIN_LIVE_MINUTES = 10;
export const MAX_STREAMERS = 150;

export function selectStreams(streams: HelixStream[], now: Date): HelixStream[] {
  const minStart = now.getTime() - MIN_LIVE_MINUTES * 60_000;
  return streams
    .filter((s) => s.viewer_count <= MAX_VIEWERS && Date.parse(s.started_at) < minStart)
    .sort((a, b) => a.viewer_count - b.viewer_count || Date.parse(a.started_at) - Date.parse(b.started_at))
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
