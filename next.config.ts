import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — the site is plain HTML/CSS/JS and can be served by any
  // web server (Apache, Nginx, CDN) without a Node.js runtime.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
