import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { JsonLd } from "@/components/JsonLd"
import { GridLines } from "@/components/GridLines"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteNav } from "@/components/SiteNav"
import { Github } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "terms.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/terms`
      : `${BASE_URL}/${locale}/terms`

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
              ? `${BASE_URL}/terms`
              : `${BASE_URL}/${l}/terms`,
          ])
        ),
        "x-default": `${BASE_URL}/terms`,
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

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("terms")

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
                  ? `${BASE_URL}/terms`
                  : `${BASE_URL}/${locale}/terms`,
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
        {/* Use of Service */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.use.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.use.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Your Content */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.ip.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.ip.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.disclaimer.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.disclaimer.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.liability.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("sections.liability.content")}
              </p>
            </div>
          </div>
        </section>

        {/* Open Source */}
        <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-16 border-b border-border">
          <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-3">
              <h2 className="text-sm uppercase tracking-[0.15em] text-foreground font-medium">
                {t("sections.opensource.title")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-5">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("sections.opensource.content")}
              </p>
              <a
                href="https://github.com/ZooHero500"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-500"
              >
                <Github className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.2em]">
                  GitHub
                </span>
              </a>
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
              <div className="flex flex-col sm:flex-row gap-6">
                <a
                  href="mailto:zoohero.dev@gmail.com"
                  className="text-xs uppercase tracking-[0.2em] text-foreground hover:text-accent transition-colors duration-500"
                >
                  zoohero.dev@gmail.com
                </a>
                <a
                  href="https://github.com/ZooHero500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-500"
                >
                  <Github className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    GitHub
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
      <SiteFooter locale={locale} />
    </main>
  )
}
