import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { Link } from "@/i18n/navigation"
import { JsonLd } from "@/components/JsonLd"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { MobileNav } from "@/components/MobileNav"
import { GridLines } from "@/components/GridLines"
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
  const tNav = await getTranslations("nav")
  const tFooter = await getTranslations("footer")

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
            <Link
              href="/tools"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {tFooter("toolAll")}
            </Link>
            <MobileNav
              links={[
                { href: "/", label: tNav("getStarted") },
                { href: "/tools", label: tFooter("toolAll") },
              ]}
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
