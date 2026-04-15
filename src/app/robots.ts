import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard/", "/auth/callback"] },
    ],
    sitemap: "https://eagle-eye.hatedapps.pl/sitemap.xml",
  };
}
