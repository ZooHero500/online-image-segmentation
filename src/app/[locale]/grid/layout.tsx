import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { routing } from "@/i18n/routing"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "grid.metadata" })

  const path = "/grid"
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}${path}`
      : `${BASE_URL}/${locale}${path}`

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
              ? `${BASE_URL}${path}`
              : `${BASE_URL}/${l}${path}`,
          ])
        ),
        "x-default": `${BASE_URL}${path}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "ImgSplit",
      type: "website",
    },
  }
}

export default function GridLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
