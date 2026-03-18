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
  frameWidth,
  frameHeight,
  onDrag,
  onScale,
}: GridEditorProps) {
  const t = useTranslations("grid.editor")
  const frameRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const isResizing = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const resizeStartScale = useRef(0)
  const resizeStartY = useRef(0)

  // Prevent page scroll when interacting with the editor area
  useEffect(() => {
    const el = frameRef.current?.parentElement
    if (!el) return
    const handler = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [])

  // --- Image drag (move) ---
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return
    // Ignore if clicking on a resize handle
    if ((e.target as HTMLElement).dataset.handle) return
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (isDragging.current) {
        const dx = e.clientX - lastPos.current.x
        const dy = e.clientY - lastPos.current.y
        lastPos.current = { x: e.clientX, y: e.clientY }
        onDrag(dx, dy)
      }
    },
    [onDrag]
  )

  const handlePointerUp = useCallback(() => {
    isDragging.current = false
  }, [])

  // --- Corner handle drag (resize/scale) ---
  const onScaleRef = useRef(onScale)
  onScaleRef.current = onScale
  const scaleRef = useRef(scale)
  scaleRef.current = scale

  const handleHandlePointerDown = useCallback((e: React.PointerEvent) => {
    e.stopPropagation()
    e.preventDefault()
    isResizing.current = true
    resizeStartScale.current = scaleRef.current
    resizeStartY.current = e.clientY
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const handleHandlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isResizing.current) return
    // Drag down = zoom in, drag up = zoom out (intuitive: pulling corners outward)
    const deltaY = e.clientY - resizeStartY.current
    const sensitivity = 0.003
    const newScale = resizeStartScale.current * (1 + deltaY * sensitivity)
    onScaleRef.current(newScale)
  }, [])

  const handleHandlePointerUp = useCallback(() => {
    isResizing.current = false
  }, [])

  const { rows, cols } = getGridConfig(gridType)

  // Compute image displayed dimensions
  const imgW = image.naturalWidth * scale
  const imgH = image.naturalHeight * scale

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center bg-[#EBE5DE]/50 p-4 md:p-6 min-h-[280px] relative"
      style={{ touchAction: "none", overscrollBehavior: "contain" }}
    >
      {/* Outer: shows dimmed image beyond the crop frame */}
      <div className="relative" style={{ width: frameWidth, height: frameHeight }}>
        {/* Crop frame with image */}
        <div
          ref={frameRef}
          className="absolute inset-0 overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.15)] cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Image layer */}
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

        {/* Corner resize handles — Canva style */}
        {[
          { pos: "top-0 left-0", cursor: "nwse-resize" },
          { pos: "top-0 right-0", cursor: "nesw-resize" },
          { pos: "bottom-0 left-0", cursor: "nesw-resize" },
          { pos: "bottom-0 right-0", cursor: "nwse-resize" },
        ].map((handle, i) => (
          <div
            key={i}
            data-handle="true"
            className={`absolute ${handle.pos} z-10`}
            style={{
              width: 20,
              height: 20,
              cursor: handle.cursor,
              // Visual corner indicator
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPointerDown={handleHandlePointerDown}
            onPointerMove={handleHandlePointerMove}
            onPointerUp={handleHandlePointerUp}
          >
            <div
              className="bg-white shadow-[0_1px_4px_rgba(0,0,0,0.3)]"
              style={{ width: 10, height: 10, pointerEvents: "none" }}
            />
          </div>
        ))}
      </div>

      <p className="mt-3 text-[10px] uppercase tracking-[0.15em] text-[#6C6863]">
        {t("dragHint")}
      </p>
    </div>
  )
}
