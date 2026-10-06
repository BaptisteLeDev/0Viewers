import { describe, expect, it } from "vitest";
import { HIDE_AT, hiddenSince, nextVote, parseVote } from "./rule";

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

describe("hiddenSince", () => {
  const at = (n: number) => Array.from({ length: n }, (_, i) => (n - i) * 1000);

  it("hides at the HIDE_AT-th Signalement, dated by its arrival", () => {
    expect(hiddenSince(at(HIDE_AT - 1), null)).toBeNull();
    expect(hiddenSince(at(HIDE_AT), null)).toBe(HIDE_AT * 1000);
    expect(hiddenSince(at(HIDE_AT + 3), null)).toBe(HIDE_AT * 1000);
  });

  it("an unhide only counts later Signalements", () => {
    expect(hiddenSince(at(HIDE_AT + 3), 4000)).toBeNull();
    expect(hiddenSince(at(HIDE_AT + 3), 3000)).toBe((HIDE_AT + 3) * 1000);
  });
});
