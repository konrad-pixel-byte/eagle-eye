import type { MetadataRoute } from "next";

// Stable lastModified dates keep the sitemap idempotent across requests so
// crawlers only refetch pages when the content actually changed. Bump these
// manually when editing the corresponding pages.
const LEGAL_UPDATED = new Date("2026-04-19T00:00:00Z");
const LANDING_UPDATED = new Date("2026-04-19T00:00:00Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eagle-eye.hatedapps.pl";
  return [
    {
      url: baseUrl,
      lastModified: LANDING_UPDATED,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/status`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: LEGAL_UPDATED,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
