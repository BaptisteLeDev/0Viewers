import { describe, expect, it } from "vitest";
import { nextVote, parseVote } from "./rule";

describe("parseVote", () => {
  it("accepts a numeric Twitch id and -1, 0, 1", () => {
    for (const value of [-1, 0, 1]) expect(parseVote("123456", value)).toEqual({ broadcasterId: "123456", value });
  });

  it("rejects anything else", () => {
    expect(parseVote("12a", 1)).toBeNull();
    expect(parseVote("", 1)).toBeNull();
    expect(parseVote(123, 1)).toBeNull();
    expect(parseVote("1", 2)).toBeNull();
    expect(parseVote("1", "1")).toBeNull();
  });
});

describe("nextVote", () => {
  it("toggles the clicked button and switches from the other", () => {
    expect(nextVote(0, -1)).toBe(-1);
    expect(nextVote(-1, -1)).toBe(0);
    expect(nextVote(1, -1)).toBe(-1);
    expect(nextVote(-1, 1)).toBe(1);
  });
});
