import { getCrawl, groupByCategory } from "@/decouverte";
import { OG_SIZE, ogImage } from "../../og";

export const alt = "Streamers français en live à 0 spectateur sur 0Viewers";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { streamers, boxArt } = await getCrawl();
  const category = groupByCategory(streamers, boxArt).find((g) => g.slug === slug);
  if (!category) {
    return ogImage({ eyebrow: "Catégorie", title: "Les catégories Twitch en direct", highlight: "en direct", subtitle: "Petits streamers FR à 0 spectateur" });
  }
  const art = category.boxArtUrl.startsWith("https://") ? category.boxArtUrl.replace(/\d+x\d+/, "285x380") : undefined;
  return ogImage({
    eyebrow: "Catégorie",
    title: `Streamers ${category.name} FR à 0 spectateur`,
    highlight: category.name,
    subtitle: `${category.count} ${category.count > 1 ? "lives FR" : "live FR"} en ce moment`,
    art,
  });
}
