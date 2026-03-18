"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Stage, Layer, Image as KonvaImage, Line } from "react-konva"
import type Konva from "konva"
import { useTranslations } from "next-intl"
import { getGridConfig } from "@/lib/grid-splitter"
import type { GridType, GridEditorState } from "@/lib/grid-splitter"

interface GridEditorProps {
  image: HTMLImageElement
  gridType: GridType
  frameWidth: number
  frameHeight: number
  minScale: number
  maxScale: number
  scale: number
  offsetX: number
  offsetY: number
  onOffsetChange: (x: number, y: number) => void
  onScaleChange: (s: number) => void
}

export function GridEditor({
  image,
  gridType,
  frameWidth,
  frameHeight,
  minScale,
  maxScale,
  scale,
  offsetX,
  offsetY,
  onOffsetChange,
  onScaleChange,
}: GridEditorProps) {
  const t = useTranslations("grid.editor")
  const imageRef = useRef<Konva.Image>(null)

  const imgW = image.naturalWidth * scale
  const imgH = image.naturalHeight * scale
  const { rows, cols } = getGridConfig(gridType)

  // Clamp image position so it always covers the frame
  const dragBoundFunc = useCallback(
    (pos: { x: number; y: number }) => {
      const x = Math.min(0, Math.max(frameWidth - imgW, pos.x))
      const y = Math.min(0, Math.max(frameHeight - imgH, pos.y))
      return { x, y }
    },
    [frameWidth, frameHeight, imgW, imgH]
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target
      onOffsetChange(node.x(), node.y())
    },
    [onOffsetChange]
  )

  // When scale changes, re-center and clamp
  useEffect(() => {
    const node = imageRef.current
    if (!node) return
    const clamped = dragBoundFunc({ x: node.x(), y: node.y() })
    node.position(clamped)
    onOffsetChange(clamped.x, clamped.y)
  }, [scale]) // eslint-disable-line react-hooks/exhaustive-deps

  // Grid overlay lines
  const gridLines = useMemo(() => {
    const lines: { points: number[] }[] = []
    // Vertical lines
    for (let c = 1; c < cols; c++) {
      const x = (frameWidth / cols) * c
      lines.push({ points: [x, 0, x, frameHeight] })
    }
    // Horizontal lines
    for (let r = 1; r < rows; r++) {
      const y = (frameHeight / rows) * r
      lines.push({ points: [0, y, frameWidth, y] })
    }
    return lines
  }, [frameWidth, frameHeight, rows, cols])

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px]">
      {/* Konva Stage = crop frame */}
      <div className="shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <Stage width={frameWidth} height={frameHeight}>
          <Layer>
            {/* Draggable image */}
            <KonvaImage
              ref={imageRef}
              image={image}
              x={offsetX}
              y={offsetY}
              width={imgW}
              height={imgH}
              draggable
              dragBoundFunc={dragBoundFunc}
              onDragEnd={handleDragEnd}
            />

            {/* Grid overlay lines */}
            {gridLines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke="rgba(255,255,255,0.5)"
                strokeWidth={1}
                listening={false}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[300px]">
        <span className="text-[10px] text-[#6C6863]">-</span>
        <input
          type="range"
          min={Math.round(minScale * 100)}
          max={Math.round(maxScale * 100)}
          value={Math.round(scale * 100)}
          step={1}
          onChange={(e) => onScaleChange(Number(e.target.value) / 100)}
          className="flex-1 h-1 appearance-none bg-[#EBE5DE] cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#1A1A1A] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <span className="text-[10px] text-[#6C6863]">+</span>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {t("dragHint")}
      </p>
    </div>
  )
}
