import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/portfolio";

// Required for `output: "export"` (static hosting without a Node.js server).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Portfolio`,
    short_name: siteConfig.name,
    description: siteConfig.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0e12",
    theme_color: "#0a0e12",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
