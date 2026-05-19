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
    <div className="flex items-center justify-between px-4 py-1.5 border-t border-border bg-background text-[10px] uppercase tracking-wider text-muted-foreground">
      <div className="flex items-center gap-4">
        {imageWidth && imageHeight && (
          <span>
            {t("statusImage")}: {imageWidth} × {imageHeight} {t("px")}
          </span>
        )}
        <span>
          {t("statusCanvas")}: {canvasWidth} × {canvasHeight} {t("px")}
        </span>
        {mode === "crop" && cropRect && (
          <span>
            {t("statusCrop")}: {Math.round(cropRect.width)} × {Math.round(cropRect.height)} {t("px")}
          </span>
        )}
      </div>
      <span>{zoomPercent}%</span>
    </div>
  )
}
