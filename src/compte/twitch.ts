import "server-only";
import { sql } from "@/db";
import type { Viewer } from "./session";

const ID = "https://id.twitch.tv/oauth2";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env ${name}`);
  return value;
}

export const sessionSecret = () => requireEnv("SESSION_SECRET");

export function authorizeUrl(redirectUri: string, state: string): string {
  const params = new URLSearchParams({ client_id: requireEnv("TWITCH_CLIENT_ID"), redirect_uri: redirectUri, response_type: "code", scope: "", state });
  return `${ID}/authorize?${params}`;
}

export async function fetchTwitchViewer(code: string, redirectUri: string, fetchImpl: typeof fetch = fetch): Promise<Viewer> {
  const clientId = requireEnv("TWITCH_CLIENT_ID");
  const tokenRes = await fetchImpl(`${ID}/token`, {
    method: "POST",
    body: new URLSearchParams({ client_id: clientId, client_secret: requireEnv("TWITCH_CLIENT_SECRET"), code, grant_type: "authorization_code", redirect_uri: redirectUri }),
  });
  if (!tokenRes.ok) throw new Error(`Twitch user token ${tokenRes.status}`);
  const { access_token } = (await tokenRes.json()) as { access_token?: string };
  if (!access_token) throw new Error("Twitch user token missing");

  const userRes = await fetchImpl("https://api.twitch.tv/helix/users", { headers: { "Client-Id": clientId, Authorization: `Bearer ${access_token}` } });
  if (!userRes.ok) throw new Error(`Twitch /users ${userRes.status}`);
  const { data } = (await userRes.json()) as { data: { id: string; login: string; display_name: string; profile_image_url: string }[] };
  const user = data[0];
  if (!user) throw new Error("Twitch /users empty");
  return { id: user.id, login: user.login, displayName: user.display_name, avatarUrl: user.profile_image_url };
}

export async function saveViewer(v: Viewer): Promise<void> {
  if (!sql) throw new Error("Missing env DATABASE_URL");
  await sql`
    INSERT INTO viewer (twitch_id, login, display_name, avatar_url)
    VALUES (${v.id}, ${v.login}, ${v.displayName}, ${v.avatarUrl})
    ON CONFLICT (twitch_id) DO UPDATE SET login = EXCLUDED.login, display_name = EXCLUDED.display_name, avatar_url = EXCLUDED.avatar_url`;
}
