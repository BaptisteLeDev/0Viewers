import { describe, expect, it } from "vitest";
import { MAX_STREAMERS, selectStreams, toStreamer0V, toStreamers0V } from "@/decouverte/rule";
import type { HelixStream } from "@/decouverte/types";

const now = new Date("2026-10-02T20:00:00Z");
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();

const stream = (id: string, viewers: number, liveMinutes: number): HelixStream => ({
  user_id: id,
  user_login: `login${id}`,
  user_name: `Name${id}`,
  game_id: "509658",
  game_name: "Just Chatting",
  title: `Title ${id}`,
  viewer_count: viewers,
  started_at: minutesAgo(liveMinutes),
  thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_login${id}-{width}x{height}.jpg`,
});

describe("selectStreams", () => {
  it("returns empty for empty input", () => {
    expect(selectStreams([], now)).toEqual({ kept: [], setAside: [] });
  });

  it("drops streams live for 10 minutes or less", () => {
    const ids = selectStreams([stream("a", 0, 10), stream("b", 0, 11)], now).kept.map((s) => s.user_id);
    expect(ids).toEqual(["b"]);
  });

  it("drops streams above 5 viewers", () => {
    const ids = selectStreams([stream("a", 6, 30), stream("b", 5, 30)], now).kept.map((s) => s.user_id);
    expect(ids).toEqual(["b"]);
  });

  it("puts zeros first, then fewest viewers", () => {
    const ids = selectStreams([stream("a", 3, 30), stream("b", 0, 30), stream("c", 1, 30)], now).kept.map((s) => s.user_id);
    expect(ids).toEqual(["b", "c", "a"]);
  });

  it("breaks viewer ties by longest live first", () => {
    const ids = selectStreams([stream("a", 0, 20), stream("b", 0, 90)], now).kept.map((s) => s.user_id);
    expect(ids).toEqual(["b", "a"]);
  });

  it("drops media streams by title, category or tag", () => {
    const media = [
      { ...stream("a", 0, 30), title: "Radio libre 24/7" },
      { ...stream("b", 0, 30), game_name: "Ville de Lyon" },
      { ...stream("c", 0, 30), tags: ["FranceTV"] },
      { ...stream("d", 0, 30), title: "Les villes de France" },
      { ...stream("g", 0, 30), tags: ["webradio"] },
      { ...stream("h", 0, 30), tags: ["Années80"] },
      { ...stream("i", 0, 30), tags: ["annee70"] },
      { ...stream("j", 0, 30), tags: ["Oldies"] },
      { ...stream("k", 0, 30), title: "Le Journal de 20h" },
      { ...stream("l", 0, 30), title: "Revue des médias" },
      { ...stream("m", 0, 30), tags: ["JournalTélévisé"] },
    ];
    const kept = [stream("e", 0, 30), { ...stream("f", 0, 30), title: "Souffrance sur Elden Ring" }];
    expect(selectStreams([...media, ...kept], now).kept.map((s) => s.user_id)).toEqual(["e", "f"]);
  });

  it("keeps media-like logins but ranks them last", () => {
    const ids = selectStreams([{ ...stream("a", 0, 90), user_login: "maxtv" }, stream("b", 3, 30)], now).kept.map((s) => s.user_id);
    expect(ids).toEqual(["b", "a"]);
  });

  it("drops crypto by login, tag or category, ranks crypto titles last", () => {
    const dropped = [
      { ...stream("a", 0, 30), user_login: "btc_daily" },
      { ...stream("b", 0, 30), tags: ["CryptoMonnaie"] },
      { ...stream("c", 0, 30), game_name: "Crypto" },
    ];
    const kept = [{ ...stream("d", 0, 90), title: "Session TRADING du soir" }, stream("e", 4, 30)];
    expect(selectStreams([...dropped, ...kept], now).kept.map((s) => s.user_id)).toEqual(["e", "d"]);
  });

  it("sets aside excluded streams with their reason, ignores ineligible ones", () => {
    const { setAside } = selectStreams([{ ...stream("a", 0, 30), title: "Radio" }, { ...stream("b", 0, 30), user_login: "btc" }, { ...stream("c", 9, 30), title: "Radio" }], now);
    expect(setAside.map((s) => [s.id, s.reason])).toEqual([["a", "media"], ["b", "crypto"]]);
  });

  it("caps at MAX_STREAMERS", () => {
    const many = Array.from({ length: 150 }, (_, i) => stream(String(i), 0, 30 + i));
    expect(selectStreams(many, now).kept).toHaveLength(MAX_STREAMERS);
  });
});

describe("toStreamers0V", () => {
  it("drops channels whose bio talks crypto", () => {
    const user = (id: string, description: string) => [id, { id, login: id, display_name: id, profile_image_url: "", description }] as const;
    const users = new Map([user("a", "Je parle de Bitcoin et de BTC"), user("b", "Chill et jeux rétro")]);
    expect(toStreamers0V([stream("a", 0, 30), stream("b", 0, 30)], users, new Map()).kept.map((s) => s.id)).toEqual(["b"]);
  });

  it("sets aside gambling channels (CCL Paris)", () => {
    const channels = new Map([["a", { broadcaster_id: "a", content_classification_labels: ["Gambling"] }], ["b", { broadcaster_id: "b", content_classification_labels: ["MatureGame"] }]]);
    const { kept, setAside } = toStreamers0V([stream("a", 0, 30), stream("b", 0, 30)], new Map(), channels);
    expect(kept.map((s) => s.id)).toEqual(["b"]);
    expect(setAside.map((s) => [s.id, s.reason])).toEqual([["a", "gambling"]]);
  });
});

describe("toStreamer0V", () => {
  it("uses user profile when present", () => {
    const s = toStreamer0V(stream("a", 0, 30), { id: "a", login: "real", display_name: "Real", profile_image_url: "https://x/p.png" });
    expect(s).toMatchObject({ id: "a", login: "real", displayName: "Real", profileImageUrl: "https://x/p.png", viewerCount: 0 });
  });

  it("falls back to stream login and name when user is missing", () => {
    const s = toStreamer0V(stream("a", 2, 30), undefined);
    expect(s).toMatchObject({ login: "logina", displayName: "Namea", profileImageUrl: "", mature: false });
  });

  it("flags mature when the channel has any content classification label", () => {
    const channel = (labels: string[]) => ({ broadcaster_id: "a", content_classification_labels: labels });
    expect(toStreamer0V(stream("a", 0, 30), undefined, channel(["MatureGame"])).mature).toBe(true);
    expect(toStreamer0V(stream("a", 0, 30), undefined, channel([])).mature).toBe(false);
  });
});
