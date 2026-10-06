import type { MetadataRoute } from "next";
import { AI_CRAWLERS, isIndexable, siteUrl } from "@/site";

export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) return { rules: { userAgent: "*", disallow: "/" } };
  const rule = { allow: "/", disallow: "/api/" };
  return {
    rules: [{ userAgent: "*", ...rule }, { userAgent: [...AI_CRAWLERS], ...rule }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
