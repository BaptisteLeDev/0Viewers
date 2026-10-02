import { OG_SIZE, ogImage } from "../og";

export const alt = "Catégories Twitch en direct avec des petits streamers français";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogImage({
    eyebrow: "Catégories",
    title: "Catégories en direct avec des petits streamers FR",
    highlight: "petits streamers FR",
    subtitle: "Une page par catégorie streamée en ce moment",
  });
}
