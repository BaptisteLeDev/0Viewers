import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAppToken, fetchChannels, fetchFrenchStreams, fetchUsers, searchHelixCategories } from "@/decouverte/twitch";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

beforeEach(() => {
  vi.stubEnv("TWITCH_CLIENT_ID", "cid");
  vi.stubEnv("TWITCH_CLIENT_SECRET", "secret");
});
afterEach(() => vi.unstubAllEnvs());

describe("fetchAppToken", () => {
  it("throws when access_token is missing in response", async () => {
    const fake = vi.fn().mockResolvedValue(json({}));
    await expect(fetchAppToken(fake)).rejects.toThrow("Twitch token missing");
  });
});

describe("fetchFrenchStreams", () => {
  it("follows the cursor until Twitch stops paginating", async () => {
    const fake = vi.fn()
      .mockResolvedValueOnce(json({ data: [{ user_id: "1" }], pagination: { cursor: "c1" } }))
      .mockResolvedValueOnce(json({ data: [{ user_id: "2" }], pagination: {} }));
    const streams = await fetchFrenchStreams("tok", fake);
    expect(streams.map((s) => s.user_id)).toEqual(["1", "2"]);
    expect(fake.mock.calls[1][0]).toContain("after=c1");
    expect(fake.mock.calls[0][0]).toContain("language=fr");
  });

  it("keeps the first stream when a user_id repeats across pages", async () => {
    const fake = vi.fn()
      .mockResolvedValueOnce(json({ data: [{ user_id: "1", viewer_count: 5 }], pagination: { cursor: "c1" } }))
      .mockResolvedValueOnce(json({ data: [{ user_id: "1", viewer_count: 4 }], pagination: {} }));
    const streams = await fetchFrenchStreams("tok", fake);
    expect(streams).toEqual([{ user_id: "1", viewer_count: 5 }]);
  });

  it("throws on Twitch error instead of returning an empty list", async () => {
    const fake = vi.fn().mockResolvedValue(json({}, 503));
    await expect(fetchFrenchStreams("tok", fake)).rejects.toThrow("503");
  });
});

describe("fetchUsers", () => {
  it("skips the call for no ids", async () => {
    const fake = vi.fn();
    expect((await fetchUsers([], "tok", fake)).size).toBe(0);
    expect(fake).not.toHaveBeenCalled();
  });

  it("batches ids in one call", async () => {
    const fake = vi.fn().mockResolvedValue(json({ data: [{ id: "1", login: "a", display_name: "A", profile_image_url: "" }] }));
    const users = await fetchUsers(["1", "2"], "tok", fake);
    expect(fake).toHaveBeenCalledTimes(1);
    expect(fake.mock.calls[0][0]).toContain("id=1&id=2");
    expect(users.get("1")?.login).toBe("a");
  });
});

describe("fetchChannels", () => {
  it("batches broadcaster ids and keys by broadcaster_id", async () => {
    const fake = vi.fn().mockResolvedValue(json({ data: [{ broadcaster_id: "1", content_classification_labels: ["Gambling"] }] }));
    const channels = await fetchChannels(["1", "2"], "tok", fake);
    expect(fake.mock.calls[0][0]).toContain("/channels?broadcaster_id=1&broadcaster_id=2");
    expect(channels.get("1")?.content_classification_labels).toEqual(["Gambling"]);
  });
});

describe("searchHelixCategories", () => {
  it("encodes the query", async () => {
    const fake = vi.fn().mockResolvedValue(json({ data: [] }));
    await searchHelixCategories("pokémon & co", "tok", fake);
    expect(fake.mock.calls[0][0]).toContain("/search/categories?query=pok%C3%A9mon+%26+co&first=20");
  });
});
