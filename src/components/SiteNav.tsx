import { ArrowRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "@/components/LocaleSwitcher"
import { LogoIcon } from "@/components/LogoIcon"
import { MobileNav } from "@/components/MobileNav"
import { SmartCTA } from "@/app/[locale]/SmartCTA"
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
  const resolvedCtaLabel = ctaLabel ?? tNav("getStarted")
  const navLinks = includeToolsLink
    ? [{ href: "/tools", label: tFooter("toolAll") }, ...links]
    : links

  return (
    <nav className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <LogoIcon className="h-4 w-4 text-foreground" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-foreground">
            ImgSplit
          </span>
        </Link>
        <div className="flex items-center gap-2 md:gap-8 text-xs">
          {navLinks.map((link) => (
            <NavLink key={`${link.href}-${link.label}`} href={link.href} className="hidden md:inline">
              {link.label}
            </NavLink>
          ))}
          <MobileNav
            links={navLinks}
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
