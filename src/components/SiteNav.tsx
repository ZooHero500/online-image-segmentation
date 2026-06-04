import {
  ArrowRight,
  ChevronDown,
  EyeOff,
  Grid3X3,
  LayoutTemplate,
  Maximize2,
  Scissors,
  Stamp,
  Zap,
} from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { MobileNav } from "@/components/MobileNav"
import { SmartCTA } from "@/app/[locale]/SmartCTA"
import { CORE_TOOLS, type CoreToolIcon } from "@/lib/tools/catalog"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

export interface SiteNavLink {
  href: string
  label: string
}

interface SiteNavProps {
  locale: string
  links?: SiteNavLink[]
  ctaLabel?: string
  ctaHref?: string
  smartCta?: boolean
  includeToolsLink?: boolean
}

const toolIconMap: Record<CoreToolIcon, LucideIcon> = {
  scissors: Scissors,
  grid: Grid3X3,
  resize: Maximize2,
  compress: Zap,
  watermark: Stamp,
  mosaic: EyeOff,
  collage: LayoutTemplate,
}

export async function SiteNav({
  locale,
  links = [],
  ctaLabel,
  ctaHref,
  smartCta = false,
  includeToolsLink = true,
}: SiteNavProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" })
  const tFooter = await getTranslations({ locale, namespace: "footer" })
  const tTools = await getTranslations({ locale, namespace: "toolsHub" })
  const resolvedCtaLabel = ctaLabel ?? tNav("getStarted")
  const allToolsLabel = tFooter("toolAll")
  const toolLinks = CORE_TOOLS.map((tool) => ({
    href: tool.href,
    label: tFooter(tool.labelKey),
    description: tTools(tool.descriptionKey),
    icon: tool.icon,
  }))

  return (
    <nav className="sticky top-0 z-[70] bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <LogoIcon className="h-4 w-4 text-foreground" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
            ImgSplit
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-8 text-xs">
          {includeToolsLink && (
            <ToolsDropdown label={allToolsLabel} tools={toolLinks} />
          )}
          {links.map((link) => (
            <NavLink key={`${link.href}-${link.label}`} href={link.href} className="hidden md:inline">
              {link.label}
            </NavLink>
          ))}
          <MobileNav
            links={includeToolsLink ? [{ href: "/tools", label: allToolsLabel }, ...links] : links}
            toolLinks={includeToolsLink ? toolLinks : undefined}
            ctaLabel={resolvedCtaLabel}
            ctaHref={ctaHref ?? "#upload"}
            menuLabel={tNav("menu")}
            closeLabel={tNav("close")}
          />
          <LocaleSwitcher variant="compact" />
          {smartCta ? (
            <SmartCTA
              label={resolvedCtaLabel}
              href={ctaHref}
              className="hidden md:inline-flex group relative items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 cursor-pointer press"
            />
          ) : (
            <NavAction href={ctaHref ?? "/"}>{resolvedCtaLabel}</NavAction>
          )}
        </div>
      </div>
    </nav>
  )
}

function ToolsDropdown({
  label,
  tools,
}: {
  label: string
  tools: Array<{
    href: string
    label: string
    description: string
    icon: CoreToolIcon
  }>
}) {
  return (
    <div className="hidden md:block group">
      <Link
        href="/tools"
        aria-haspopup="true"
        className="inline-flex items-center gap-1.5 uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline"
      >
        {label}
        <ChevronDown className="h-3 w-3 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.5} />
      </Link>
      <div className="fixed left-1/2 top-16 z-50 w-[min(760px,calc(100vw-2rem))] -translate-x-1/2 pt-3 opacity-0 invisible pointer-events-none translate-y-2 transition-all duration-300 ease-luxury group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0">
        <div className="border border-border bg-background shadow-[0_24px_80px_rgba(0,0,0,0.12)]">
          <div className="grid grid-cols-2 gap-px bg-border">
            {tools.map((tool, index) => {
              const Icon = toolIconMap[tool.icon]
              const spansFullRow = tools.length % 2 === 1 && index === tools.length - 1

              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={`min-h-24 bg-background p-5 text-foreground transition-colors duration-300 hover:bg-secondary/70 ${spansFullRow ? "col-span-2" : ""}`}
                >
                  <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.18em]">
                    <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
                    {tool.label}
                  </span>
                  <span className="mt-2 block text-xs normal-case tracking-normal leading-5 text-muted-foreground">
                    {tool.description}
                  </span>
                </Link>
              )
            })}
          </div>
          <Link
            href="/tools"
            className="flex items-center justify-between gap-4 border-t border-border px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-accent transition-colors duration-300 hover:text-foreground"
          >
            {label}
            <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  )
}

function NavLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const baseClass = `${className ?? ""} uppercase tracking-[0.2em] text-muted-foreground hover:text-accent transition-colors duration-500 link-underline`

  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={baseClass}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={baseClass}>
      {children}
    </Link>
  )
}

function NavAction({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  const className =
    "hidden md:inline-flex group relative items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 text-xs uppercase tracking-[0.2em] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-shadow duration-500 press"
  const content = (
    <>
      <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
      <span className="relative z-10">{children}</span>
      <ArrowRight className="relative z-10 h-3 w-3" />
    </>
  )

  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  )
}
