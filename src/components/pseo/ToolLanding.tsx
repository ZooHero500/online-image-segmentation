import { Link } from "@/i18n/navigation"
import { LandingContent } from "@/app/[locale]/LandingContent"
import { SmartCTA } from "@/app/[locale]/SmartCTA"
import { FaqItem } from "@/app/[locale]/FaqSection"
import { LogoIcon } from "@/components/LogoIcon"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { MobileNav } from "@/components/MobileNav"
import { GridLines } from "@/components/GridLines"
import { RelatedTools } from "@/components/pseo/RelatedTools"
import type { ToolPageData } from "@/lib/pseo"
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

interface FooterTranslations {
  tagline: string
  toolsTitle: string
  toolGrid: string
  toolResize: string
  toolCompress: string
  toolWatermark: string
  toolSplit: string
  toolAll: string
  navTitle: string
  navFeatures: string
  navHowItWorks: string
  navFaq: string
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
    footer: FooterTranslations
    pseoChrome: PseoChrome
  }
}

// ─── Component ───

// Map pSEO wrapper slugs to focused editor preset URLs.
const EDITOR_SLUG_HREF: Record<string, string> = {
  "compress-image": "/compress",
  "compress-jpeg": "/compress?format=jpeg&quality=75",
  "compress-png": "/compress?format=png",
  "png-to-webp": "/compress?format=webp&quality=80",
  "png-to-jpg": "/compress?format=jpeg&quality=85",
  "jpg-to-png": "/compress?format=png",
  "jpg-to-webp": "/compress?format=webp&quality=80",
  "webp-to-png": "/compress?format=png",
  "webp-to-jpg": "/compress?format=jpeg&quality=85",
  "reduce-image-size": "/compress?format=webp&quality=70",
  "crop-image": "/resize",
  "crop-for-instagram": "/resize?preset=instagram-square",
  "instagram-story-crop": "/resize?preset=instagram-story",
  "youtube-thumbnail-crop": "/resize?preset=youtube-thumbnail",
}

export function ToolLanding({ data, locale, t }: ToolLandingProps) {
  const hasFaq = data.faqEntries.length > 0
  const editorHref = EDITOR_SLUG_HREF[data.slug]

  return (
    <main className="min-h-screen bg-background relative">
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
            <a
              href="#scenarios"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {t.nav.features}
            </a>
            <a
              href="#how-it-works"
              className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
            >
              {t.nav.howItWorks}
            </a>
            {hasFaq && (
              <a
                href="#faq"
                className="hidden md:inline uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
              >
                {t.nav.faq}
              </a>
            )}
            <MobileNav
              links={[
                { href: "#scenarios", label: t.nav.features },
                { href: "#how-it-works", label: t.nav.howItWorks },
                ...(hasFaq ? [{ href: "#faq", label: t.nav.faq }] : []),
              ]}
              ctaLabel={t.nav.getStarted}
              ctaHref={editorHref || "#upload"}
              menuLabel={t.nav.menu}
              closeLabel={t.nav.close}
            />
            <LocaleSwitcher variant="compact" />
            <SmartCTA
              label={t.nav.getStarted}
              href={editorHref}
              className="hidden md:inline-flex group relative items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
            />
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

      {/* FOOTER */}
      <footer className="border-t border-border py-12 md:py-16 px-4 sm:px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-3.5 w-3.5 text-foreground" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium">
              ImgSplit
            </span>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.25em] text-muted-foreground ml-4">
              {t.footer.tagline}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {t.footer.toolsTitle}
              </p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <Link
                  href="/grid"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolGrid}
                </Link>
                <Link
                  href="/resize"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolResize}
                </Link>
                <Link
                  href="/compress"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolCompress}
                </Link>
                <Link
                  href="/watermark"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolWatermark}
                </Link>
                <a
                  href="#upload"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolSplit}
                </a>
                <Link
                  href="/tools"
                  className="hover:text-accent transition-colors duration-500"
                >
                  {t.footer.toolAll}
                </Link>
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                {t.footer.navTitle}
              </p>
              <div className="flex gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <a href="#scenarios" className="hover:text-accent transition-colors duration-500">
                  {t.footer.navFeatures}
                </a>
                <a href="#how-it-works" className="hover:text-accent transition-colors duration-500">
                  {t.footer.navHowItWorks}
                </a>
                {hasFaq && (
                  <a href="#faq" className="hover:text-accent transition-colors duration-500">
                    {t.footer.navFaq}
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <a href="https://www.producthunt.com/products/imgsplit?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-imgsplit" target="_blank" rel="noopener noreferrer">
              <img alt="ImgSplit - Split images with precision — free, private, no upload | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1114907&theme=light&t=1775379733917" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
