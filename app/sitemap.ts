import type { MetadataRoute } from "next";
import { projects } from "./data";
import { siteConfig } from "./config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  return [
    { url: base, priority: 1 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/playground`, priority: 0.6 },
    ...projects.map(({ slug }) => ({ url: `${base}/work/${slug}`, priority: 0.8 })),
  ];
}
