import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { routing } from "@/i18n/routing"
import { DynamicMosaicEditor } from "@/components/mosaic/DynamicMosaicEditor"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "mosaic.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/mosaic`
      : `${BASE_URL}/${locale}/mosaic`

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
              ? `${BASE_URL}/mosaic`
              : `${BASE_URL}/${l}/mosaic`,
          ])
        ),
        "x-default": `${BASE_URL}/mosaic`,
      },
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function MosaicPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "mosaic.metadata" })

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Privacy Mosaic Tool",
          url: `${BASE_URL}/mosaic`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <DynamicMosaicEditor />
    </main>
  )
}
