import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${siteUrl()}/sitemap.xml` };
}
