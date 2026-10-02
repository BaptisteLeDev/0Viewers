import type { MetadataRoute } from "next";
import { getCrawl, groupByGame } from "@/decouverte";
import { PUBLIC_PATHS, siteUrl } from "@/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { streamers, crawledAt } = await getCrawl();
  const games = groupByGame(streamers).map((g) => `/jeux/${g.slug}`);
  return [...PUBLIC_PATHS, ...games].map((path) => ({
    url: `${siteUrl()}${path === "/" ? "" : path}`,
    lastModified: new Date(crawledAt),
    changeFrequency: "always",
  }));
}
