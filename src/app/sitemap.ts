import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://eagle-eye.hatedapps.pl";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/status`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.3 },
    { url: `${baseUrl}/polityka-prywatnosci`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/regulamin`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
