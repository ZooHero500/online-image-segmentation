"use client"

import { useRef, useCallback, useEffect } from "react"
import { useTranslations } from "next-intl"
import type { GridType } from "@/lib/grid-splitter"
import { getGridConfig } from "@/lib/grid-splitter"

interface GridEditorProps {
  image: HTMLImageElement
  imageUrl: string
  gridType: GridType
  offsetX: number
  offsetY: number
  scale: number
  minScale: number
  maxScale: number
  frameWidth: number
  frameHeight: number
  onDrag: (deltaX: number, deltaY: number) => void
  onScale: (newScale: number) => void
}

export function GridEditor({
  image,
  imageUrl,
  gridType,
  offsetX,
  offsetY,
  scale,
  minScale,
  maxScale,
  frameWidth,
  frameHeight,
  onDrag,
  onScale,
}: GridEditorProps) {
  const t = useTranslations("grid.editor")
  const outerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // Prevent page scroll in editor area
  useEffect(() => {
    const el = outerRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [])

  // Image drag
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      lastPos.current = { x: e.clientX, y: e.clientY }
      onDrag(dx, dy)
    },
    [onDrag]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  const { rows, cols } = getGridConfig(gridType)
  const imgW = image.naturalWidth * scale
  const imgH = image.naturalHeight * scale

  return (
    <div
      ref={outerRef}
      className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px]"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
    >
      {/* Crop frame */}
      <div
        className="relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing"
        style={{ width: frameWidth, height: frameHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="absolute pointer-events-none select-none"
          style={{
            width: imgW,
            height: imgH,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            willChange: "transform",
          }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: rows * cols }).map((_, i) => {
            const r = Math.floor(i / cols)
            const c = i % cols
            return (
              <div
                key={i}
                style={{
                  borderRight: c < cols - 1 ? "1px solid rgba(255,255,255,0.5)" : "none",
                  borderBottom: r < rows - 1 ? "1px solid rgba(255,255,255,0.5)" : "none",
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Zoom slider */}
      <div className="flex items-center gap-3 mt-4 w-full max-w-[300px]">
        <span className="text-[10px] text-[#6C6863]">-</span>
        <input
          type="range"
          min={minScale * 100}
          max={maxScale * 100}
          value={scale * 100}
          step={1}
          onChange={(e) => onScale(Number(e.target.value) / 100)}
          className="flex-1 h-1 appearance-none bg-[#EBE5DE] cursor-pointer accent-[#D4AF37] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#1A1A1A] [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <span className="text-[10px] text-[#6C6863]">+</span>
      </div>

      <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {t("dragHint")}
      </p>
    </div>
  )
}
