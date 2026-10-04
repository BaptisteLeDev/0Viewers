import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ cacheLife: () => {} }));
const { sql } = vi.hoisted(() => ({ sql: vi.fn() }));
vi.mock("@/db", () => ({ sql }));

import { saveLiveCount } from "./live-count";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  sql.mockReset();
});

describe("saveLiveCount", () => {
  it("inserts lives and crawl date", async () => {
    sql.mockResolvedValue([]);
    await saveLiveCount(42, 1_700_000_000_000);
    expect(sql).toHaveBeenCalledTimes(1);
    expect(sql.mock.calls[0].slice(1)).toEqual([new Date(Math.floor(1_700_000_000_000 / 3_600_000) * 3_600_000), 42]);
  });

  it("writes once per hour per instance", async () => {
    sql.mockResolvedValue([]);
    const hour = 3_600_000 * 500_000;
    await saveLiveCount(1, hour);
    await saveLiveCount(2, hour + 59 * 60_000);
    await saveLiveCount(3, hour + 3_600_000);
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it("skips on fixtures", async () => {
    vi.stubEnv("TWITCH_FIXTURES", "1");
    await saveLiveCount(1, 1);
    expect(sql).not.toHaveBeenCalled();
  });

  it("swallows db failure", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    sql.mockRejectedValue(new Error("boom"));
    await expect(saveLiveCount(1, 1)).resolves.toBeUndefined();
    expect(error).toHaveBeenCalled();
  });
});
