import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Eagle Eye — Monitoring Przetargów Szkoleniowych",
    short_name: "Eagle Eye",
    description:
      "Monitoring przetargów szkoleniowych BZP, TED, BUR i KFS z AI scoringiem i kalkulatorem oferty.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "pl-PL",
    background_color: "#09090b",
    theme_color: "#09090b",
    categories: ["business", "productivity", "finance"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
