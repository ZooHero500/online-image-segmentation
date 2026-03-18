"use client"

import { useState, useCallback, useRef, useEffect } from "react"
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
  const gridRef = useRef<HTMLDivElement>(null)
  const [cellPx, setCellPx] = useState(48)

  const { rows, cols } = getGridConfig(state.gridType)

  // Measure actual cell pixel size
  useEffect(() => {
    if (!gridRef.current) return
    const firstCell = gridRef.current.firstElementChild as HTMLElement
    if (firstCell) {
      setCellPx(firstCell.getBoundingClientRect().width)
    }
  })

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

  // Each preview cell is a scaled-down copy of the editor frame,
  // translated to show only the relevant cell portion.
  // This is 100% reliable because it uses the same CSS rendering as the editor.
  const cellW = frameWidth / cols
  const cellH = frameHeight / rows
  const scaleFactor = cellPx / cellW
  const imgW = image.naturalWidth * state.scale
  const imgH = image.naturalHeight * state.scale

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-[#6C6863] mb-3">
        {t("count", { count: rows * cols })}
      </div>

      <div
        ref={gridRef}
        className="grid gap-[2px] mb-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const r = Math.floor(i / cols)
          const c = i % cols
          return (
            <div
              key={i}
              className="aspect-square overflow-hidden bg-[#EBE5DE]"
            >
              {/* Scaled-down copy of the frame with image, translated to this cell */}
              <div
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  transform: `scale(${scaleFactor}) translate(${-c * cellW}px, ${-r * cellH}px)`,
                  transformOrigin: "0 0",
                  position: "relative",
                }}
              >
                <img
                  src={imageUrl}
                  alt=""
                  draggable={false}
                  style={{
                    position: "absolute",
                    width: imgW,
                    height: imgH,
                    transform: `translate(${state.offsetX}px, ${state.offsetY}px)`,
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

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
