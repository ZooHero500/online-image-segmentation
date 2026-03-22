import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { getAllToolSlugs, getToolPageData } from "@/lib/pseo"
import { ToolLanding } from "@/components/pseo/ToolLanding"
import { JsonLd } from "@/components/JsonLd"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

// Generate static params for all locale x slug combinations
export function generateStaticParams() {
  const slugs = getAllToolSlugs()
  return slugs.flatMap((toolSlug) =>
    routing.locales.map((locale) => ({ locale, toolSlug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; toolSlug: string }>
}): Promise<Metadata> {
  const { locale, toolSlug } = await params
  const data = getToolPageData(toolSlug, locale)
  if (!data) return {}

  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/${toolSlug}`
      : `${BASE_URL}/${locale}/${toolSlug}`

  return {
    title: data.seo.title,
    description: data.seo.description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((l) => [
            l,
            l === routing.defaultLocale
              ? `${BASE_URL}/${toolSlug}`
              : `${BASE_URL}/${l}/${toolSlug}`,
          ])
        ),
        "x-default": `${BASE_URL}/${toolSlug}`,
      },
    },
    openGraph: {
      title: data.seo.ogTitle,
      description: data.seo.ogDescription,
      url: canonicalUrl,
      siteName: "ImgSplit",
      type: "website",
      locale: ({ en: "en_US", "zh-CN": "zh_CN", ja: "ja_JP", ko: "ko_KR", es: "es_ES" }[locale] ?? "en_US"),
    },
    twitter: {
      card: "summary_large_image",
      title: data.seo.ogTitle,
      description: data.seo.ogDescription,
    },
  }
}

export default async function ToolSlugPage({
  params,
}: {
  params: Promise<{ locale: string; toolSlug: string }>
}) {
  const { locale, toolSlug } = await params
  const data = getToolPageData(toolSlug, locale)

  if (!data) {
    notFound()
  }

  setRequestLocale(locale)

  // Get all translations needed by ToolLanding
  const tNav = await getTranslations("nav")
  const tUpload = await getTranslations("uploadSection")
  const tFooter = await getTranslations("footer")
  const tPseo = await getTranslations("pseoChrome")

  // Build the t prop for ToolLanding
  const t = {
    nav: {
      features: tNav("features"),
      howItWorks: tNav("howItWorks"),
      faq: tNav("faq"),
      getStarted: tNav("getStarted"),
      menu: tNav("menu"),
      close: tNav("close"),
    },
    uploadSection: {
      overline: tUpload("overline"),
    },
    footer: {
      tagline: tFooter("tagline"),
      toolsTitle: tFooter("toolsTitle"),
      toolGrid: tFooter("toolGrid"),
      toolSplit: tFooter("toolSplit"),
      toolAll: tFooter("toolAll"),
      navTitle: tFooter("navTitle"),
      navFeatures: tFooter("navFeatures"),
      navHowItWorks: tFooter("navHowItWorks"),
      navFaq: tFooter("navFaq"),
    },
    pseoChrome: {
      scenariosTitle: tPseo("scenariosTitle"),
      howItWorksTitle: tPseo("howItWorksTitle"),
      howItWorksHeadlinePart1: tPseo("howItWorksHeadlinePart1"),
      howItWorksHeadlineAccent: tPseo("howItWorksHeadlineAccent"),
      faqTitle: tPseo("faqTitle"),
      relatedToolsTitle: tPseo("relatedToolsTitle"),
      ctaButton: tPseo("ctaButton"),
    },
  }

  return (
    <>
      {/* BreadcrumbList JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ImgSplit", item: BASE_URL },
            { "@type": "ListItem", position: 2, name: "Tools", item: `${BASE_URL}/tools` },
            { "@type": "ListItem", position: 3, name: data.seo.ogTitle },
          ],
        }}
      />
      {/* FAQPage JSON-LD */}
      {data.faqEntries.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: data.faqEntries.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      )}
      {/* HowTo JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: data.seo.title,
          description: data.hero.description,
          dateModified: new Date().toISOString().split("T")[0],
          step: data.howToSteps.map((step) => ({
            "@type": "HowToStep",
            position: step.stepNumber,
            name: step.title,
            text: step.description,
          })),
        }}
      />
      {/* SoftwareApplication JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "ImgSplit",
          dateModified: new Date().toISOString().split("T")[0],
          url: locale === routing.defaultLocale ? `${BASE_URL}/${toolSlug}` : `${BASE_URL}/${locale}/${toolSlug}`,
          description: data.seo.description,
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <ToolLanding data={data} locale={locale} t={t} />
    </>
  )
}
