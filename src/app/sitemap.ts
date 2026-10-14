import type { MetadataRoute } from "next";
import { PUBLIC_PATHS, siteUrl } from "@/site";

// Categories left out: noindex (ADR 0003), so not listed. ADR 0002 for live ones.
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.map((path) => ({ url: `${siteUrl()}${path === "/" ? "" : path}` }));
}
