import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bühnentechnik-MWG",
    short_name: "Buehnentechnik",
    description: "Buehnentechnik Verwaltung",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0d1a",
    theme_color: "#1b1a5e",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable"
      }
    ]
  };
}
