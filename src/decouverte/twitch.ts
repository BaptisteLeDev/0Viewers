import type { HelixCategory, HelixChannel, HelixStream, HelixUser } from "./types";

const HELIX = "https://api.twitch.tv/helix";
const MAX_PAGES = 100;

type Fetch = typeof fetch;

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export async function fetchAppToken(fetchImpl: Fetch = fetch): Promise<string> {
  const res = await fetchImpl("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: requireEnv("TWITCH_CLIENT_ID"),
      client_secret: requireEnv("TWITCH_CLIENT_SECRET"),
      grant_type: "client_credentials",
    }),
  });
  if (!res.ok) throw new Error(`Twitch token ${res.status}`);
  const body = (await res.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("Twitch token missing");
  return body.access_token;
}

async function helix<T>(path: string, token: string, fetchImpl: Fetch): Promise<T> {
  const res = await fetchImpl(`${HELIX}${path}`, {
    headers: { Authorization: `Bearer ${token}`, "Client-Id": requireEnv("TWITCH_CLIENT_ID") },
  });
  if (!res.ok) throw new Error(`Twitch ${path.split("?")[0]} ${res.status}`);
  return (await res.json()) as T;
}

export async function fetchFrenchStreams(token: string, fetchImpl: Fetch = fetch): Promise<HelixStream[]> {
  const streams = new Map<string, HelixStream>();
  let cursor: string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    const query = new URLSearchParams({ language: "fr", first: "100" });
    if (cursor) query.set("after", cursor);
    const body = await helix<{ data: HelixStream[]; pagination: { cursor?: string } }>(`/streams?${query}`, token, fetchImpl);
    for (const s of body.data) if (!streams.has(s.user_id)) streams.set(s.user_id, s);
    cursor = body.pagination.cursor;
    if (!cursor || body.data.length === 0) break;
  }
  if (cursor) console.warn(`Twitch pagination capped at ${MAX_PAGES} pages, lowest-viewer streams may be missing`);
  return [...streams.values()];
}

// Helix caps id lists at 100 = MAX_STREAMERS, so one call is enough
async function fetchByIds<T>(path: string, param: string, ids: string[], token: string, fetchImpl: Fetch): Promise<T[]> {
  if (ids.length === 0) return [];
  const query = new URLSearchParams(ids.map((id) => [param, id]));
  return (await helix<{ data: T[] }>(`${path}?${query}`, token, fetchImpl)).data;
}

export async function fetchUsers(ids: string[], token: string, fetchImpl: Fetch = fetch): Promise<Map<string, HelixUser>> {
  const users = await fetchByIds<HelixUser>("/users", "id", ids, token, fetchImpl);
  return new Map(users.map((u) => [u.id, u]));
}

export async function fetchChannels(ids: string[], token: string, fetchImpl: Fetch = fetch): Promise<Map<string, HelixChannel>> {
  const channels = await fetchByIds<HelixChannel>("/channels", "broadcaster_id", ids, token, fetchImpl);
  return new Map(channels.map((c) => [c.broadcaster_id, c]));
}

export async function searchHelixCategories(query: string, token: string, fetchImpl: Fetch = fetch): Promise<HelixCategory[]> {
  const params = new URLSearchParams({ query, first: "20" });
  return (await helix<{ data: HelixCategory[] }>(`/search/categories?${params}`, token, fetchImpl)).data;
}
