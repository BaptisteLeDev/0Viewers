import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchAppToken, fetchFrenchStreams, fetchUsers } from "@/decouverte/twitch";

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
