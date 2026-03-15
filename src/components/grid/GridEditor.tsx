"use client"

import { useRef, useCallback } from "react"
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
  frameWidth: number
  frameHeight: number
  onDrag: (deltaX: number, deltaY: number) => void
  onZoom: (delta: number, centerX: number, centerY: number) => void
}

export function GridEditor({
  image,
  imageUrl,
  gridType,
  offsetX,
  offsetY,
  scale,
  frameWidth,
  frameHeight,
  onDrag,
  onZoom,
}: GridEditorProps) {
  const t = useTranslations("grid.editor")
  const containerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const lastTouchDist = useRef<number | null>(null)

  // Mouse drag
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

  // Wheel zoom
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const centerX = e.clientX - rect.left
      const centerY = e.clientY - rect.top
      onZoom(e.deltaY, centerX, centerY)
    },
    [onZoom]
  )

  // Touch pinch zoom
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        )
        if (lastTouchDist.current !== null) {
          const delta = lastTouchDist.current - dist
          const rect = containerRef.current?.getBoundingClientRect()
          if (rect) {
            const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left
            const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top
            onZoom(delta, cx, cy)
          }
        }
        lastTouchDist.current = dist
      }
    },
    [onZoom]
  )

  const handleTouchEnd = useCallback(() => {
    lastTouchDist.current = null
  }, [])

  const { rows, cols } = getGridConfig(gridType)
  const isTouchDevice = typeof window !== "undefined" && "ontouchstart" in window

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px] relative">
      {/* Crop frame */}
      <div
        ref={containerRef}
        className="relative overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing"
        style={{ width: frameWidth, height: frameHeight }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Image layer */}
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="absolute pointer-events-none select-none"
          style={{
            width: image.naturalWidth * scale,
            height: image.naturalHeight * scale,
            transform: `translate(${offsetX}px, ${offsetY}px)`,
            willChange: "transform",
          }}
        />

        {/* Grid overlay lines */}
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

      {/* Hint text */}
      <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {isTouchDevice ? t("pinchHint") : t("dragHint")}
      </p>
    </div>
  )
}
