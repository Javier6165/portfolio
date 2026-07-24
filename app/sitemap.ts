import type { MetadataRoute } from "next";
import { projects } from "./data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://javier-ortiz-portfolio.example";
  return [
    { url: base, priority: 1 },
    { url: `${base}/about`, priority: 0.8 },
    { url: `${base}/playground`, priority: 0.6 },
    ...projects.map(({ slug }) => ({ url: `${base}/work/${slug}`, priority: 0.8 })),
  ];
}
