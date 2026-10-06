import { describe, expect, it } from "vitest";
import { SESSION_MAX_AGE, isOwner, signSession, verifySession, type Viewer } from "./session";

const viewer: Viewer = { id: "123", login: "pseudo", displayName: "Pseudo", avatarUrl: "https://x/a.png" };
const secret = "s3cret";
const now = Date.parse("2026-10-04T12:00:00Z");

describe("session", () => {
  it("round-trips a viewer", () => {
    expect(verifySession(signSession(viewer, secret, now), secret, now)).toEqual(viewer);
  });

  it("rejects a token signed with another secret", () => {
    expect(verifySession(signSession(viewer, "other", now), secret, now)).toBeNull();
  });

  it("rejects a tampered payload", () => {
    const [, sig] = signSession(viewer, secret, now).split(".");
    const forged = Buffer.from(JSON.stringify({ ...viewer, id: "999", exp: now + 1e9 })).toString("base64url");
    expect(verifySession(`${forged}.${sig}`, secret, now)).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = signSession(viewer, secret, now);
    expect(verifySession(token, secret, now + SESSION_MAX_AGE * 1000 + 1)).toBeNull();
  });

  it("rejects garbage", () => {
    for (const token of ["", "abc", "a.b", "..", "e30.x"]) expect(verifySession(token, secret, now)).toBeNull();
  });
});

describe("isOwner", () => {
  it("only the configured Twitch id is owner", () => {
    expect(isOwner("123", "123")).toBe(true);
    expect(isOwner("124", "123")).toBe(false);
    expect(isOwner(undefined, "123")).toBe(false);
  });

  it("denies everyone when the env is missing or empty", () => {
    expect(isOwner("123", undefined)).toBe(false);
    expect(isOwner("", "")).toBe(false);
    expect(isOwner(undefined, undefined)).toBe(false);
  });
});
