import type { MetadataRoute } from "next";
import { getCrawl, groupByCategory } from "@/decouverte";
import { PUBLIC_PATHS, siteUrl } from "@/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { streamers, crawledAt } = await getCrawl();
  const categories = groupByCategory(streamers).map((g) => `/categories/${g.slug}`);
  return [...PUBLIC_PATHS, ...categories].map((path) => ({
    url: `${siteUrl()}${path === "/" ? "" : path}`,
    lastModified: new Date(crawledAt),
    changeFrequency: "always",
  }));
}
