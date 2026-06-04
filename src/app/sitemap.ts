import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { getAllToolPages } from "@/lib/pseo"
import { CORE_TOOLS } from "@/lib/tools/catalog"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

function getLocalizedToolPageUrl(slug: string, locale: string) {
  return locale === routing.defaultLocale
    ? `${BASE_URL}/${slug}`
    : `${BASE_URL}/${locale}/${slug}`
}

function getToolPageSitemapPriority(slug: string, locale: string): number {
  if (
    [
      "youtube-thumbnail-size",
      "instagram-post-size",
      "instagram-story-size",
      "facebook-cover-photo-size",
    ].includes(slug)
  ) {
    return 0.85
  }

  if (["linkedin-post-size", "twitter-header-size"].includes(slug)) {
    return 0.82
  }

  if (
    ["xiaohongshu-cover-size", "wechat-official-account-cover-size"].includes(slug)
  ) {
    return locale === "zh-CN" ? 0.82 : 0.5
  }

  if (
    ["social-media-image-resizer", "resize-image-for-social-media"].includes(slug)
  ) {
    return 0.6
  }

  if (slug === "wechat-cover-size" && locale !== "zh-CN") {
    return 0.5
  }

  return 0.8
}

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

  // Add core tool pages.
  for (const tool of CORE_TOOLS.filter((tool) => tool.href !== "/")) {
    for (const locale of routing.locales) {
      const url =
        locale === routing.defaultLocale
          ? `${BASE_URL}${tool.href}`
          : `${BASE_URL}/${locale}${tool.href}`

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: tool.sitemapPriority,
        alternates: {
          languages: {
            ...Object.fromEntries(
              routing.locales.map((l) => [
                l,
                l === routing.defaultLocale
                  ? `${BASE_URL}${tool.href}`
                  : `${BASE_URL}/${l}${tool.href}`,
              ])
            ),
            "x-default": `${BASE_URL}${tool.href}`,
          },
        },
      })
    }
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
  const toolPages = getAllToolPages()
  for (const page of toolPages) {
    const locales = Object.keys(page.locales)
    const xDefaultLocale = locales.includes(routing.defaultLocale)
      ? routing.defaultLocale
      : locales[0] ?? routing.defaultLocale

    for (const locale of locales) {
      const url = getLocalizedToolPageUrl(page.slug, locale)

      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: getToolPageSitemapPriority(page.slug, locale),
        alternates: {
          languages: {
            ...Object.fromEntries(
              locales.map((l) => [
                l,
                getLocalizedToolPageUrl(page.slug, l),
              ])
            ),
            "x-default": getLocalizedToolPageUrl(page.slug, xDefaultLocale),
          },
        },
      })
    }
  }

  return entries
}
