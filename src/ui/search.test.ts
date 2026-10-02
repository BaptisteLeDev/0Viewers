import { describe, expect, it } from "vitest";
import type { Streamer0V } from "@/decouverte/types";
import { matchesQuery, viewerLabel } from "@/ui/search";

const s: Streamer0V = {
  id: "1", login: "zelda_fr", displayName: "ZeldaFR", title: "Speedrun détente",
  gameName: "Pokémon Écarlate", startedAt: "", viewerCount: 0, thumbnailUrl: "", profileImageUrl: "",
};

describe("matchesQuery", () => {
  it("matches everything on blank query", () => expect(matchesQuery(s, "  ")).toBe(true));
  it("ignores case", () => expect(matchesQuery(s, "ZELDA")).toBe(true));
  it("ignores accents both ways", () => {
    expect(matchesQuery(s, "pokemon ecarlate")).toBe(true);
    expect(matchesQuery(s, "détente")).toBe(true);
  });
  it("does not strip ASCII symbols", () => expect(matchesQuery(s, "^")).toBe(false));
  it("searches name, title and game", () => {
    expect(matchesQuery(s, "speedrun")).toBe(true);
    expect(matchesQuery(s, "minecraft")).toBe(false);
  });
});

describe("viewerLabel", () => {
  it("handles singular and plural in French", () => {
    expect(viewerLabel(0)).toBe("0 spectateur");
    expect(viewerLabel(1)).toBe("1 spectateur");
    expect(viewerLabel(3)).toBe("3 spectateurs");
  });
});
