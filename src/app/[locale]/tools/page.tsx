import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getToolPagesByCategory, getToolPageData } from "@/lib/pseo-data"
import { ToolCard } from "@/components/pseo/ToolCard"
import { Link } from "@/i18n/navigation"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { MobileNav } from "@/components/MobileNav"
import { GridLines } from "@/components/GridLines"
import { JsonLd } from "@/components/JsonLd"

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
  const tNav = await getTranslations("nav")
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
          name: t("metadata.title"),
          description: t("metadata.description"),
          url: `${BASE_URL}/tools`,
        }}
      />

      {/* Grid Lines */}
      <GridLines />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <LogoIcon className="h-4 w-4 text-foreground" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
              ImgSplit
            </span>
          </Link>
          <div className="flex items-center gap-2 md:gap-8 text-xs">
            <Link
              href="/"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {tNav("getStarted")}
            </Link>
            <MobileNav
              links={[{ href: "/", label: tNav("getStarted") }]}
              ctaLabel={tNav("getStarted")}
              ctaHref="/"
              menuLabel={tNav("menu")}
              closeLabel={tNav("close")}
            />
            <LocaleSwitcher variant="compact" />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
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
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8 sm:mb-10 hero-enter hero-delay-3">
                {t("hero.description")}
              </p>
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

      {/* DIRECTION TOOLS */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            {t("categoryDirection")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
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
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            {t("categoryUseCase")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
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

      {/* EXISTING / CORE TOOLS */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-8">
            {t("categoryExisting")}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0">
            <ToolCard
              title={t("existingToolSplit")}
              description={t("existingToolSplitDesc")}
              href="/"
            />
            <ToolCard
              title={t("existingToolGrid")}
              description={t("existingToolGridDesc")}
              href="/grid"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium">
              ImgSplit
            </span>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground ml-4">
              {tFooter("tagline")}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {tFooter("toolsTitle")}
              </p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link
                  href="/grid"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {tFooter("toolGrid")}
                </Link>
                <Link
                  href="/"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {tFooter("toolSplit")}
                </Link>
                <Link
                  href="/tools"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {tFooter("toolAll")}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {tFooter("navTitle")}
              </p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link
                  href="/"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {tFooter("navFeatures")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
