/**
 * Release-level values shared by metadata, sitemap and robots.
 * Keep these together so a hosting migration cannot leave stale social URLs or
 * accidentally expose a placeholder portfolio to search engines.
 */
export const siteConfig = {
  url: "https://javier-ortiz-portfolio.malapipa.chatgpt.site",
  isPreview: true,
} as const;
