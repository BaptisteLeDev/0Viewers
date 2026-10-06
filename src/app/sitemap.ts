import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, siteUrl } from "@/site";

// Live categories left out: they churn faster than Google recrawls.
// Category pages are found through internal links. ADR 0002.
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: `${siteUrl()}${path === "/" ? "" : path}`, changeFrequency: "daily" }));
}
