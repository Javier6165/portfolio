import type { MetadataRoute } from "next";
import { siteConfig } from "./config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Placeholder cases and metrics must not be indexed. Public launch is an
    // explicit release decision controlled from config.ts.
    rules: siteConfig.isPreview
      ? { userAgent: "*", disallow: "/" }
      : { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
