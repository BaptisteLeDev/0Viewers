import { describe, expect, it } from "vitest";
import { pickOther } from "@/ui/random";

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
