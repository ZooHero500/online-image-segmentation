import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? BASE_URL
        : `${BASE_URL}/${locale}`

    entries.push({
      url,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${l}`,
          ])
        ),
      },
    })
  }

  // Add /grid page
  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? `${BASE_URL}/grid`
        : `${BASE_URL}/${locale}/grid`

    entries.push({
      url,
      lastModified: new Date("2026-03-15"),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale
              ? `${BASE_URL}/grid`
              : `${BASE_URL}/${l}/grid`,
          ])
        ),
      },
    })
  }

  return entries
}
