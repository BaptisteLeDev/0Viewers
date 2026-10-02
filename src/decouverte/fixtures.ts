import type { HelixStream, HelixUser } from "./types";

const games = ["Just Chatting", "Minecraft", "League of Legends", "Valorant", "Pokémon Écarlate"];
const viewers = [0, 0, 0, 1, 2, 5, 0, 3, 7, 0];

export function fixtureStreams(now: Date): HelixStream[] {
  return viewers.map((viewer_count, i) => ({
    user_id: `fx${i}`,
    user_login: `streamer_fr_${i}`,
    user_name: `StreamerFR${i}`,
    game_name: games[i % games.length],
    title: `Live détente numéro ${i}, venez dire bonjour !`,
    viewer_count,
    started_at: new Date(now.getTime() - (i === 9 ? 5 : 20 + i * 15) * 60_000).toISOString(),
    thumbnail_url: "/fixtures/thumb.svg",
  }));
}

export function fixtureUsers(ids: string[]): Map<string, HelixUser> {
  return new Map(ids.map((id) => [id, { id, login: `streamer_fr_${id.slice(2)}`, display_name: `StreamerFR${id.slice(2)}`, profile_image_url: "/fixtures/avatar.svg" }]));
}
