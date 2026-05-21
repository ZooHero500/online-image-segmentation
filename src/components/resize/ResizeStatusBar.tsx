"use client"

import { useTranslations } from "next-intl"
import type { CropRect } from "@/types"

interface ResizeStatusBarProps {
  imageWidth: number | null
  imageHeight: number | null
  canvasWidth: number
  canvasHeight: number
  zoomPercent: number
  mode: string
  cropRect: CropRect | null
}

export function ResizeStatusBar({
  imageWidth,
  imageHeight,
  canvasWidth,
  canvasHeight,
  zoomPercent,
  mode,
  cropRect,
}: ResizeStatusBarProps) {
  const t = useTranslations("resize")

  return (
    <div className="flex items-center justify-between px-3 md:px-4 py-1.5 border-t border-border bg-background text-[10px] uppercase tracking-wider text-muted-foreground">
      <div className="flex items-center gap-3 md:gap-4 min-w-0 overflow-hidden">
        {imageWidth && imageHeight && (
          <span className="hidden sm:inline shrink-0">
            {t("statusImage")}: {imageWidth} × {imageHeight} {t("px")}
          </span>
        )}
        <span className="shrink-0">
          {t("statusCanvas")}: {canvasWidth} × {canvasHeight}
        </span>
        {mode === "crop" && cropRect && (
          <span className="shrink-0">
            {t("statusCrop")}: {Math.round(cropRect.width)} × {Math.round(cropRect.height)}
          </span>
        )}
      </div>
      <span className="shrink-0 ml-2">{zoomPercent}%</span>
    </div>
  )
}
