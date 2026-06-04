import { Link } from "@/i18n/navigation"
import { LandingContent } from "@/app/[locale]/LandingContent"
import { SmartCTA } from "@/app/[locale]/SmartCTA"
import { FaqItem } from "@/app/[locale]/FaqSection"
import { GridLines } from "@/components/GridLines"
import { RelatedTools } from "@/components/pseo/RelatedTools"
import { SiteFooter } from "@/components/SiteFooter"
import { SiteNav } from "@/components/SiteNav"
import type { ToolPageData } from "@/lib/pseo"
import { TOOL_EDITOR_HREFS } from "@/lib/tools/catalog"
import {
  Columns2,
  LayoutList,
  FileText,
  Columns3,
  LayoutDashboard,
  Grid2X2,
  Printer,
  MessageSquare,
  FileSearch,
  LayoutGrid,
  GalleryHorizontal,
  Share2,
  Camera,
  Sparkles,
  Maximize2,
  Image as ImageIcon,
  Ruler,
  DollarSign,
  GraduationCap,
  Smartphone,
  Layers,
  Crop,
  Youtube,
  Shield,
  Stamp,
  Type,
} from "lucide-react"
import type React from "react"

// ─── Icon Map ───

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Columns2,
  LayoutList,
  FileText,
  Columns3,
  LayoutDashboard,
  Grid2X2,
  Printer,
  MessageSquare,
  FileSearch,
  LayoutGrid,
  GalleryHorizontal,
  Share2,
  Camera,
  Sparkles,
  Maximize2,
  Image: ImageIcon,
  Ruler,
  DollarSign,
  GraduationCap,
  Smartphone,
  Layers,
  Crop,
  Youtube,
  Shield,
  Stamp,
  Type,
}

// ─── Translation Interfaces ───

interface NavTranslations {
  features: string
  howItWorks: string
  faq: string
  getStarted: string
  menu: string
  close: string
}

interface UploadSectionTranslations {
  overline: string
}

interface PseoChrome {
  scenariosTitle: string
  howItWorksTitle: string
  howItWorksHeadlinePart1: string
  howItWorksHeadlineAccent: string
  faqTitle: string
  relatedToolsTitle: string
  ctaButton: string
}

interface ToolLandingProps {
  data: ToolPageData
  locale: string
  t: {
    nav: NavTranslations
    uploadSection: UploadSectionTranslations
    pseoChrome: PseoChrome
  }
}

// ─── Component ───

export function ToolLanding({ data, locale, t }: ToolLandingProps) {
  const hasFaq = data.faqEntries.length > 0
  const editorHref = TOOL_EDITOR_HREFS[data.slug]

  return (
    <main className="min-h-screen bg-background relative">
      {/* Grid Lines */}
      <GridLines />

      <SiteNav
        locale={locale}
        links={[
          { href: "#scenarios", label: t.nav.features },
          { href: "#how-it-works", label: t.nav.howItWorks },
          ...(hasFaq ? [{ href: "#faq", label: t.nav.faq }] : []),
        ]}
        ctaLabel={t.nav.getStarted}
        ctaHref={editorHref || "#upload"}
        smartCta
      />

      {/* HERO */}
      <section className="relative py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16 max-w-[1600px] mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 md:col-span-8 md:col-start-1">
            {/* Overline */}
            <div className="drift-slow">
              <div className="flex items-center gap-4 mb-8 hero-enter hero-delay-1">
                <span className="h-px w-8 md:w-12 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {data.hero.overline}
                </span>
              </div>
            </div>

            {/* Headline */}
            <div className="drift-medium">
              <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-9xl leading-[0.9] tracking-tight mb-6 sm:mb-8 hero-enter hero-delay-2">
                {data.hero.headlinePart1}
                <em className="text-accent not-italic font-serif italic">
                  {data.hero.headlineAccent}
                </em>
                <br />
                {data.hero.headlinePart2}
              </h1>
            </div>

            <div className="drift-fast">
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-8 sm:mb-10 hero-enter hero-delay-3">
                {data.hero.description}
              </p>
            </div>

            <div className="drift-fast">
              <div className="flex flex-col sm:flex-row gap-4 hero-enter hero-delay-4">
                <SmartCTA
                  label={t.pseoChrome.ctaButton}
                  href={editorHref}
                  className="group relative inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
                />
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-primary text-foreground px-6 sm:px-10 py-3 sm:py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-all duration-500 press"
                >
                  {t.nav.howItWorks}
                </a>
              </div>
            </div>

            {/* Platform Info */}
            {data.platformInfo && (
              <div className="mt-8 hero-enter hero-delay-4">
                <div className="border-l-2 border-primary/30 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                  {data.platformInfo}
                </div>
              </div>
            )}
          </div>

          {/* Vertical decorative text */}
          <div className="hidden lg:flex col-span-2 col-start-11 items-end justify-end pb-4 hero-enter hero-delay-4">
            <span className="writing-vertical text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              Editorial / Vol. 01
            </span>
          </div>
        </div>
      </section>

      {/* UPLOAD — editor wrappers deep-link to focused tools; split pages keep inline splitter. */}
      <section id="upload" className="px-4 sm:px-8 md:px-16 pb-12 sm:pb-24 md:pb-32 max-w-[1600px] mx-auto">
        <div className="mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t.uploadSection.overline}
          </span>
        </div>
        {editorHref ? (
          <Link
            href={editorHref}
            className="group flex flex-col items-center justify-center border-t border-b p-8 sm:p-16 md:p-24 border-primary/20 hover:border-primary/40 transition-all duration-700 cursor-pointer"
          >
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-6">
                {data.hero.overline}
              </p>
              <p className="font-serif text-2xl md:text-3xl text-foreground mb-4 group-hover:text-accent transition-colors duration-500">
                {t.pseoChrome.ctaButton} →
              </p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/70">
                PNG · JPEG · WebP
              </p>
            </div>
          </Link>
        ) : (
          <LandingContent />
        )}
      </section>

      {/* SCENARIOS */}
      <section id="scenarios" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              {t.pseoChrome.scenariosTitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              {data.hero.headlinePart1}{" "}
              <em className="text-accent italic">{data.hero.headlineAccent}</em>
            </h2>
          </div>

          <div
            className={`grid gap-0 reveal-stagger ${
              data.scenarios.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {data.scenarios.map((scenario, i) => {
              const IconComponent = iconMap[scenario.icon]
              return (
                <div
                  key={i}
                  className="group border-t border-border p-8 md:p-12 transition-colors duration-700 hover:bg-background/50"
                >
                  <div className="text-muted-foreground mb-6 group-hover:text-accent transition-colors duration-500">
                    {IconComponent ? (
                      <IconComponent className="h-4 w-4" strokeWidth={1.5} />
                    ) : (
                      <div className="h-4 w-4" />
                    )}
                  </div>
                  <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                    {scenario.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {scenario.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-16 reveal">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
              {t.pseoChrome.howItWorksTitle}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-[0.9]">
              {t.pseoChrome.howItWorksHeadlinePart1}
              <em className="text-accent italic">{t.pseoChrome.howItWorksHeadlineAccent}</em>
            </h2>
          </div>

          <div
            className={`grid gap-0 reveal-stagger ${
              data.howToSteps.length >= 4 ? "md:grid-cols-4" : "md:grid-cols-3"
            }`}
          >
            {data.howToSteps.map((step) => (
              <div key={step.stepNumber} className="border-t border-border p-8 md:p-12">
                <span className="font-serif text-5xl md:text-6xl text-foreground/10 leading-none mb-6 block">
                  {String(step.stepNumber).padStart(2, "0")}
                </span>
                <h3 className="text-sm uppercase tracking-[0.15em] text-foreground mb-3 font-medium">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {data.faqEntries.length > 0 && (
        <section id="faq" className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
          <div className="max-w-[1600px] mx-auto">
            <div className="grid grid-cols-12 gap-8 md:gap-16">
              <div className="col-span-12 md:col-span-4 reveal">
                <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4 block">
                  {t.pseoChrome.faqTitle}
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl leading-[0.9]">
                  {t.pseoChrome.faqTitle}
                </h2>
              </div>
              <div className="col-span-12 md:col-span-7 md:col-start-6">
                <div className="space-y-0">
                  {data.faqEntries.map((entry, i) => (
                    <FaqItem key={i} question={entry.question} answer={entry.answer} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* RELATED TOOLS */}
      <section className="border-t border-border py-12 sm:py-24 md:py-32 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <RelatedTools
            tools={data.relatedTools}
            locale={locale}
            title={t.pseoChrome.relatedToolsTitle}
          />
        </div>
      </section>

      <SiteFooter locale={locale} />
    </main>
  )
}
