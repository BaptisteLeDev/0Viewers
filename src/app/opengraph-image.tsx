import { OG_SIZE, ogImage } from "./og";

export const alt = "0Viewers, les streamers Twitch français à 0 spectateur";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Sois le premier spectateur",
    title: "Découvre les streamers Twitch français à 0 spectateur",
    highlight: "0 spectateur",
    subtitle: "Lives FR mis à jour toutes les 5 minutes",
  });
}
