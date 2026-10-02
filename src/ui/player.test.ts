import { describe, expect, it } from "vitest";
import { thumbnailSrc, twitchChatSrc, twitchPlayerSrc } from "@/ui/player";

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

describe("twitchChatSrc", () => {
  it("embeds the channel chat with parent host in dark popout mode", () => {
    const url = new URL(twitchChatSrc("games247stream", "localhost"));
    expect(url.origin + url.pathname).toBe("https://www.twitch.tv/embed/games247stream/chat");
    expect(url.searchParams.get("parent")).toBe("localhost");
    expect(url.searchParams.has("darkpopout")).toBe(true);
  });
  it("encodes the login", () => {
    expect(twitchChatSrc("a/b", "x")).toContain("/embed/a%2Fb/chat");
  });
});
