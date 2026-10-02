import { describe, expect, it } from "vitest";
import { nextIndex, pickOther } from "@/ui/random";

describe("pickOther", () => {
  it("returns 0 for a single item", () => expect(pickOther(1, 0, () => 0.9)).toBe(0));
  it("never returns the current index when others exist", () => {
    for (const r of [0, 0.3, 0.6, 0.99]) expect(pickOther(3, 1, () => r)).not.toBe(1);
  });
  it("stays in range", () => {
    for (const r of [0, 0.5, 0.999]) {
      const i = pickOther(5, 4, () => r);
      expect(i).toBeGreaterThanOrEqual(0);
      expect(i).toBeLessThan(5);
    }
  });
});

describe("nextIndex", () => {
  it("moves to the following item", () => expect(nextIndex(3, 0)).toBe(1));
  it("wraps around after the last item", () => expect(nextIndex(3, 2)).toBe(0));
  it("stays on a single item", () => expect(nextIndex(1, 0)).toBe(0));
  it("starts at 0 when current is not in the list", () => expect(nextIndex(4, -1)).toBe(0));
});
