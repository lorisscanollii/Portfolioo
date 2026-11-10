import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/portfolio";

// Required for `output: "export"` (static hosting without a Node.js server).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
