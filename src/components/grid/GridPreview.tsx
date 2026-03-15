"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { GridEditorState, GridSplitResult } from "@/lib/grid-splitter"
import { splitGrid, getGridConfig } from "@/lib/grid-splitter"
import { exportGridAsZip, getGridZipFileName } from "@/lib/zip-exporter"

interface GridPreviewProps {
  image: HTMLImageElement
  mimeType: string
  state: GridEditorState
  frameWidth: number
  frameHeight: number
  onShowResults: (results: GridSplitResult[]) => void
}

export function GridPreview({
  image,
  mimeType,
  state,
  frameWidth,
  frameHeight,
  onShowResults,
}: GridPreviewProps) {
  const t = useTranslations("grid.download")
  const [isGenerating, setIsGenerating] = useState(false)

  const { rows, cols } = getGridConfig(state.gridType)

  const handleDownload = useCallback(async () => {
    setIsGenerating(true)
    try {
      const results = await splitGrid(
        image,
        state,
        { displayWidth: frameWidth, displayHeight: frameHeight },
        mimeType
      )
      onShowResults(results)

      const ext = mimeType === "image/jpeg" ? "jpg" : "png"
      const zipBlob = await exportGridAsZip(
        results.map((r) => r.blob),
        ext
      )

      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = getGridZipFileName()
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error(t("failed"))
    } finally {
      setIsGenerating(false)
    }
  }, [image, state, frameWidth, frameHeight, mimeType, onShowResults, t])

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
        {t("count", { count: rows * cols })}
      </div>

      {/* Preview grid (placeholder cells) */}
      <div
        className="grid gap-[2px] mb-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-[#EBE5DE] flex items-center justify-center"
          >
            <span className="text-[10px] text-[#6C6863]/50">{i + 1}</span>
          </div>
        ))}
      </div>

      {/* Download button */}
      <button
        onClick={handleDownload}
        disabled={isGenerating}
        className="w-full py-3 bg-[#1A1A1A] text-[#F9F8F6] text-xs uppercase tracking-[0.15em] hover:bg-[#D4AF37] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? t("generating") : t("zip")}
      </button>
    </div>
  )
}
