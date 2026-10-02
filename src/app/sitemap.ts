import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, siteUrl } from "@/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({
    url: `${siteUrl()}${path === "/" ? "" : path}`,
    lastModified: new Date(),
    changeFrequency: "always",
  }));
}
