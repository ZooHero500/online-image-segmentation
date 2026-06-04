"use client"

import { useState, useCallback } from "react"
import { createPortal } from "react-dom"
import {
  Menu,
  X,
  ArrowRight,
  EyeOff,
  Grid3X3,
  LayoutTemplate,
  Maximize2,
  Scissors,
  Stamp,
  Zap,
} from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { CoreToolIcon } from "@/lib/tools/catalog"
import type { LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface NavLink {
  href: string
  label: string
}

interface ToolLink extends NavLink {
  icon: CoreToolIcon
}

interface MobileNavProps {
  links: NavLink[]
  toolLinks?: ToolLink[]
  ctaLabel: string
  ctaHref: string
  menuLabel?: string
  closeLabel?: string
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

export function MobileNav({
  links,
  toolLinks,
  ctaLabel,
  ctaHref,
  menuLabel = "Menu",
  closeLabel = "Close",
}: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = useCallback(() => {
    setOpen(false)
  }, [])

  // Portal content — rendered to document.body to escape nav's backdrop-filter containing block
  const overlay = (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[2px] md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col md:hidden ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        {/* Close button */}
        <div className="flex items-center justify-end p-4 border-b border-border">
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            aria-label={closeLabel}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col p-6 gap-1 overflow-y-auto">
          {links.map((link) =>
            link.href === "/tools" && toolLinks?.length ? (
              <MobileToolsSection
                key={link.href}
                label={link.label}
                tools={toolLinks}
                onClick={handleLinkClick}
              />
            ) : (
              <MobileLink key={link.href} href={link.href} onClick={handleLinkClick}>
                {link.label}
              </MobileLink>
            )
          )}
        </nav>

        {/* CTA */}
        <div className="p-6 border-t border-border">
          <MobileLink
            href={ctaHref}
            onClick={handleLinkClick}
            className="group relative flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            <span className="relative z-10">{ctaLabel}</span>
            <ArrowRight className="relative z-10 h-3 w-3" />
          </MobileLink>
        </div>
      </div>
    </>
  )

  return (
    <div className="md:hidden">
      {/* Hamburger trigger */}
      <button
        onClick={() => setOpen(true)}
        className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label={menuLabel}
      >
        <Menu className="h-4 w-4" strokeWidth={1.5} />
      </button>

      {/* Portal to body — escapes nav's backdrop-filter stacking context */}
      {open && typeof document !== "undefined" && createPortal(overlay, document.body)}
    </div>
  )
}

function MobileToolsSection({
  label,
  tools,
  onClick,
}: {
  label: string
  tools: ToolLink[]
  onClick: () => void
}) {
  return (
    <div className="border-b border-border pb-4">
      <MobileLink href="/tools" onClick={onClick} className="flex items-center justify-between py-3 text-sm uppercase tracking-[0.15em] text-foreground hover:text-accent transition-colors duration-500">
        {label}
        <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
      </MobileLink>
      <div className="grid grid-cols-1 gap-1 pt-1">
        {tools.map((tool) => {
          const Icon = toolIconMap[tool.icon]

          return (
            <MobileLink
              key={tool.href}
              href={tool.href}
              onClick={onClick}
              className="flex min-h-11 items-center gap-3 px-3 py-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-colors duration-300"
            >
              <Icon className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} />
              <span>{tool.label}</span>
            </MobileLink>
          )
        })}
      </div>
    </div>
  )
}

function MobileLink({
  href,
  onClick,
  className = "py-3 text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors duration-500 border-b border-border",
  children,
}: {
  href: string
  onClick: () => void
  className?: string
  children: ReactNode
}) {
  if (href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:")) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  )
}
