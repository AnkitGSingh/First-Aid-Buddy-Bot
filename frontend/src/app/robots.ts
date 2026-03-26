import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://firstaidbuddy.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/chat"], // Chat sessions are private/ephemeral — no value to index
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
