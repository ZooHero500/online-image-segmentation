"use client"

import { useCallback, useEffect, useRef } from "react"
import { Stage, Layer, Image as KonvaImage, Line } from "@/lib/konva"
import type Konva from "konva"
import { useTranslations } from "next-intl"
import type { CarouselEditorState } from "@/lib/carousel-splitter"

interface FrameSize {
  width: number
  height: number
}

interface ScaleRange {
  minScale: number
  maxScale: number
}

interface CarouselEditorProps {
  image: HTMLImageElement
  imageUrl: string
  frameSize: FrameSize
  state: CarouselEditorState
  scaleRange: ScaleRange
  onOffsetChange: (x: number, y: number) => void
  onScaleChange: (s: number) => void
  slideCount: number
}

export function CarouselEditor({
  image,
  frameSize,
  state,
  scaleRange,
  onOffsetChange,
  onScaleChange,
  slideCount,
}: CarouselEditorProps) {
  const t = useTranslations("carousel.editor")
  const imageRef = useRef<Konva.Image>(null)

  const imgW = image.naturalWidth * state.scale
  const imgH = image.naturalHeight * state.scale

  // Clamp image position so it always covers the frame
  const dragBoundFunc = useCallback(
    (pos: { x: number; y: number }) => {
      const x = Math.min(0, Math.max(frameSize.width - imgW, pos.x))
      const y = Math.min(0, Math.max(frameSize.height - imgH, pos.y))
      return { x, y }
    },
    [frameSize.width, frameSize.height, imgW, imgH]
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
  }, [state.scale]) // eslint-disable-line react-hooks/exhaustive-deps

  // Mouse wheel zoom
  const handleWheel = useCallback(
    (e: Konva.KonvaEventObject<WheelEvent>) => {
      e.evt.preventDefault()
      const scaleStep = 0.03
      const direction = e.evt.deltaY < 0 ? 1 : -1
      const newScale = state.scale + direction * scaleStep * state.scale
      onScaleChange(newScale)
    },
    [state.scale, onScaleChange]
  )

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-secondary/50 p-4 md:p-6 min-h-[280px]">
      {/* Konva Stage = crop frame */}
      <div className="shadow-[0_2px_12px_rgba(0,0,0,0.15)]">
        <Stage width={frameSize.width} height={frameSize.height} onWheel={handleWheel}>
          <Layer>
            {/* Draggable image */}
            <KonvaImage
              ref={imageRef}
              image={image}
              x={state.offsetX}
              y={state.offsetY}
              width={imgW}
              height={imgH}
              draggable
              dragBoundFunc={dragBoundFunc}
              onDragEnd={handleDragEnd}
            />

            {/* Vertical slide split lines */}
            {Array.from({ length: Math.max(0, slideCount - 1) }, (_, i) => i + 1).map((i) => (
              <Line
                key={i}
                points={[(frameSize.width / slideCount) * i, 0, (frameSize.width / slideCount) * i, frameSize.height]}
                stroke="#ffffff"
                strokeWidth={2}
                dash={[6, 4]}
                listening={false}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Zoom slider */}
      <div className="mt-4 flex items-center gap-3 w-full max-w-xs">
        <input
          type="range"
          min={scaleRange.minScale}
          max={scaleRange.maxScale}
          step={0.01}
          value={state.scale}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
        {t("dragHint")}
      </p>
    </div>
  )
}
