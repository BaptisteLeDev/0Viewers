export const MIN_AUTOPLAY_WIDTH = 400;
export const MIN_AUTOPLAY_HEIGHT = 300;

export function canAutoplay(box: { width: number; height: number }): boolean {
  return box.width >= MIN_AUTOPLAY_WIDTH && box.height >= MIN_AUTOPLAY_HEIGHT;
}

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
