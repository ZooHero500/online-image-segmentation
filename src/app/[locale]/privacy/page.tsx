import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { JsonLd } from "@/components/JsonLd"
import { GridLines } from "@/components/GridLines"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteNav } from "@/components/SiteNav"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "privacy.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/privacy`
      : `${BASE_URL}/${locale}/privacy`

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
              ? `${BASE_URL}/privacy`
              : `${BASE_URL}/${l}/privacy`,
          ])
        ),
        "x-default": `${BASE_URL}/privacy`,
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

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("privacy")

  return (
    <main className="min-h-screen bg-background relative">
      {/* JSON-LD: BreadcrumbList */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: t("metadata.title"),
              item:
                locale === routing.defaultLocale
                  ? `${BASE_URL}/privacy`
                  : `${BASE_URL}/${locale}/privacy`,
            },
          ],
        }}
      />

      {/* Grid Lines */}
      <GridLines />

      <SiteNav locale={locale} ctaHref="/" />

      {/* HERO */}
      <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            <div className="drift-slow">
              <div className="flex items-center gap-4 mb-8 hero-enter hero-delay-1">
                <span className="h-px w-8 md:w-12 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {t("hero.overline")}
                </span>
              </div>
            </div>

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
                {t("intro")}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4 hero-enter hero-delay-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* CONTENT SECTIONS */}
      <div className="border-t border-border">
        {/* Image Processing */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.processing.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.processing.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Data We Collect */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.collection.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.collection.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Cookies */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.cookies.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.cookies.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Third-Party Services */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.thirdParty.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.thirdParty.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Children's Privacy */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.children.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.children.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Changes */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.changes.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.changes.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.contact.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("sections.contact.content")}
              </p>
              <a
                href="mailto:zoohero.dev@gmail.com"
                className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-500"
              >
                zoohero.dev@gmail.com
              </a>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </main>
  )
}
