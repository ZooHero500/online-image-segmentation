import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { DynamicResizeEditor } from "@/components/resize/DynamicResizeEditor"
import { JsonLd } from "@/components/JsonLd"
import { getResizePreset, getResizePresetAspectRatio } from "@/lib/resize-presets"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "resize.metadata" })

  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/resize`
      : `${BASE_URL}/${locale}/resize`

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
              ? `${BASE_URL}/resize`
              : `${BASE_URL}/${l}/resize`,
          ])
        ),
        "x-default": `${BASE_URL}/resize`,
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

export default async function ResizePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<{ preset?: string }>
}) {
  const { locale } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const preset = getResizePreset(resolvedSearchParams.preset)

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: "resize.metadata" })

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Image Resizer",
          url: `${BASE_URL}/resize`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Custom canvas dimensions",
            "Drag & drop image positioning",
            "Crop with aspect ratio presets",
            "Rotate & flip",
            "Export as PNG, JPEG, WebP",
            "100% browser-based, no upload",
          ],
        }}
      />
      <DynamicResizeEditor
        initialWidth={preset?.width}
        initialHeight={preset?.height}
        initialCropAspectRatio={preset ? getResizePresetAspectRatio(preset) : null}
      />
    </main>
  )
}
