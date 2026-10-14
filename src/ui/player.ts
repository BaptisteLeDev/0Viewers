export function twitchPlayerSrc(channel: string, parent: string, autoplay: boolean): string {
  const query = new URLSearchParams({ channel, parent, autoplay: String(autoplay), muted: "true" });
  return `https://player.twitch.tv/?${query}`;
}

export function thumbnailSrc(template: string, width: number, height: number): string {
  return template.replace("{width}", String(width)).replace("{height}", String(height));
}

const THUMB_WIDTHS = [240, 320, 440];

export function thumbnailSrcSet(template: string): string {
  return THUMB_WIDTHS.map((w) => `${thumbnailSrc(template, w, Math.round((w * 9) / 16))} ${w}w`).join(", ");
}

export function twitchChatSrc(channel: string, parent: string): string {
  return `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?${new URLSearchParams({ parent })}&darkpopout`;
}

export function twitchChannelUrl(login: string): string {
  return `https://www.twitch.tv/${encodeURIComponent(login)}`;
}
