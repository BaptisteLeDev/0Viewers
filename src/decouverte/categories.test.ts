import { describe, expect, it } from "vitest";
import { groupByCategory, slugifyCategory } from "./categories";
import type { Streamer0V } from "./types";

describe("slugifyCategory", () => {
  it.each([
    ["League of Legends", "league-of-legends"],
    ["Discussion", "discussion"],
    ["Pokémon Écarlate et Violet", "pokemon-ecarlate-et-violet"],
    ["  Tom Clancy's Rainbow Six: Siege  ", "tom-clancy-s-rainbow-six-siege"],
    ["Counter-Strike 2", "counter-strike-2"],
    ["--Just   Chatting!!", "just-chatting"],
    ["", ""],
    ["C++", "c-plus-plus"],
    ["C#", "c-sharp"],
    ["Dungeons & Dragons", "dungeons-et-dragons"],
  ])("%s -> %s", (name, slug) => expect(slugifyCategory(name)).toBe(slug));
});

const make = (id: string, categoryName: string): Streamer0V => ({
  id, login: id, displayName: id, title: "", categoryName,
  startedAt: "", viewerCount: 0, categoryId: "", thumbnailUrl: "", profileImageUrl: "", mature: false,
});

describe("groupByCategory", () => {
  const list = [make("a", "Minecraft"), make("b", "Just Chatting"), make("c", "Minecraft"), make("d", "Pokémon Écarlate"), make("e", "Just Chatting"), make("f", "Minecraft")];

  it("groups by slug, sorted by count desc then name", () => {
    expect(groupByCategory(list).map(({ slug, name, count }) => ({ slug, name, count }))).toEqual([
      { slug: "minecraft", name: "Minecraft", count: 3 },
      { slug: "just-chatting", name: "Just Chatting", count: 2 },
      { slug: "pokemon-ecarlate", name: "Pokémon Écarlate", count: 1 },
    ]);
  });
  it("attaches the box art of the category id, empty when unknown", () => {
    const art = groupByCategory([{ ...make("a", "Minecraft"), categoryId: "27471" }, make("b", "Valorant")], { "27471": "https://x/{width}x{height}.jpg" });
    expect(art.map((g) => g.boxArtUrl)).toEqual(["https://x/{width}x{height}.jpg", ""]);
  });
  it("keeps the streamers of each category in input order", () => {
    expect(groupByCategory(list)[0].streamers.map((s) => s.id)).toEqual(["a", "c", "f"]);
  });
  it("breaks count ties alphabetically, accent aware", () => {
    expect(groupByCategory([make("x", "Valorant"), make("y", "Échecs"), make("z", "Apex")]).map((g) => g.name)).toEqual(["Apex", "Échecs", "Valorant"]);
  });
  it("keeps symbol-named categories apart", () => {
    expect(groupByCategory([make("x", "C++"), make("y", "C#"), make("z", "C")]).map((g) => g.slug).sort()).toEqual(["c", "c-plus-plus", "c-sharp"]);
  });
  it("merges accent variants on purpose, keeping the first name", () => {
    expect(groupByCategory([make("x", "Pokemon"), make("y", "Pokémon")]).map(({ name, count }) => ({ name, count }))).toEqual([{ name: "Pokemon", count: 2 }]);
  });
  it("skips categories whose name has no slug", () => {
    expect(groupByCategory([make("x", ""), make("y", "!!!")])).toEqual([]);
  });
});
