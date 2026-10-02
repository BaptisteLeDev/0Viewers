import type { MetadataRoute } from "next";
import { getZeroViewersStreamers, groupByGame } from "@/decouverte";
import { PUBLIC_PATHS, siteUrl } from "@/site";

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const games = groupByGame(await getZeroViewersStreamers()).map((g) => `/jeux/${g.slug}`);
  return [...PUBLIC_PATHS, ...games].map((path) => ({
    url: `${siteUrl()}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "always",
  }));
}
