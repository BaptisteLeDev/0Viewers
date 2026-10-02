import { describe, expect, it } from "vitest";
import { groupByGame, slugifyGame } from "./games";
import type { Streamer0V } from "./types";

describe("slugifyGame", () => {
  it.each([
    ["League of Legends", "league-of-legends"],
    ["Discussion", "discussion"],
    ["Pokémon Écarlate et Violet", "pokemon-ecarlate-et-violet"],
    ["  Tom Clancy's Rainbow Six: Siege  ", "tom-clancy-s-rainbow-six-siege"],
    ["Counter-Strike 2", "counter-strike-2"],
    ["--Just   Chatting!!", "just-chatting"],
    ["", ""],
  ])("%s -> %s", (name, slug) => expect(slugifyGame(name)).toBe(slug));
});

const make = (id: string, gameName: string): Streamer0V => ({
  id, login: id, displayName: id, title: "", gameName,
  startedAt: "", viewerCount: 0, thumbnailUrl: "", profileImageUrl: "",
});

describe("groupByGame", () => {
  const list = [make("a", "Minecraft"), make("b", "Just Chatting"), make("c", "Minecraft"), make("d", "Pokémon Écarlate"), make("e", "Just Chatting"), make("f", "Minecraft")];

  it("groups by slug, sorted by count desc then name", () => {
    expect(groupByGame(list).map(({ slug, name, count }) => ({ slug, name, count }))).toEqual([
      { slug: "minecraft", name: "Minecraft", count: 3 },
      { slug: "just-chatting", name: "Just Chatting", count: 2 },
      { slug: "pokemon-ecarlate", name: "Pokémon Écarlate", count: 1 },
    ]);
  });
  it("keeps the streamers of each game in input order", () => {
    expect(groupByGame(list)[0].streamers.map((s) => s.id)).toEqual(["a", "c", "f"]);
  });
  it("breaks count ties alphabetically, accent aware", () => {
    expect(groupByGame([make("x", "Valorant"), make("y", "Échecs"), make("z", "Apex")]).map((g) => g.name)).toEqual(["Apex", "Échecs", "Valorant"]);
  });
  it("skips games whose name has no slug", () => {
    expect(groupByGame([make("x", ""), make("y", "!!!")])).toEqual([]);
  });
});
