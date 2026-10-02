export function twitchPlayerSrc(channel: string, parent: string, autoplay: boolean): string {
  const query = new URLSearchParams({ channel, parent, autoplay: String(autoplay), muted: "true" });
  return `https://player.twitch.tv/?${query}`;
}

export function thumbnailSrc(template: string, width: number, height: number): string {
  return template.replace("{width}", String(width)).replace("{height}", String(height));
}

export function twitchChatSrc(channel: string, parent: string): string {
  return `https://www.twitch.tv/embed/${encodeURIComponent(channel)}/chat?${new URLSearchParams({ parent })}&darkpopout`;
}

export function twitchChannelUrl(login: string): string {
  return `https://www.twitch.tv/${encodeURIComponent(login)}`;
}
