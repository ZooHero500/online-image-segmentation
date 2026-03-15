import { getTranslations, setRequestLocale } from "next-intl/server"
import { LandingContent } from "./LandingContent"
import { FaqItem } from "./FaqSection"
import { JsonLd } from "@/components/JsonLd"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
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
    <main className="min-h-screen bg-[#F9F8F6] relative">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "ImgSplit",
          url: "https://imgsplit.com",
          description: t("hero.description"),
          applicationCategory: "DesignApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          featureList: [
            "Drag-and-drop split lines",
            "Snap alignment",
            "Grid splitting",
            "One-click ZIP download",
            "Browser-based processing",
            "Privacy-first design",
          ],
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

      {/* Visible Grid Lines */}
      <GridLines />

      {/* NAV */}
      <nav className="sticky top-0 z-40 bg-[#F9F8F6]/90 backdrop-blur-sm border-b border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-4 w-4 text-[#1A1A1A]" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-[#1A1A1A]">
              ImgSplit
            </span>
          </div>
          <div className="flex items-center gap-8 text-xs">
            <a
              href="#features"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("nav.features")}
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("nav.howItWorks")}
            </a>
            <a
              href="#faq"
              className="hidden md:inline uppercase tracking-[0.2em] text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("nav.faq")}
            </a>
            <LocaleSwitcher variant="compact" />
            <a
              href="#upload"
              className="group relative inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
            >
              <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10">{t("nav.getStarted")}</span>
              <ArrowRight className="relative z-10 h-3 w-3" />
            </a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative py-24 md:py-32 px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            {/* Overline */}
            <div className="flex items-center gap-4 mb-8">
              <span className="h-px w-8 md:w-12 bg-[#1A1A1A]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
                {t("hero.overline")}
              </span>
            </div>

            {/* Hero headline with mixed italic */}
            <h1 className="font-serif text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-8">
              {t("hero.headlinePart1")}
              <em className="text-[#D4AF37] not-italic font-serif italic">{t("hero.headlineAccent")}</em>
              <br />
              {t("hero.headlinePart2")}
            </h1>

            <p className="text-base md:text-lg text-[#6C6863] leading-relaxed max-w-md mb-10">
              {t("hero.description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#upload"
                className="group relative inline-flex items-center justify-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-10 py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
              >
                <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
                <span className="relative z-10">{t("hero.ctaPrimary")}</span>
                <ArrowRight className="relative z-10 h-3.5 w-3.5" />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-[#1A1A1A] text-[#1A1A1A] px-10 py-4 text-xs uppercase tracking-[0.2em] hover:bg-[#1A1A1A] hover:text-[#F9F8F6] transition-all duration-500"
              >
                {t("hero.ctaSecondary")}
              </a>
            </div>
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-[#6C6863]/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="border-t border-[#1A1A1A]/10 py-16 md:py-20 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
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
      <section id="upload" className="px-8 md:px-16 pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863]">
            {t("uploadSection.overline")}
          </span>
        </div>
        <LandingContent />
      </section>

      {/* BENEFITS - Dark Section */}
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F9F8F6]/40 mb-4 block">
                {t("benefits.overline")}
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-[#F9F8F6]">
                {t("benefits.headlinePart1")}
                <em className="text-[#D4AF37] italic">{t("benefits.headlineAccent")}</em>
              </h2>
            </div>
            <div className="col-span-12 md:col-span-4 md:col-start-8 flex items-end">
              <p className="text-sm text-[#F9F8F6]/60 leading-relaxed">
                {t("benefits.subtitle")}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-0">
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
      <section id="features" className="py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-8 md:col-start-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
                {t("features.overline")}
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
                {t("features.headlinePart1")}
                <em className="text-[#D4AF37] italic">{t("features.headlineAccent")}</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <FeatureCard
              icon={<Scissors className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.preciseTitle")}
              description={t("features.preciseDesc")}
            />
            <FeatureCard
              icon={<Shield className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.privacyTitle")}
              description={t("features.privacyDesc")}
            />
            <FeatureCard
              icon={<Download className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.downloadTitle")}
              description={t("features.downloadDesc")}
            />
            <FeatureCard
              icon={<Grid3X3 className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.gridTitle")}
              description={t("features.gridDesc")}
            />
            <FeatureCard
              icon={<Image className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.formatTitle")}
              description={t("features.formatDesc")}
            />
            <FeatureCard
              icon={<Zap className="h-4 w-4" strokeWidth={1.5} />}
              title={t("features.previewTitle")}
              description={t("features.previewDesc")}
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-[#1A1A1A]/10 py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
              {t("steps.overline")}
            </span>
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              {t("steps.headlinePart1")}
              <em className="text-[#D4AF37] italic">{t("steps.headlineAccent")}</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-0">
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
      <section className="bg-[#1A1A1A] py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-4 mb-16">
            <div className="col-span-12 md:col-span-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#F9F8F6]/40 mb-4 block">
                {t("useCases.overline")}
              </span>
              <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] text-[#F9F8F6]">
                {t("useCases.headlinePart1")}
                <em className="text-[#D4AF37] italic">{t("useCases.headlineAccent")}</em>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-0">
            <UseCaseCard
              title={t("useCases.ecommerceTitle")}
              description={t("useCases.ecommerceDesc")}
              result={t("useCases.ecommerceResult")}
            />
            <UseCaseCard
              title={t("useCases.designerTitle")}
              description={t("useCases.designerDesc")}
              result={t("useCases.designerResult")}
            />
            <UseCaseCard
              title={t("useCases.socialTitle")}
              description={t("useCases.socialDesc")}
              result={t("useCases.socialResult")}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 px-8 md:px-16 border-t border-[#1A1A1A]/10">
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-7 md:col-start-2">
            <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-6">
              {t("cta.headlinePart1")}
              <em className="text-[#D4AF37] italic">{t("cta.headlineAccent")}</em>
            </h2>
            <p className="text-sm text-[#6C6863] leading-relaxed max-w-md mb-10">
              {t("cta.description")}
            </p>
            <a
              href="#upload"
              className="group relative inline-flex items-center gap-2 bg-[#1A1A1A] text-[#F9F8F6] px-10 py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500"
            >
              <span className="absolute inset-0 bg-[#D4AF37] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
              <span className="relative z-10">{t("cta.button")}</span>
              <ArrowRight className="relative z-10 h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-[#1A1A1A]/10 py-24 md:py-32 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-12 gap-8 md:gap-16">
            <div className="col-span-12 md:col-span-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#6C6863] mb-4 block">
                {t("faq.overline")}
              </span>
              <h2 className="font-serif text-4xl md:text-5xl leading-[0.9] mb-4">
                {t("faq.headlinePart1")}
                <em className="text-[#D4AF37] italic">{t("faq.headlineAccent")}</em>
              </h2>
              <p className="text-sm text-[#6C6863] leading-relaxed">
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
      <footer className="border-t border-[#1A1A1A]/10 py-12 md:py-16 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-3.5 w-3.5 text-[#1A1A1A]" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium">
              ImgSplit
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
            {t("footer.tagline")}
          </p>
          <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-[#6C6863]">
            <a
              href="#features"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("footer.navFeatures")}
            </a>
            <a
              href="#how-it-works"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("footer.navHowItWorks")}
            </a>
            <a
              href="#faq"
              className="hover:text-[#D4AF37] transition-colors duration-500"
            >
              {t("footer.navFaq")}
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ─── Grid Lines ─── */
function GridLines() {
  return (
    <div className="hidden lg:block fixed inset-0 z-30 pointer-events-none">
      <div className="max-w-[1600px] mx-auto h-full relative px-16">
        <div className="absolute left-16 top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute left-[33.33%] top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute left-[66.66%] top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
        <div className="absolute right-16 top-0 w-px h-full bg-[#1A1A1A]/[0.06]" />
      </div>
    </div>
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
    <div className="flex flex-col items-start gap-3 p-6 border-t border-[#1A1A1A]/10">
      <div className="text-[#6C6863]">{icon}</div>
      <span className="text-xs uppercase tracking-[0.2em] font-medium text-[#1A1A1A]">
        {label}
      </span>
      <span className="text-[10px] uppercase tracking-[0.25em] text-[#6C6863]">
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
    <div className="group border-t border-[#F9F8F6]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/[0.03]">
      <div className="text-[#F9F8F6]/40 mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#F9F8F6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#F9F8F6]/50 leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group border-t border-[#1A1A1A]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/50">
      <div className="text-[#6C6863] mb-6 group-hover:text-[#D4AF37] transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#6C6863] leading-relaxed">{description}</p>
    </div>
  )
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
    <div className="border-t border-[#1A1A1A]/10 p-8 md:p-12">
      <span className="font-serif text-5xl md:text-6xl text-[#1A1A1A]/10 leading-none mb-6 block">
        {String(step).padStart(2, "0")}
      </span>
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#1A1A1A] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#6C6863] leading-relaxed">{description}</p>
    </div>
  )
}

/* ─── Use Case Card (Dark bg) ─── */
function UseCaseCard({
  title,
  description,
  result,
}: {
  title: string
  description: string
  result: string
}) {
  return (
    <div className="group border-t border-[#F9F8F6]/10 p-8 md:p-12 transition-colors duration-700 hover:bg-[#F9F8F6]/[0.03]">
      <h3 className="text-sm uppercase tracking-[0.15em] text-[#F9F8F6] mb-3 font-medium">
        {title}
      </h3>
      <p className="text-sm text-[#F9F8F6]/50 leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#D4AF37]">
        <CheckCircle2 className="h-3 w-3" strokeWidth={1.5} />
        {result}
      </div>
    </div>
  )
}
