import { describe, expect, it } from "vitest";
import { formatLiveDuration } from "@/ui/duration";

const now = Date.parse("2026-10-02T20:00:00Z");
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString();

describe("formatLiveDuration", () => {
  it("shows minutes under one hour", () => {
    expect(formatLiveDuration(ago(12), now)).toBe("12 min");
    expect(formatLiveDuration(ago(59.9), now)).toBe("59 min");
  });
  it("shows hours and zero-padded minutes from one hour", () => {
    expect(formatLiveDuration(ago(72), now)).toBe("1 h 12");
    expect(formatLiveDuration(ago(125), now)).toBe("2 h 05");
  });
  it("drops minutes on a round hour", () => {
    expect(formatLiveDuration(ago(180), now)).toBe("3 h");
  });
  it("clamps a start in the future to 0 min", () => {
    expect(formatLiveDuration(ago(-3), now)).toBe("0 min");
  });
});
