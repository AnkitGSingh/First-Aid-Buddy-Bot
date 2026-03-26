import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "First-Aid Buddy — AI First-Aid Guidance",
    short_name: "First-Aid Buddy",
    description:
      "Step-by-step AI first-aid guidance grounded in NHS, Red Cross, and St John Ambulance guidelines. Not medical advice.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#D4AF37",
    orientation: "portrait-primary",
    categories: ["health", "medical", "education"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        // @ts-ignore — 'purpose' is valid in the PWA spec but may not be in the TS types yet
        purpose: "maskable any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        // @ts-ignore
        purpose: "maskable any",
      },
    ],
    shortcuts: [
      {
        name: "Start Emergency Chat",
        short_name: "Chat",
        description: "Open the first-aid chat immediately",
        url: "/chat",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}
