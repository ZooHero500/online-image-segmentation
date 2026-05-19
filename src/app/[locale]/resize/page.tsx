import { setRequestLocale } from "next-intl/server"
import { getTranslations } from "next-intl/server"
import { hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import type { Metadata } from "next"
import { DynamicResizeEditor } from "@/components/resize/DynamicResizeEditor"

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
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function ResizePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <DynamicResizeEditor />
    </main>
  )
}
