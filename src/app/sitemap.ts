import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/portfolio";

// Required for `output: "export"` (static hosting without a Node.js server).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
