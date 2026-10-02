import { describe, expect, it } from "vitest";
import { MAX_STREAMERS, selectStreams, toStreamer0V } from "@/decouverte/rule";
import type { HelixStream } from "@/decouverte/types";

const now = new Date("2026-10-02T20:00:00Z");
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();

const stream = (id: string, viewers: number, liveMinutes: number): HelixStream => ({
  user_id: id,
  user_login: `login${id}`,
  user_name: `Name${id}`,
  game_name: "Just Chatting",
  title: `Title ${id}`,
  viewer_count: viewers,
  started_at: minutesAgo(liveMinutes),
  thumbnail_url: `https://static-cdn.jtvnw.net/previews-ttv/live_user_login${id}-{width}x{height}.jpg`,
});

describe("selectStreams", () => {
  it("returns empty for empty input", () => {
    expect(selectStreams([], now)).toEqual([]);
  });

  it("drops streams live for 10 minutes or less", () => {
    const ids = selectStreams([stream("a", 0, 10), stream("b", 0, 11)], now).map((s) => s.user_id);
    expect(ids).toEqual(["b"]);
  });

  it("drops streams above 5 viewers", () => {
    const ids = selectStreams([stream("a", 6, 30), stream("b", 5, 30)], now).map((s) => s.user_id);
    expect(ids).toEqual(["b"]);
  });

  it("puts zeros first, then fewest viewers", () => {
    const ids = selectStreams([stream("a", 3, 30), stream("b", 0, 30), stream("c", 1, 30)], now).map((s) => s.user_id);
    expect(ids).toEqual(["b", "c", "a"]);
  });

  it("breaks viewer ties by longest live first", () => {
    const ids = selectStreams([stream("a", 0, 20), stream("b", 0, 90)], now).map((s) => s.user_id);
    expect(ids).toEqual(["b", "a"]);
  });

  it("caps at MAX_STREAMERS", () => {
    const many = Array.from({ length: 150 }, (_, i) => stream(String(i), 0, 30 + i));
    expect(selectStreams(many, now)).toHaveLength(MAX_STREAMERS);
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
