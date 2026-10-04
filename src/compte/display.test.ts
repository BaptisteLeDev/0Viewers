import { describe, expect, it } from "vitest";
import { DISPLAY_COOKIE, parseDisplayCookie, toDisplayCookie } from "./display";

const viewer = { id: "1", login: "pseudo", displayName: "Pseudo é", avatarUrl: "https://static-cdn.jtvnw.net/a.png" };
const header = (value: string) => `a=1; ${DISPLAY_COOKIE}=${encodeURIComponent(value)}; b=2`;

describe("display cookie", () => {
  it("round-trips name and avatar only", () => {
    expect(parseDisplayCookie(header(toDisplayCookie(viewer)))).toEqual({ displayName: "Pseudo é", avatarUrl: viewer.avatarUrl });
  });

  it("rejects missing, garbage and non-https avatar", () => {
    expect(parseDisplayCookie("a=1")).toBeNull();
    expect(parseDisplayCookie(header("{oops"))).toBeNull();
    expect(parseDisplayCookie(header(JSON.stringify({ displayName: "x", avatarUrl: "javascript:alert(1)" })))).toBeNull();
  });
});
