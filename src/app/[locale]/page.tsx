import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LandingContent } from "./LandingContent"
import { SmartCTA } from "./SmartCTA"
import { FaqItem } from "./FaqSection"
import { JsonLd } from "@/components/JsonLd"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { MobileNav } from "@/components/MobileNav"
import { GridLines } from "@/components/GridLines"
import {
  Scissors,
  Shield,
  Download,
  Zap,
  Image,
  Grid3X3,
  MousePointerClick,
  Layers,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"
import type React from "react"

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations()

  return (
    <main className="min-h-screen bg-background relative">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ImgSplit", item: "https://imgsplit.com" },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://imgsplit.com/#website",
          name: "ImgSplit",
          url: "https://imgsplit.com",
          description: t("metadata.description"),
          inLanguage: ({ en: "en", "zh-CN": "zh-Hans", ja: "ja", ko: "ko", es: "es" }[locale] ?? "en"),
          publisher: { "@id": "https://imgsplit.com/#organization" },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "@id": "https://imgsplit.com/#app",
          name: "ImgSplit",
          url: "https://imgsplit.com",
          description: t("hero.description"),
          dateModified: "2026-03-24",
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires JavaScript. Works in Chrome, Firefox, Safari, Edge.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            t("jsonLd.feature1"),
            t("jsonLd.feature2"),
            t("jsonLd.feature3"),
            t("jsonLd.feature4"),
            t("jsonLd.feature5"),
            t("jsonLd.feature6"),
          ],
          image: "https://imgsplit.com/og-image.png",
          publisher: { "@id": "https://imgsplit.com/#organization" },
          isPartOf: { "@id": "https://imgsplit.com/#website" },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", "#features h2", "#faq"],
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: t("faq.q1"), acceptedAnswer: { "@type": "Answer", text: t("faq.a1") } },
            { "@type": "Question", name: t("faq.q2"), acceptedAnswer: { "@type": "Answer", text: t("faq.a2") } },
            { "@type": "Question", name: t("faq.q3"), acceptedAnswer: { "@type": "Answer", text: t("faq.a3") } },
            { "@type": "Question", name: t("faq.q4"), acceptedAnswer: { "@type": "Answer", text: t("faq.a4") } },
            { "@type": "Question", name: t("faq.q5"), acceptedAnswer: { "@type": "Answer", text: t("faq.a5") } },
            { "@type": "Question", name: t("faq.q6"), acceptedAnswer: { "@type": "Answer", text: t("faq.a6") } },
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
          description: t("metadata.description"),
          sameAs: [
            "https://github.com/ZooHero500/online-image-segmentation",
            "https://x.com/zooheroes",
          ],
          founder: {
            "@type": "Person",
            name: "ZooHero",
            url: "https://github.com/ZooHero500",
            sameAs: [
              "https://github.com/ZooHero500",
              "https://x.com/zooheroes",
            ],
          },
          contactPoint: {
            "@type": "ContactPoint",
            email: "zoohero.dev@gmail.com",
            contactType: "customer support",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: t("steps.overline"),
          description: t("metadata.description"),
          dateModified: "2026-03-24",
          step: [
            { "@type": "HowToStep", position: 1, name: t("steps.step1Title"), text: t("steps.step1Desc") },
            { "@type": "HowToStep", position: 2, name: t("steps.step2Title"), text: t("steps.step2Desc") },
            { "@type": "HowToStep", position: 3, name: t("steps.step3Title"), text: t("steps.step3Desc") },
            { "@type": "HowToStep", position: 4, name: t("steps.step4Title"), text: t("steps.step4Desc") },
          ],
        }}
      />

      {/* Visible Grid Lines */}
      <GridLines />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-4 w-4 text-foreground" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
              ImgSplit
            </span>
          </div>
          <div className="flex items-center gap-2 md:gap-8 text-xs">
            <a
              href="#features"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {t("nav.features")}
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {t("nav.howItWorks")}
            </a>
            <a
              href="#faq"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {t("nav.faq")}
            </a>
            <MobileNav
              links={[
                { href: "#features", label: t("nav.features") },
                { href: "#how-it-works", label: t("nav.howItWorks") },
                { href: "#faq", label: t("nav.faq") },
              ]}
              ctaLabel={t("nav.getStarted")}
              ctaHref="#upload"
              menuLabel={t("nav.menu")}
              closeLabel={t("nav.close")}
            />
            <LocaleSwitcher variant="compact" />
            <SmartCTA
              label={t("nav.getStarted")}
              className="hidden md:inline-flex group relative items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
            />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-12 sm:py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
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

            {/* Hero headline with mixed italic */}
            <div className="drift-medium">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-6 sm:mb-8 hero-enter hero-delay-2">
                {t("hero.headlinePart1")}
                <em className="text-accent not-italic font-serif italic">{t("hero.headlineAccent")}</em>
                <br />
                {t("hero.headlinePart2")}
              </h1>
            </div>

            <div className="drift-fast">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8 sm:mb-10 hero-enter hero-delay-3">
                {t("hero.description")}
              </p>
            </div>

            <div className="drift-fast">
              <div className="flex flex-col sm:flex-row gap-4 hero-enter hero-delay-4">
                <SmartCTA
                  label={t("hero.ctaPrimary")}
                  className="group relative inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
                />
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-primary text-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all duration-500 press"
                >
                  {t("hero.ctaSecondary")}
                </a>
              </div>
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

      {/* TRUST INDICATORS */}
      <section className="border-t border-border py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 reveal-stagger">
          <TrustItem
            icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
            label={t("trust.privacyLabel")}
            desc={t("trust.privacyDesc")}
          />
          <TrustItem
            icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
            label={t("trust.speedLabel")}
            desc={t("trust.speedDesc")}
          />
          <TrustItem
            icon={<Image className="h-4 w-4" strokeWidth={1.5} />}
            label={t("trust.qualityLabel")}
            desc={t("trust.qualityDesc")}
          />
          <TrustItem
            icon={<Download className="h-4 w-4" strokeWidth={1.5} />}
            label={t("trust.freeLabel")}
            desc={t("trust.freeDesc")}
          />
        </div>
      </section>

      {/* UPLOAD */}
      <section id="upload" className="px-4 sm:px-8 md:px-16 pb-12 sm:pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t("uploadSection.overline")}
          </span>
        </div>
        <LandingContent />
      </section>

      {/* BENEFITS - Dark Section */}
      <section className="bg-primary py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16 reveal">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40 mb-4 block">
                {t("benefits.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-primary-foreground">
                {t("benefits.headlinePart1")}
                <em className="text-accent italic">{t("benefits.headlineAccent")}</em>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-8 flex items-end">
              <p className="text-sm text-primary-foreground/60 leading-relaxed">
                {t("benefits.subtitle")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0 reveal-stagger">
            <BenefitCard
              icon={<MousePointerClick className="h-4 w-4" strokeWidth={1.5} />}
              title={t("benefits.noPsTitle")}
              description={t("benefits.noPsDesc")}
            />
            <BenefitCard
              icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
              title={t("benefits.privacyTitle")}
              description={t("benefits.privacyDesc")}
            />
            <BenefitCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title={t("benefits.batchTitle")}
              description={t("benefits.batchDesc")}
            />
            <BenefitCard
              icon={<Layers className="h-4 w-4" strokeWidth={1.5} />}
              title={t("benefits.crossPlatformTitle")}
              description={t("benefits.crossPlatformDesc")}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16 reveal">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {t("features.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
                {t("features.headlinePart1")}
                <em className="text-accent italic">{t("features.headlineAccent")}</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 reveal-stagger">
            <FeatureCard
              icon={<Scissors className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.preciseTitle")}
              description={t("features.preciseDesc")}
              href="/split-in-half"
            />
            <FeatureCard
              icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.privacyTitle")}
              description={t("features.privacyDesc")}
              href="/no-photoshop-slicer"
            />
            <FeatureCard
              icon={<Download className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.downloadTitle")}
              description={t("features.downloadDesc")}
              href="/split-into-equal-parts"
            />
            <FeatureCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.gridTitle")}
              description={t("features.gridDesc")}
              href="/grid"
            />
            <FeatureCard
              icon={<Image className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.formatTitle")}
              description={t("features.formatDesc")}
              href="/split-horizontally"
            />
            <FeatureCard
              icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.previewTitle")}
              description={t("features.previewDesc")}
              href="/split-vertically"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              {t("steps.overline")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              {t("steps.headlinePart1")}
              <em className="text-accent italic">{t("steps.headlineAccent")}</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0 reveal-stagger">
            <StepCard
              step={1}
              title={t("steps.step1Title")}
              description={t("steps.step1Desc")}
            />
            <StepCard
              step={2}
              title={t("steps.step2Title")}
              description={t("steps.step2Desc")}
            />
            <StepCard
              step={3}
              title={t("steps.step3Title")}
              description={t("steps.step3Desc")}
            />
            <StepCard
              step={4}
              title={t("steps.step4Title")}
              description={t("steps.step4Desc")}
            />
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="bg-primary py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16 reveal">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40 mb-4 block">
                {t("useCases.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-primary-foreground">
                {t("useCases.headlinePart1")}
                <em className="text-accent italic">{t("useCases.headlineAccent")}</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0 reveal-stagger">
            <UseCaseCard
              title={t("useCases.ecommerceTitle")}
              description={t("useCases.ecommerceDesc")}
              result={t("useCases.ecommerceResult")}
              href="/split-long-screenshot"
            />
            <UseCaseCard
              title={t("useCases.designerTitle")}
              description={t("useCases.designerDesc")}
              result={t("useCases.designerResult")}
              href="/no-photoshop-slicer"
            />
            <UseCaseCard
              title={t("useCases.socialTitle")}
              description={t("useCases.socialDesc")}
              result={t("useCases.socialResult")}
              href="/split-for-instagram"
            />
          </div>
        </div>
      </section>

      {/* WHY IMGSPLIT */}
      <section className="py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 border-t border-border">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16 reveal">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {t("comparison.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-4">
                {t("comparison.headlinePart1")}{" "}
                <em className="text-accent italic">{t("comparison.headlineAccent")}</em>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                {t("comparison.subtitle")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0 reveal-stagger">
            <ComparisonCard
              title={t("comparison.feature1")}
              description={t("comparison.feature1Desc")}
            />
            <ComparisonCard
              title={t("comparison.feature2")}
              description={t("comparison.feature2Desc")}
            />
            <ComparisonCard
              title={t("comparison.feature3")}
              description={t("comparison.feature3Desc")}
            />
            <ComparisonCard
              title={t("comparison.feature4")}
              description={t("comparison.feature4Desc")}
            />
            <ComparisonCard
              title={t("comparison.feature5")}
              description={t("comparison.feature5Desc")}
            />
            <ComparisonCard
              title={t("comparison.feature6")}
              description={t("comparison.feature6Desc")}
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-primary py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-12 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/40 mb-4 block">
              {t("stats.overline")}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[0.9] text-primary-foreground">
              {t("stats.headlinePart1")}{" "}
              <em className="text-accent italic">{t("stats.headlineAccent")}</em>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 reveal-stagger">
            <StatCard value={t("stats.stat1Value")} label={t("stats.stat1Label")} />
            <StatCard value={t("stats.stat2Value")} label={t("stats.stat2Label")} />
            <StatCard value={t("stats.stat3Value")} label={t("stats.stat3Label")} />
            <StatCard value={t("stats.stat4Value")} label={t("stats.stat4Label")} />
            <StatCard value={t("stats.stat5Value")} label={t("stats.stat5Label")} />
            <StatCard value={t("stats.stat6Value")} label={t("stats.stat6Label")} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 border-t border-border">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 md:col-start-2 reveal">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">
              {t("cta.headlinePart1")}
              <em className="text-accent italic">{t("cta.headlineAccent")}</em>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-10">
              {t("cta.description")}
            </p>
            <SmartCTA
              label={t("cta.button")}
              className="group relative inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4 reveal">
              <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                {t("faq.overline")}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[0.9] mb-4">
                {t("faq.headlinePart1")}
                <em className="text-accent italic">{t("faq.headlineAccent")}</em>
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("faq.subtitle")}
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 md:col-start-6">
              <div className="space-y-0">
                <FaqItem
                  question={t("faq.q1")}
                  answer={t("faq.a1")}
                />
                <FaqItem
                  question={t("faq.q2")}
                  answer={t("faq.a2")}
                />
                <FaqItem
                  question={t("faq.q3")}
                  answer={t("faq.a3")}
                />
                <FaqItem
                  question={t("faq.q4")}
                  answer={t("faq.a4")}
                />
                <FaqItem
                  question={t("faq.q5")}
                  answer={t("faq.a5")}
                />
                <FaqItem
                  question={t("faq.q6")}
                  answer={t("faq.a6")}
                />
              </div>
            </div>
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
              {t("footer.tagline")}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{t("footer.toolsTitle")}</p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link
                  href="/grid"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t("footer.toolGrid")}
                </Link>
                <a
                  href="#upload"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t("footer.toolSplit")}
                </a>
                <Link href="/tools" className="hover:text-accent transition-colors duration-500">{t("footer.toolAll")}</Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{t("footer.navTitle")}</p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <a href="#features" className="hover:text-accent transition-colors duration-500">
                  {t("footer.navFeatures")}
                </a>
                <a href="#how-it-works" className="hover:text-accent transition-colors duration-500">
                  {t("footer.navHowItWorks")}
                </a>
                <a href="#faq" className="hover:text-accent transition-colors duration-500">
                  {t("footer.navFaq")}
                </a>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">{t("footer.legalTitle")}</p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link href="/about" className="hover:text-accent transition-colors duration-500">
                  {t("footer.about")}
                </Link>
                <Link href="/privacy" className="hover:text-accent transition-colors duration-500">
                  {t("footer.privacy")}
                </Link>
                <Link href="/terms" className="hover:text-accent transition-colors duration-500">
                  {t("footer.terms")}
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-start md:items-end gap-4">
            <a href="https://www.producthunt.com/products/imgsplit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-imgsplit" target="_blank" rel="noopener noreferrer">
              <img alt="ImgSplit - Split images with precision — free, private, no upload | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1114907&theme=light&t=1775379733917" />
            </a>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              zoohero.dev@gmail.com
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ─── Trust Item ─── */
function TrustItem({
  icon,
  label,
  desc,
}: {
  icon: React.ReactNode
  label: string
  desc: string
}) {
  return (
    <div className="flex flex-col items-start gap-3 p-6 border-t border-border">
      <div className="text-muted-foreground">{icon}</div>
      <span className="text-xs uppercase tracking-[0.2em] font-medium text-foreground">
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
        {desc}
      </span>
    </div>
  )
}

/* ─── Benefit Card (Dark bg) ─── */
function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group border-t border-primary-foreground/10 p-8 md:p-12 transition-colors duration-700 hover:bg-background/[0.03]">
      <div className="text-primary-foreground/40 mb-6 group-hover:text-accent transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-primary-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-primary-foreground/50 leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href?: string
}) {
  const content = (
    <div className="group border-t border-border p-8 md:p-12 transition-colors duration-700 hover:bg-background/50">
      <div className="text-muted-foreground mb-6 group-hover:text-accent transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

/* ─── Step Card ─── */
function StepCard({
  step,
  title,
  description,
}: {
  step: number
  title: string
  description: string
}) {
  return (
    <div className="border-t border-border p-8 md:p-12">
      <span className="font-serif text-5xl md:text-6xl text-foreground/10 leading-none mb-6 block">
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Use Case Card (Dark bg) ─── */
function UseCaseCard({
  title,
  description,
  result,
  href,
}: {
  title: string
  description: string
  result: string
  href?: string
}) {
  const content = (
    <div className="group border-t border-primary-foreground/10 p-8 md:p-12 transition-colors duration-700 hover:bg-background/[0.03]">
      <h3 className="text-sm uppercase tracking-[0.15em] text-primary-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-primary-foreground/50 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-accent">
        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
        {result}
      </div>
    </div>
  )
  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}

/* ─── Comparison Card ─── */
function ComparisonCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="border-t border-border p-8 md:p-12">
      <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Stat Card ─── */
function StatCard({
  value,
  label,
}: {
  value: string
  label: string
}) {
  return (
    <div className="border-t border-primary-foreground/10 p-6 md:p-8 text-center">
      <span className="font-serif text-3xl md:text-4xl text-primary-foreground leading-none block mb-2">
        {value}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-primary-foreground/50">
        {label}
      </span>
    </div>
  )
}
