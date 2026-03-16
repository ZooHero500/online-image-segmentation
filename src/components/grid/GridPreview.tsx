"use client"

import { useState, useCallback } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { GridEditorState, GridSplitResult } from "@/lib/grid-splitter"
import { splitGrid, getGridConfig } from "@/lib/grid-splitter"

interface GridPreviewProps {
  image: HTMLImageElement
  imageUrl: string
  mimeType: string
  state: GridEditorState
  frameWidth: number
  frameHeight: number
  onGenerated: (results: GridSplitResult[]) => void
}

export function GridPreview({
  image,
  imageUrl,
  mimeType,
  state,
  frameWidth,
  frameHeight,
  onGenerated,
}: GridPreviewProps) {
  const t = useTranslations("grid.download")
  const [isGenerating, setIsGenerating] = useState(false)

  const { rows, cols } = getGridConfig(state.gridType)
  const cellW = frameWidth / cols
  const cellH = frameHeight / rows

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true)
    try {
      const results = await splitGrid(
        image,
        state,
        { displayWidth: frameWidth, displayHeight: frameHeight },
        mimeType
      )
      onGenerated(results)
    } catch {
      toast.error(t("failed"))
    } finally {
      setIsGenerating(false)
    }
  }, [image, state, frameWidth, frameHeight, mimeType, onGenerated, t])

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
        {t("count", { count: rows * cols })}
      </div>

      {/* Live CSS preview grid — shows actual cropped regions */}
      <div
        className="grid gap-[2px] mb-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          // Map each cell back to the corresponding region of the image
          // in the editor coordinate system
          const previewSize = 48
          const previewScale = previewSize / cellW
          return (
            <div
              key={i}
              className="aspect-square overflow-hidden bg-[#EBE5DE]"
              style={{ position: "relative" }}
            >
              <img
                src={imageUrl}
                alt=""
                draggable={false}
                className="absolute pointer-events-none select-none"
                style={{
                  width: image.naturalWidth * state.scale * previewScale,
                  height: image.naturalHeight * state.scale * previewScale,
                  left: (state.offsetX - c * cellW) * previewScale,
                  top: (state.offsetY - r * cellH) * previewScale,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Generate button — only generates, does not download */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3 bg-[#1A1A1A] text-[#F9F8F6] text-xs uppercase tracking-[0.15em] hover:bg-[#D4AF37] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? t("generating") : t("generate")}
      </button>
    </div>
  )
}
