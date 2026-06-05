import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { DynamicBackgroundRemovalEditor } from "@/components/background-removal/DynamicBackgroundRemovalEditor"
import { JsonLd } from "@/components/JsonLd"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "removeBackground.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/remove-background`
      : `${BASE_URL}/${locale}/remove-background`

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
              ? `${BASE_URL}/remove-background`
              : `${BASE_URL}/${l}/remove-background`,
          ])
        ),
        "x-default": `${BASE_URL}/remove-background`,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function RemoveBackgroundPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "removeBackground.metadata" })

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit AI Background Remover",
          url: `${BASE_URL}/remove-background`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "Browser-based AI background removal",
            "One-time local model download",
            "No image upload",
            "Transparent PNG export",
            "Cached model for future edits",
          ],
        }}
      />
      <DynamicBackgroundRemovalEditor />
    </main>
  )
}
