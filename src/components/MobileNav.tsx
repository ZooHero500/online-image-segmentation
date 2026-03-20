"use client"

import { useState, useCallback } from "react"
import { Menu, X, ArrowRight } from "lucide-react"

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  links: NavLink[]
  ctaLabel: string
  ctaHref: string
  menuLabel?: string
  closeLabel?: string
}

export function MobileNav({ links, ctaLabel, ctaHref, menuLabel = "Menu", closeLabel = "Close" }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  const handleLinkClick = useCallback(() => {
    setOpen(false)
  }, [])

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

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-primary/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background shadow-[-8px_0_32px_rgba(0,0,0,0.08)] transform transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
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
        <nav className="flex-1 flex flex-col p-6 gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="py-3 text-sm uppercase tracking-[0.15em] text-muted-foreground hover:text-accent transition-colors duration-500 border-b border-border"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="p-6 border-t border-border">
          <a
            href={ctaHref}
            onClick={handleLinkClick}
            className="group relative flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] overflow-hidden"
          >
            <span className="absolute inset-0 bg-accent -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]" />
            <span className="relative z-10">{ctaLabel}</span>
            <ArrowRight className="relative z-10 h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  )
}
