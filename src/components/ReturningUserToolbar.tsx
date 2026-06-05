"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { ArrowRight, EyeOff, Grid3X3, LayoutTemplate, Maximize2, Send, Scissors, Sparkles, Stamp, Zap } from "lucide-react"
import { CORE_TOOLS, type CoreToolIcon } from "@/lib/tools/catalog"

const VISITED_KEY = "imgsplit_visited"

const iconMap: Record<CoreToolIcon, typeof Scissors> = {
  scissors: Scissors,
  grid: Grid3X3,
  resize: Maximize2,
  compress: Zap,
  watermark: Stamp,
  mosaic: EyeOff,
  collage: LayoutTemplate,
  socialExport: Send,
  removeBackground: Sparkles,
}

export function ReturningUserToolbar() {
  const [show, setShow] = useState(false)
  const t = useTranslations("footer")

  useEffect(() => {
    try {
      if (localStorage.getItem(VISITED_KEY)) {
        queueMicrotask(() => setShow(true))
      }
      localStorage.setItem(VISITED_KEY, "1")
    } catch {
      // localStorage unavailable (e.g. private browsing)
    }
  }, [])

  if (!show) return null

  return (
    <div className="border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-4 md:px-16 h-10 flex items-center gap-6 overflow-x-auto text-[10px] uppercase tracking-[0.2em]">
        {CORE_TOOLS.map((tool) => {
          const Icon = iconMap[tool.icon]

          return (
            <Link
              key={tool.id}
              href={tool.quickAccessHref}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
            >
              <Icon className="h-3 w-3" strokeWidth={1.5} />
              {t(tool.labelKey)}
            </Link>
          )
        })}
        <Link
          href="/tools"
          className="flex items-center gap-1.5 text-accent hover:text-accent/80 transition-colors duration-300 whitespace-nowrap ml-auto"
        >
          {t("toolAll")}
          <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </div>
    </div>
  )
}
