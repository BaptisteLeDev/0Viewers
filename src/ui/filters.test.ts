import { describe, expect, it } from "vitest";
import type { Streamer0V } from "@/decouverte/types";
import { DEFAULT_FILTERS, activeCount, applyFilters, gameOptions, parseFilters, toSearch, type Filters } from "@/ui/filters";

const now = Date.parse("2026-10-02T20:00:00Z");
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

const make = (id: string, viewerCount: number, liveMinutes: number, gameName = "Minecraft"): Streamer0V => ({
  id, login: id, displayName: `Streamer ${id}`, title: "Live détente", gameName,
  startedAt: ago(liveMinutes), viewerCount, thumbnailUrl: "", profileImageUrl: "",
});

// rule order: fewest viewers, then longest live first
const list = [
  make("a", 0, 200, "Minecraft"),
  make("b", 0, 30, "Just Chatting"),
  make("c", 1, 90, "Minecraft"),
  make("d", 2, 15, "Pokémon Écarlate"),
  make("e", 3, 240, "Minecraft"),
  make("f", 5, 60, "Just Chatting"),
];
const ids = (f: Partial<Filters>) => applyFilters(list, { ...DEFAULT_FILTERS, ...f }, now).map((s) => s.id).join("");

describe("applyFilters", () => {
  it("keeps everything in rule order by default", () => expect(ids({})).toBe("abcdef"));
  it("filters on viewer buckets", () => {
    expect(ids({ viewers: "0" })).toBe("ab");
    expect(ids({ viewers: "1-2" })).toBe("cd");
    expect(ids({ viewers: "3-5" })).toBe("ef");
  });
  it("filters on exact game name", () => {
    expect(ids({ game: "Minecraft" })).toBe("ace");
    expect(ids({ game: "Mine" })).toBe("");
  });
  it("filters on live duration with 1 h and 3 h boundaries", () => {
    expect(ids({ duration: "moins-1h" })).toBe("bd");
    expect(ids({ duration: "1-3h" })).toBe("cf");
    expect(ids({ duration: "plus-3h" })).toBe("ae");
  });
  it("drops invalid startedAt only when filtering on duration", () => {
    const broken = [{ ...make("x", 0, 10), startedAt: "nope" }];
    expect(applyFilters(broken, DEFAULT_FILTERS, now)).toHaveLength(1);
    expect(applyFilters(broken, { ...DEFAULT_FILTERS, duration: "moins-1h" }, now)).toHaveLength(0);
  });
  it("reuses the accent and case folding search", () => expect(ids({ q: "POKEMON" })).toBe("d"));
  it("combines filters", () => {
    expect(ids({ game: "Minecraft", viewers: "0" })).toBe("a");
    expect(ids({ game: "Just Chatting", duration: "1-3h", q: "streamer" })).toBe("f");
  });
  it("sorts by most recent live first", () => expect(ids({ sort: "recent" })).toBe("dbfcae"));
  it("sorts by longest live first", () => expect(ids({ sort: "long" })).toBe("eacfbd"));
  it("keeps ties stable and invalid dates last", () => {
    const tie = [make("p", 0, 30), make("q", 1, 30), { ...make("z", 0, 10), startedAt: "" }, make("r", 2, 30)];
    const order = (sort: Filters["sort"]) => applyFilters(tie, { ...DEFAULT_FILTERS, sort }, now).map((s) => s.id).join("");
    expect(order("recent")).toBe("pqrz");
    expect(order("long")).toBe("pqrz");
  });
  it("sorts by fewest viewers, stable on ties", () => {
    const shuffled = [make("m", 3, 10), make("n", 0, 10), make("o", 0, 99)];
    expect(applyFilters(shuffled, DEFAULT_FILTERS, now).map((s) => s.id).join("")).toBe("nom");
  });
  it("does not mutate its input", () => {
    const copy = [...list];
    applyFilters(list, { ...DEFAULT_FILTERS, sort: "recent" }, now);
    expect(list).toEqual(copy);
  });
});

describe("gameOptions", () => {
  it("lists games by count, then alphabetically", () => {
    expect(gameOptions(list)).toEqual([
      { name: "Minecraft", count: 3 },
      { name: "Just Chatting", count: 2 },
      { name: "Pokémon Écarlate", count: 1 },
    ]);
  });
  it("skips empty game names", () => expect(gameOptions([make("x", 0, 10, "")])).toEqual([]));
});

describe("parseFilters / toSearch", () => {
  const games = ["Minecraft", "Pokémon Écarlate"];
  const parse = (search: string) => parseFilters(new URLSearchParams(search), games);

  it("reads French params", () => {
    expect(parse("q=zelda&spectateurs=1-2&jeu=Pok%C3%A9mon+%C3%89carlate&duree=plus-3h&tri=recent")).toEqual({
      q: "zelda", viewers: "1-2", game: "Pokémon Écarlate", duration: "plus-3h", sort: "recent",
    });
  });
  it("falls back to defaults on invalid values", () => {
    expect(parse("spectateurs=9&jeu=Tetris&duree=2h&tri=random")).toEqual(DEFAULT_FILTERS);
  });
  it("round-trips and omits defaults", () => {
    const f: Filters = { q: "été", viewers: "0", game: "Minecraft", duration: "1-3h", sort: "long" };
    expect(parse(toSearch(f))).toEqual(f);
    expect(toSearch(DEFAULT_FILTERS)).toBe("");
    expect(toSearch({ ...DEFAULT_FILTERS, sort: "recent" })).toBe("tri=recent");
  });
  it("ignores a blank search", () => expect(toSearch({ ...DEFAULT_FILTERS, q: "   " })).toBe(""));
});

describe("activeCount", () => {
  it("counts panel filters, not the search box", () => {
    expect(activeCount(DEFAULT_FILTERS)).toBe(0);
    expect(activeCount({ ...DEFAULT_FILTERS, q: "x", viewers: "0", sort: "long" })).toBe(2);
  });
});
