import { describe, expect, it } from "vitest";
import { canAutoplay, thumbnailSrc, twitchPlayerSrc } from "@/ui/player";

describe("canAutoplay", () => {
  it("needs at least 400x300", () => {
    expect(canAutoplay({ width: 400, height: 300 })).toBe(true);
    expect(canAutoplay({ width: 399, height: 300 })).toBe(false);
    expect(canAutoplay({ width: 640, height: 299 })).toBe(false);
  });
});

describe("twitchPlayerSrc", () => {
  it("embeds channel, parent host and muted autoplay flag", () => {
    const url = new URL(twitchPlayerSrc("streamer_fr", "0viewers-git-x.vercel.app", true));
    expect(url.origin).toBe("https://player.twitch.tv");
    expect(url.searchParams.get("channel")).toBe("streamer_fr");
    expect(url.searchParams.get("parent")).toBe("0viewers-git-x.vercel.app");
    expect(url.searchParams.get("autoplay")).toBe("true");
    expect(url.searchParams.get("muted")).toBe("true");
  });
});

describe("thumbnailSrc", () => {
  it("fills Twitch size placeholders", () => {
    expect(thumbnailSrc("https://x/live-{width}x{height}.jpg", 440, 248)).toBe("https://x/live-440x248.jpg");
  });
  it("leaves plain urls alone", () => {
    expect(thumbnailSrc("/fixtures/thumb.svg", 440, 248)).toBe("/fixtures/thumb.svg");
  });
});
