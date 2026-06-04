"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Scissors, Grid3X3, Maximize2, Stamp, ArrowRight } from "lucide-react"

const VISITED_KEY = "imgsplit_visited"

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
        <Link
          href="/workspace"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
        >
          <Scissors className="h-3 w-3" strokeWidth={1.5} />
          {t("toolSplit")}
        </Link>
        <Link
          href="/grid/workspace"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
        >
          <Grid3X3 className="h-3 w-3" strokeWidth={1.5} />
          {t("toolGrid")}
        </Link>
        <Link
          href="/resize"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
        >
          <Maximize2 className="h-3 w-3" strokeWidth={1.5} />
          {t("toolResize")}
        </Link>
        <Link
          href="/watermark"
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent transition-colors duration-300 whitespace-nowrap"
        >
          <Stamp className="h-3 w-3" strokeWidth={1.5} />
          {t("toolWatermark")}
        </Link>
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
