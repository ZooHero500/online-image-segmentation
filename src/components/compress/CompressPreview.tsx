"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { formatFileSize } from "@/lib/compress"
import type { CompressResult } from "@/lib/compress"

interface CompressPreviewProps {
  originalFile: File
  originalUrl: string
  result: CompressResult | null
  resultUrl: string | null
}

export function CompressPreview({
  originalFile,
  originalUrl,
  result,
  resultUrl,
}: CompressPreviewProps) {
  const t = useTranslations("compress")

  const originalFormatLabel = useMemo(() => {
    const map: Record<string, string> = {
      "image/png": "PNG",
      "image/jpeg": "JPEG",
      "image/webp": "WebP",
    }
    return map[originalFile.type] ?? "IMG"
  }, [originalFile.type])

  return (
    <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0">
      {/* Original */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("original")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
            {originalFormatLabel}
          </span>
          <span className="ml-auto text-xs tabular-nums text-muted-foreground">
            {formatFileSize(originalFile.size)}
          </span>
        </div>
        <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center min-h-0">
          {originalUrl ? (
            <img
              src={originalUrl}
              alt="Original"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-xs text-muted-foreground">{t("processing")}</span>
          )}
        </div>
      </div>

      {/* Compressed */}
      <div className="flex flex-col min-h-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {t("compressed")}
          </span>
          {result && (
            <>
              <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60">
                {result.format === "image/png" ? "PNG" : result.format === "image/jpeg" ? "JPEG" : "WebP"}
              </span>
              <span className="ml-auto text-xs tabular-nums text-accent">
                {formatFileSize(result.compressedSize)}
                {result.savedPercent > 0 && (
                  <span className="ml-1 text-[10px]">↓{result.savedPercent}%</span>
                )}
              </span>
            </>
          )}
        </div>
        <div className="flex-1 bg-muted/30 rounded-lg overflow-hidden flex items-center justify-center min-h-0">
          {resultUrl ? (
            <img
              src={resultUrl}
              alt="Compressed"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-xs text-muted-foreground">{t("processing")}</span>
          )}
        </div>
      </div>
    </div>
  )
}
