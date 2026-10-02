import "server-only";
import { fixtureStreams, fixtureUsers } from "./fixtures";
import { selectStreams, toStreamer0V } from "./rule";
import { fetchAppToken, fetchFrenchStreams, fetchUsers } from "./twitch";
import type { Streamer0V } from "./types";

export type { Streamer0V } from "./types";
export { MAX_VIEWERS, MIN_LIVE_MINUTES } from "./rule";

export async function getZeroViewersStreamers(): Promise<Streamer0V[]> {
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
