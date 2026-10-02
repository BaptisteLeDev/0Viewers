import { OG_SIZE, ogImage } from "../og";

export const alt = "Streamers Twitch français en live à 0 spectateur sur 0Viewers";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Streamers",
    title: "Trouve ton prochain streamer FR à découvrir",
    highlight: "streamer FR",
    subtitle: "Tous les petits lives FR, avec recherche",
  });
}
