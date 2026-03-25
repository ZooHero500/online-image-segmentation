import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/workspace", "/grid/workspace"],
      },
      // Explicitly welcome AI search bots
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Block training-only crawlers (not search)
      { userAgent: "CCBot", disallow: "/" },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
