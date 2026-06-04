import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getToolPagesByCategory, getToolPageData } from "@/lib/pseo"
import { ToolCard } from "@/components/pseo/ToolCard"
import { GridLines } from "@/components/GridLines"
import { JsonLd } from "@/components/JsonLd"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteNav } from "@/components/SiteNav"
import { CORE_TOOLS } from "@/lib/tools/catalog"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "toolsHub.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/tools`
      : `${BASE_URL}/${locale}/tools`

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
              ? `${BASE_URL}/tools`
              : `${BASE_URL}/${l}/tools`,
          ])
        ),
        "x-default": `${BASE_URL}/tools`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: canonicalUrl,
      siteName: "ImgSplit",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  }
}

export default async function ToolsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("toolsHub")
  const tFooter = await getTranslations("footer")

  const directionPages = getToolPagesByCategory("direction")
  const useCasePages = getToolPagesByCategory("use-case")

  return (
    <main className="min-h-screen bg-background relative">
      {/* JSON-LD */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": "https://imgsplit.com/tools",
          name: t("metadata.title"),
          description: t("metadata.description"),
          url: `${BASE_URL}/tools`,
          isPartOf: { "@id": "https://imgsplit.com/#website" },
          mainEntity: {
            "@type": "ItemList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Split Image in Half", url: `${BASE_URL}/split-in-half` },
              { "@type": "ListItem", position: 2, name: "Split Image Horizontally", url: `${BASE_URL}/split-horizontally` },
              { "@type": "ListItem", position: 3, name: "Split Image Vertically", url: `${BASE_URL}/split-vertically` },
              { "@type": "ListItem", position: 4, name: "Split into Equal Parts", url: `${BASE_URL}/split-into-equal-parts` },
              { "@type": "ListItem", position: 5, name: "Long Screenshot Splitter", url: `${BASE_URL}/split-long-screenshot` },
              { "@type": "ListItem", position: 6, name: "Instagram Splitter", url: `${BASE_URL}/split-for-instagram` },
              { "@type": "ListItem", position: 7, name: "Social Media Grid Splitter", url: `${BASE_URL}/split-for-wechat` },
              { "@type": "ListItem", position: 8, name: "Print Splitter", url: `${BASE_URL}/split-for-print` },
              { "@type": "ListItem", position: 9, name: "No-Photoshop Slicer", url: `${BASE_URL}/no-photoshop-slicer` },
              { "@type": "ListItem", position: 10, name: "Grid Splitter", url: `${BASE_URL}/grid` },
              { "@type": "ListItem", position: 11, name: "Image Splitter", url: BASE_URL },
              { "@type": "ListItem", position: 12, name: "Image Resizer", url: `${BASE_URL}/resize` },
              { "@type": "ListItem", position: 13, name: "Image Compressor", url: `${BASE_URL}/compress` },
              { "@type": "ListItem", position: 14, name: "Watermark Tool", url: `${BASE_URL}/watermark` },
              { "@type": "ListItem", position: 15, name: "Privacy Mosaic Tool", url: `${BASE_URL}/mosaic` },
            ],
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ImgSplit", item: "https://imgsplit.com" },
            { "@type": "ListItem", position: 2, name: t("metadata.title") },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://imgsplit.com/#organization",
          name: "ImgSplit",
          url: "https://imgsplit.com",
          logo: {
            "@type": "ImageObject",
            url: "https://imgsplit.com/og-image.png",
            width: 1200,
            height: 630,
          },
          sameAs: [
            "https://github.com/ZooHero500/online-image-segmentation",
            "https://x.com/zooheroes",
          ],
        }}
      />

      {/* Grid Lines */}
      <GridLines />

      <SiteNav
        locale={locale}
        links={[{ href: "https://tally.so/r/NpRyK0", label: t("feedbackButton") }]}
        ctaLabel={t("feedbackButton")}
        ctaHref="https://tally.so/r/NpRyK0"
      />

      {/* HERO — hidden in PWA standalone mode */}
      <section className="pwa-hide relative py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            {/* Overline */}
            <div className="drift-slow">
              <div className="flex items-center gap-4 mb-8 hero-enter hero-delay-1">
                <span className="h-px w-8 md:w-12 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {t("hero.overline")}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="drift-medium">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-6 sm:mb-8 hero-enter hero-delay-2">
                {t("hero.headlinePart1")}{" "}
                <em className="text-accent not-italic font-serif italic">
                  {t("hero.headlineAccent")}
                </em>
              </h1>
            </div>

            <div className="drift-fast">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-6 sm:mb-8 hero-enter hero-delay-3">
                {t("hero.description")}
              </p>
              <a
                href="https://tally.so/r/NpRyK0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 hero-enter hero-delay-4 link-underline"
              >
                {t("feedbackHeroCta")}
              </a>
            </div>
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4 hero-enter hero-delay-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* CORE TOOLS */}
      <section className="pwa-first-section border-t border-border py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {t("categoryExisting")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {CORE_TOOLS.map((tool) => (
              <ToolCard
                key={tool.id}
                title={tFooter(tool.labelKey)}
                description={t(tool.descriptionKey)}
                href={tool.href}
              />
            ))}
          </div>
        </div>
      </section>

      {/* DIRECTION TOOLS */}
      <section className="border-t border-border py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {t("categoryDirection")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {directionPages.map((page) => {
              const data = getToolPageData(page.slug, locale)
              if (!data) return null
              return (
                <ToolCard
                  key={page.slug}
                  title={data.seo.ogTitle}
                  description={data.seo.description}
                  href={`/${page.slug}`}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* USE-CASE TOOLS */}
      <section className="border-t border-border py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            {t("categoryUseCase")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {useCasePages.map((page) => {
              const data = getToolPageData(page.slug, locale)
              if (!data) return null
              return (
                <ToolCard
                  key={page.slug}
                  title={data.seo.ogTitle}
                  description={data.seo.description}
                  href={`/${page.slug}`}
                />
              )
            })}
          </div>
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="border-t border-border py-10 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              {t("feedbackOverline")}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
              {t("feedbackDesc")}
            </p>
          </div>
          <a
            href="https://tally.so/r/NpRyK0"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity duration-300 press"
          >
            {t("feedbackButton")}
          </a>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  )
}
