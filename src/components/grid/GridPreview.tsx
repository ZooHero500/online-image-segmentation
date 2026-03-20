"use client"

import { useState, useCallback, useMemo } from "react"
import { Stage, Layer, Image as KonvaImage, Group, Rect } from "@/lib/konva"
import { useTranslations } from "next-intl"
import { toast } from "sonner"
import type { GridEditorState, GridSplitResult } from "@/lib/grid-splitter"
import { splitGrid, getGridConfig } from "@/lib/grid-splitter"

interface GridPreviewProps {
  image: HTMLImageElement
  mimeType: string
  state: GridEditorState
  frameWidth: number
  frameHeight: number
  onGenerated: (results: GridSplitResult[]) => void
}

export function GridPreview({
  image,
  mimeType,
  state,
  frameWidth,
  frameHeight,
  onGenerated,
}: GridPreviewProps) {
  const t = useTranslations("grid.download")
  const [isGenerating, setIsGenerating] = useState(false)

  const { rows, cols } = getGridConfig(state.gridType)

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

  // Preview layout: fit the grid into ~160px wide area with 2px gaps
  const gap = 2
  const containerWidth = 160
  const totalGapX = gap * (cols - 1)
  const totalGapY = gap * (rows - 1)
  const cellW = (containerWidth - totalGapX) / cols
  const cellH = cellW // square cells
  const stageWidth = containerWidth
  const stageHeight = cellH * rows + totalGapY

  // Scale factor: how much to shrink the editor frame to fit in one cell
  const editorCellW = frameWidth / cols
  const editorCellH = frameHeight / rows
  const scaleX = cellW / editorCellW
  const scaleY = cellH / editorCellH
  const cellScale = Math.min(scaleX, scaleY)

  const imgW = image.naturalWidth * state.scale
  const imgH = image.naturalHeight * state.scale

  // Build cell data
  const cells = useMemo(() => {
    return Array.from({ length: rows * cols }, (_, i) => {
      const r = Math.floor(i / cols)
      const c = i % cols
      // Position of this cell in the stage
      const x = c * (cellW + gap)
      const y = r * (cellH + gap)
      // Clip region offset within the editor frame
      const clipX = c * editorCellW
      const clipY = r * editorCellH
      return { r, c, x, y, clipX, clipY }
    })
  }, [rows, cols, cellW, cellH, gap, editorCellW, editorCellH])

  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-3">
        {t("count", { count: rows * cols })}
      </div>

      <div className="mb-6 flex justify-center">
        <Stage width={stageWidth} height={stageHeight} listening={false}>
          <Layer>
            {cells.map(({ r, c, x, y, clipX, clipY }, i) => (
              <Group
                key={i}
                x={x}
                y={y}
                clipX={0}
                clipY={0}
                clipWidth={cellW}
                clipHeight={cellH}
              >
                {/* Cell background */}
                <Rect width={cellW} height={cellH} fill="#EBE5DE" />
                {/* Scaled-down image, offset to show only this cell's portion */}
                <KonvaImage
                  image={image}
                  x={(state.offsetX - clipX) * cellScale}
                  y={(state.offsetY - clipY) * cellScale}
                  width={imgW * cellScale}
                  height={imgH * cellScale}
                />
              </Group>
            ))}

            {/* Grid gap lines (white separators) */}
            {Array.from({ length: cols - 1 }, (_, c) => {
              const x = (c + 1) * (cellW + gap) - gap
              return (
                <Rect key={`v${c}`} x={x} y={0} width={gap} height={stageHeight} fill="#F9F8F6" />
              )
            })}
            {Array.from({ length: rows - 1 }, (_, r) => {
              const y = (r + 1) * (cellH + gap) - gap
              return (
                <Rect key={`h${r}`} x={0} y={y} width={stageWidth} height={gap} fill="#F9F8F6" />
              )
            })}
          </Layer>
        </Stage>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="w-full py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.15em] hover:bg-accent transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGenerating ? t("generating") : t("generate")}
      </button>
    </div>
  )
}
