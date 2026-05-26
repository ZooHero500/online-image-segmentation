import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { DynamicCompressEditor } from "@/components/compress/DynamicCompressEditor"
import { JsonLd } from "@/components/JsonLd"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "compress.metadata" })

  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/compress`
      : `${BASE_URL}/${locale}/compress`

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
              ? `${BASE_URL}/compress`
              : `${BASE_URL}/${l}/compress`,
          ])
        ),
        "x-default": `${BASE_URL}/compress`,
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

export default async function CompressPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "compress.metadata" })

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Image Compressor",
          url: `${BASE_URL}/compress`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Image compression with quality control",
            "Format conversion between PNG, JPEG, WebP",
            "Real-time before/after comparison",
            "Batch processing with ZIP download",
            "100% browser-based, no upload",
          ],
        }}
      />
      <DynamicCompressEditor />
    </main>
  )
}
