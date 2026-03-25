import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { getAllToolSlugs } from "@/lib/pseo"

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
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale ? BASE_URL : `${BASE_URL}/${l}`,
            ])
          ),
          "x-default": BASE_URL,
        },
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
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale
                ? `${BASE_URL}/grid`
                : `${BASE_URL}/${l}/grid`,
            ])
          ),
          "x-default": `${BASE_URL}/grid`,
        },
      },
    })
  }

  // Add /tools hub page
  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? `${BASE_URL}/tools`
        : `${BASE_URL}/${locale}/tools`

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale
                ? `${BASE_URL}/tools`
                : `${BASE_URL}/${l}/tools`,
            ])
          ),
          "x-default": `${BASE_URL}/tools`,
        },
      },
    })
  }

  // Add /about page
  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? `${BASE_URL}/about`
        : `${BASE_URL}/${locale}/about`

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale
                ? `${BASE_URL}/about`
                : `${BASE_URL}/${l}/about`,
            ])
          ),
          "x-default": `${BASE_URL}/about`,
        },
      },
    })
  }

  // Add /privacy page
  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? `${BASE_URL}/privacy`
        : `${BASE_URL}/${locale}/privacy`

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale
                ? `${BASE_URL}/privacy`
                : `${BASE_URL}/${l}/privacy`,
            ])
          ),
          "x-default": `${BASE_URL}/privacy`,
        },
      },
    })
  }

  // Add /terms page
  for (const locale of routing.locales) {
    const url =
      locale === routing.defaultLocale
        ? `${BASE_URL}/terms`
        : `${BASE_URL}/${locale}/terms`

    entries.push({
      url,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
      alternates: {
        languages: {
          ...Object.fromEntries(
            routing.locales.map((l) => [
              l,
              l === routing.defaultLocale
                ? `${BASE_URL}/terms`
                : `${BASE_URL}/${l}/terms`,
            ])
          ),
          "x-default": `${BASE_URL}/terms`,
        },
      },
    })
  }

  // Add pSEO tool pages
  const toolSlugs = getAllToolSlugs()
  for (const slug of toolSlugs) {
    for (const locale of routing.locales) {
      const url =
        locale === routing.defaultLocale
          ? `${BASE_URL}/${slug}`
          : `${BASE_URL}/${locale}/${slug}`

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((l) => [
                l,
                l === routing.defaultLocale
                  ? `${BASE_URL}/${slug}`
                  : `${BASE_URL}/${l}/${slug}`,
              ])
            ),
            "x-default": `${BASE_URL}/${slug}`,
          },
        },
      })
    }
  }

  return entries
}
