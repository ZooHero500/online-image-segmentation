"use client"

import { useCallback, useEffect, useMemo, useRef } from "react"
import { Stage, Layer, Image as KonvaImage, Line } from "@/lib/konva"
import type Konva from "konva"
import { useTranslations } from "next-intl"
import { getGridConfig } from "@/lib/grid-splitter"
import type { GridType } from "@/lib/grid-splitter"

interface GridEditorProps {
  image: HTMLImageElement
  gridType: GridType
  frameWidth: number
  frameHeight: number
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
    for (let c = 1; c < cols; c++) {
      const x = (frameWidth / cols) * c
      lines.push({ points: [x, 0, x, frameHeight] })
    }
    for (let r = 1; r < rows; r++) {
      const y = (frameHeight / rows) * r
      lines.push({ points: [0, y, frameWidth, y] })
    }
    return lines
  }, [frameWidth, frameHeight, rows, cols])

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const scaleStep = 0.03
      const direction = e.evt.deltaY < 0 ? 1 : -1
      const newScale = scale + direction * scaleStep * scale
      onScaleChange(newScale)
    },
    [scale, onScaleChange]
  )

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px]">
      {/* Konva Stage = crop frame */}
      <div className="shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <Stage width={frameWidth} height={frameHeight} onWheel={handleWheel}>
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

      <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {t("dragHint")}
      </p>
    </div>
  )
}
