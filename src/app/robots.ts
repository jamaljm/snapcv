import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep private/editor + API routes out of the index.
        disallow: ["/api/", "/home", "/create", "/profile", "/auth/", "/download-wrapped"],
      },
    ],
    sitemap: "https://snapcv.me/sitemap.xml",
    host: "https://snapcv.me",
  };
}
