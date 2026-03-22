import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { JsonLd } from "@/components/JsonLd"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { FaqItem } from "../FaqSection"
import { GridLandingContent } from "./GridLandingContent"
import { GridLines } from "@/components/GridLines"
import { MobileNav } from "@/components/MobileNav"
import {
  Grid3X3,
  ArrowRight,
  Columns3,
  LayoutGrid,
} from "lucide-react"

export default async function GridPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("grid")
  const tLanding = await getTranslations("grid.landing")
  const tFooter = await getTranslations("footer")
  const tNav = await getTranslations("nav")

  return (
    <main className="min-h-screen bg-background relative">
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
          "@type": "WebApplication",
          name: "ImgSplit Grid",
          dateModified: new Date().toISOString().split("T")[0],
          url: locale === "en" ? "https://imgsplit.com/grid" : `https://imgsplit.com/${locale}/grid`,
          description: t("metadata.description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          inLanguage: ({ en: "en", "zh-CN": "zh-Hans", ja: "ja", ko: "ko", es: "es" }[locale] ?? "en"),
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: t("metadata.title"),
          description: t("metadata.description"),
          dateModified: new Date().toISOString().split("T")[0],
          step: [
            { "@type": "HowToStep", position: 1, name: tLanding("howItWorks.step1Title"), text: tLanding("howItWorks.step1Desc") },
            { "@type": "HowToStep", position: 2, name: tLanding("howItWorks.step2Title"), text: tLanding("howItWorks.step2Desc") },
            { "@type": "HowToStep", position: 3, name: tLanding("howItWorks.step3Title"), text: tLanding("howItWorks.step3Desc") },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: tLanding("faq.q1"), acceptedAnswer: { "@type": "Answer", text: tLanding("faq.a1") } },
            { "@type": "Question", name: tLanding("faq.q2"), acceptedAnswer: { "@type": "Answer", text: tLanding("faq.a2") } },
            { "@type": "Question", name: tLanding("faq.q3"), acceptedAnswer: { "@type": "Answer", text: tLanding("faq.a3") } },
            { "@type": "Question", name: tLanding("faq.q4"), acceptedAnswer: { "@type": "Answer", text: tLanding("faq.a4") } },
          ],
        }}
      />

      {/* Visible Grid Lines */}
      <GridLines />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <LogoIcon className="h-4 w-4 text-foreground" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
                ImgSplit
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-8 text-xs">
            <a
              href="#grid-types"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {tLanding("types.overline")}
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {tLanding("howItWorks.overline")}
            </a>
            <a
              href="#faq"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {tLanding("faq.overline")}
            </a>
            <MobileNav
              links={[
                { href: "#grid-types", label: tLanding("types.overline") },
                { href: "#how-it-works", label: tLanding("howItWorks.overline") },
                { href: "#faq", label: tLanding("faq.overline") },
              ]}
              ctaLabel={tLanding("hero.ctaPrimary")}
              ctaHref="#upload"
              menuLabel={tNav("menu")}
              closeLabel={tNav("close")}
            />
            <LocaleSwitcher variant="compact" />
            <a
              href="#upload"
              className="hidden md:inline-flex group relative items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 press"
            >
              <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10">{tLanding("hero.ctaPrimary")}</span>
              <ArrowRight className="relative z-10 h-3 w-3" />
            </a>
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
                  {tLanding("hero.overline")}
                </span>
              </div>
            </div>

            <div className="drift-medium">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-6 sm:mb-8 hero-enter hero-delay-2">
                {tLanding("hero.headlinePart1")}
                <em className="text-accent not-italic font-serif italic">
                  {tLanding("hero.headlineAccent")}
                </em>
                <br />
                {tLanding("hero.headlinePart2")}
              </h1>
            </div>

            <div className="drift-fast">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8 sm:mb-10 hero-enter hero-delay-3">
                {tLanding("hero.description")}
              </p>
            </div>

            <div className="drift-fast">
              <div className="flex flex-col sm:flex-row gap-4 hero-enter hero-delay-4">
                <a
                  href="#upload"
                  className="group relative inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 press"
                >
                  <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                  <span className="relative z-10">{tLanding("hero.ctaPrimary")}</span>
                  <ArrowRight className="relative z-10 h-3.5 w-3.5" />
                </a>
                <a
                  href="#grid-types"
                  className="inline-flex items-center justify-center gap-2 border border-primary text-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all duration-500 press"
                >
                  {tLanding("hero.ctaSecondary")}
                </a>
              </div>
            </div>
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4 hero-enter hero-delay-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              Grid / Vol. 02
            </span>
          </div>
        </div>
      </section>

      {/* GRID TYPES */}
      <section id="grid-types" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16 reveal">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {tLanding("types.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
                {tLanding("types.headlinePart1")}
                <em className="text-accent italic">{tLanding("types.headlineAccent")}</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 reveal-stagger">
            <div className="group border-t border-border p-8 md:p-12 transition-colors duration-700 hover:bg-background/50">
              <div className="text-muted-foreground mb-6 group-hover:text-accent transition-colors duration-500">
                <Grid3X3 className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("types.3x3Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("types.3x3Desc")}
              </p>
            </div>
            <div className="group border-t border-border p-8 md:p-12 transition-colors duration-700 hover:bg-background/50">
              <div className="text-muted-foreground mb-6 group-hover:text-accent transition-colors duration-500">
                <Columns3 className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("types.1x3Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("types.1x3Desc")}
              </p>
            </div>
            <div className="group border-t border-border p-8 md:p-12 transition-colors duration-700 hover:bg-background/50">
              <div className="text-muted-foreground mb-6 group-hover:text-accent transition-colors duration-500">
                <LayoutGrid className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("types.2x2Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("types.2x2Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* UPLOAD */}
      <section id="upload" className="px-4 sm:px-8 md:px-16 pb-12 sm:pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {tLanding("howItWorks.step1Title")}
          </span>
        </div>
        <GridLandingContent />
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              {tLanding("howItWorks.overline")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              {tLanding("howItWorks.headlinePart1")}
              <em className="text-accent italic">
                {tLanding("howItWorks.headlineAccent")}
              </em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-0 reveal-stagger">
            <div className="border-t border-border p-8 md:p-12">
              <span className="font-serif text-5xl md:text-6xl text-foreground/10 leading-none mb-6 block">
                01
              </span>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("howItWorks.step1Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("howItWorks.step1Desc")}
              </p>
            </div>
            <div className="border-t border-border p-8 md:p-12">
              <span className="font-serif text-5xl md:text-6xl text-foreground/10 leading-none mb-6 block">
                02
              </span>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("howItWorks.step2Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("howItWorks.step2Desc")}
              </p>
            </div>
            <div className="border-t border-border p-8 md:p-12">
              <span className="font-serif text-5xl md:text-6xl text-foreground/10 leading-none mb-6 block">
                03
              </span>
              <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                {tLanding("howItWorks.step3Title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("howItWorks.step3Desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 md:col-start-2 reveal">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-primary-foreground mb-6">
              {tLanding("cta.headlinePart1")}
              <em className="text-accent italic">
                {tLanding("cta.headlineAccent")}
              </em>
            </h2>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-md mb-10">
              {tLanding("cta.description")}
            </p>
            <a
              href="#upload"
              className="group relative inline-flex items-center gap-2 bg-background text-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 press"
            >
              <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10 group-hover:text-primary-foreground">{tLanding("cta.button")}</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5 group-hover:text-primary-foreground" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 reveal">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {tLanding("faq.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[0.9] mb-4">
                {tLanding("faq.headlinePart1")}
                <em className="text-accent italic">
                  {tLanding("faq.headlineAccent")}
                </em>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tLanding("faq.subtitle")}
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="space-y-0">
                <FaqItem question={tLanding("faq.q1")} answer={tLanding("faq.a1")} />
                <FaqItem question={tLanding("faq.q2")} answer={tLanding("faq.a2")} />
                <FaqItem question={tLanding("faq.q3")} answer={tLanding("faq.a3")} />
                <FaqItem question={tLanding("faq.q4")} answer={tLanding("faq.a4")} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <LogoIcon className="h-3.5 w-3.5 text-foreground" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium">
                ImgSplit
              </span>
            </Link>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground ml-4">
              {tFooter("tagline")}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{tFooter("toolsTitle")}</p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span className="text-accent">{tFooter("toolGrid")}</span>
                <Link href="/" className="hover:text-accent transition-colors duration-500">
                  {tFooter("toolSplit")}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{tFooter("navTitle")}</p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link href="/" className="hover:text-accent transition-colors duration-500">
                  {tFooter("navFeatures")}
                </Link>
                <a href="#faq" className="hover:text-accent transition-colors duration-500">
                  {tFooter("navFaq")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
