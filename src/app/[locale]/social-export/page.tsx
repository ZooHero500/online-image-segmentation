import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { JsonLd } from "@/components/JsonLd"
import { DynamicSocialExportEditor } from "@/components/social-export/DynamicSocialExportEditor"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "socialExport.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/social-export`
      : `${BASE_URL}/${locale}/social-export`

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
              ? `${BASE_URL}/social-export`
              : `${BASE_URL}/${l}/social-export`,
          ])
        ),
        "x-default": `${BASE_URL}/social-export`,
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

export default async function SocialExportPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: "socialExport.metadata" })

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit Social Media Image Exporter",
          url: `${BASE_URL}/social-export`,
          description: t("description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          featureList: [
            "One image to multiple social platform sizes",
            "Instagram, YouTube, X, TikTok, Xiaohongshu, WeChat, and Facebook presets",
            "Per-size crop positioning and scale controls",
            "ZIP download with platform folders",
            "100% browser-based, no upload",
          ],
        }}
      />
      <DynamicSocialExportEditor />
    </main>
  )
}
