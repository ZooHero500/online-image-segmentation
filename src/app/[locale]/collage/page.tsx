import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { DynamicCollageEditor } from "@/components/collage/DynamicCollageEditor"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "collage.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/collage`
      : `${BASE_URL}/${locale}/collage`

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale
              ? `${BASE_URL}/collage`
              : `${BASE_URL}/${l}/collage`,
          ])
        ),
        "x-default": `${BASE_URL}/collage`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "ImgSplit",
      type: "website",
      locale: locale === "zh-CN" ? "zh_CN" : locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function CollagePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "collage.metadata" })

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Photo Collage Maker",
          url: `${BASE_URL}/collage`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Template-based photo collage layouts",
            "Multi-image upload and frame assignment",
            "Spacing, margin, radius, and background controls",
            "PNG, JPEG, and WebP export",
            "100% browser-based, no upload",
          ],
        }}
      />
      <DynamicCollageEditor />
    </main>
  )
}
