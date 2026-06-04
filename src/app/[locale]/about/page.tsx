import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { JsonLd } from "@/components/JsonLd"
import { GridLines } from "@/components/GridLines"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteNav } from "@/components/SiteNav"
import { Github, Twitter, Mail, Globe, Code, Shield, Heart } from "lucide-react"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://imgsplit.com"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about.metadata" })
  const canonicalUrl =
    locale === routing.defaultLocale
      ? `${BASE_URL}/about`
      : `${BASE_URL}/${locale}/about`

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
              ? `${BASE_URL}/about`
              : `${BASE_URL}/${l}/about`,
          ])
        ),
        "x-default": `${BASE_URL}/about`,
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("about")

  return (
    <main className="min-h-screen bg-background relative">
      {/* JSON-LD: Organization */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${BASE_URL}/#organization`,
          name: "ImgSplit",
          url: BASE_URL,
          logo: `${BASE_URL}/favicon.svg`,
          sameAs: [
            "https://github.com/ZooHero500",
            "https://x.com/zooheroes",
          ],
          founder: {
            "@type": "Person",
            name: "ZooHero",
            url: "https://github.com/ZooHero500",
          },
        }}
      />

      {/* JSON-LD: Person */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: "ZooHero",
          url: "https://github.com/ZooHero500",
          sameAs: [
            "https://github.com/ZooHero500",
            "https://x.com/zooheroes",
          ],
        }}
      />

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
                  ? `${BASE_URL}/about`
                  : `${BASE_URL}/${locale}/about`,
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
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4 hero-enter hero-delay-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {t("mission.title")}
              </span>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed mb-6">
                {t("mission.description")}
              </p>
              <p className="text-sm text-accent font-medium uppercase tracking-[0.15em]">
                {t("mission.highlight")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CREATOR */}
      <section className="bg-primary py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40 mb-4 block">
                {t("creator.title")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[0.9] text-primary-foreground">
                {t("creator.name")}
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="text-sm sm:text-base text-primary-foreground/60 leading-relaxed mb-8">
                {t("creator.bio")}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <a
                  href="https://github.com/ZooHero500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-primary-foreground/60 hover:text-accent transition-colors duration-500"
                >
                  <Github className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    {t("creator.github")}
                  </span>
                </a>
                <a
                  href="https://x.com/zooheroes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-primary-foreground/60 hover:text-accent transition-colors duration-500"
                >
                  <Twitter className="h-4 w-4" strokeWidth={1.5} />
                  <span className="text-xs uppercase tracking-[0.2em]">
                    {t("creator.twitter")}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              {t("tech.title")}
            </span>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              {t("tech.description")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
            <div className="border-t border-border p-8 md:p-12">
              <div className="text-muted-foreground mb-6">
                <Globe className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {t("tech.items.browser")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("tech.items.browserDesc")}
              </p>
            </div>
            <div className="border-t border-border p-8 md:p-12">
              <div className="text-muted-foreground mb-6">
                <Code className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {t("tech.items.opensource")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("tech.items.opensourceDesc")}
              </p>
            </div>
            <div className="border-t border-border p-8 md:p-12">
              <div className="text-muted-foreground mb-6">
                <Shield className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {t("tech.items.privacy")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("tech.items.privacyDesc")}
              </p>
            </div>
            <div className="border-t border-border p-8 md:p-12">
              <div className="text-muted-foreground mb-6">
                <Heart className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {t("tech.items.free")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("tech.items.freeDesc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {t("contact.title")}
              </span>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                {t("contact.description")}
              </p>
              <a
                href="mailto:zoohero.dev@gmail.com"
                className="group flex items-center gap-3 text-foreground hover:text-accent transition-colors duration-500"
              >
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                <span className="text-xs uppercase tracking-[0.2em]">
                  {t("contact.email")}
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  )
}
