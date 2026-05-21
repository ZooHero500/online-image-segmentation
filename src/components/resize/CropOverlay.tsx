"use client"

import { useCallback, useRef } from "react"
import { Group, Rect, Line } from "@/lib/konva"
import { constrainCropRect } from "@/lib/resize-utils"
import type Konva from "konva"

interface CropRect {
  x: number
  y: number
  width: number
  height: number
}

interface CropOverlayProps {
  cropRect: CropRect
  imageBounds: CropRect
  artboardBounds: CropRect
  onCropChange: (rect: CropRect) => void
  onCursorChange?: (cursor: string) => void
  aspectRatio?: number | null
}

const HANDLE_SIZE = 12
const EDGE_HANDLE_W = 20
const EDGE_HANDLE_H = 6
const HANDLE_COLOR = "#ffffff"
const HANDLE_STROKE = "#0066ff"
const DIM_COLOR = "rgba(0, 0, 0, 0.5)"

const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const
type Corner = (typeof CORNERS)[number]

const EDGES = ["top", "right", "bottom", "left"] as const
type Edge = (typeof EDGES)[number]

const CORNER_CURSORS: Record<Corner, string> = {
  "top-left": "nwse-resize",
  "top-right": "nesw-resize",
  "bottom-left": "nesw-resize",
  "bottom-right": "nwse-resize",
}

const EDGE_CURSORS: Record<Edge, string> = {
  top: "ns-resize",
  bottom: "ns-resize",
  left: "ew-resize",
  right: "ew-resize",
}

function getCornerPos(corner: Corner, rect: CropRect): { x: number; y: number } {
  switch (corner) {
    case "top-left":
      return { x: rect.x, y: rect.y }
    case "top-right":
      return { x: rect.x + rect.width, y: rect.y }
    case "bottom-left":
      return { x: rect.x, y: rect.y + rect.height }
    case "bottom-right":
      return { x: rect.x + rect.width, y: rect.y + rect.height }
  }
}

function getEdgePos(edge: Edge, rect: CropRect): { x: number; y: number } {
  switch (edge) {
    case "top":
      return { x: rect.x + rect.width / 2, y: rect.y }
    case "right":
      return { x: rect.x + rect.width, y: rect.y + rect.height / 2 }
    case "bottom":
      return { x: rect.x + rect.width / 2, y: rect.y + rect.height }
    case "left":
      return { x: rect.x, y: rect.y + rect.height / 2 }
  }
}

export function CropOverlay({
  cropRect,
  imageBounds,
  artboardBounds,
  onCropChange,
  onCursorChange,
  aspectRatio,
}: CropOverlayProps) {
  const dragStartRect = useRef<CropRect | null>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const emitCursor = useCallback((cursor: string) => {
    onCursorChange?.(cursor)
  }, [onCursorChange])

  // --- Whole crop area drag ---
  const handleCropDragStart = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      dragStartRect.current = { ...cropRect }
      dragStartPos.current = { x: e.target.x(), y: e.target.y() }
    },
    [cropRect]
  )

  const handleCropDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      if (!dragStartRect.current) return
      const dx = e.target.x() - dragStartPos.current.x
      const dy = e.target.y() - dragStartPos.current.y
      const startR = dragStartRect.current

      let newX = startR.x + dx
      let newY = startR.y + dy

      newX = Math.max(imageBounds.x, Math.min(imageBounds.x + imageBounds.width - startR.width, newX))
      newY = Math.max(imageBounds.y, Math.min(imageBounds.y + imageBounds.height - startR.height, newY))

      onCropChange({ x: newX, y: newY, width: startR.width, height: startR.height })
    },
    [imageBounds, onCropChange]
  )

  const handleCropDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      e.target.x(0)
      e.target.y(0)
      dragStartRect.current = null
    },
    []
  )

  // --- Corner handles ---
  const handleCornerDrag = useCallback(
    (corner: Corner, e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target
      const nx = node.x() + HANDLE_SIZE / 2
      const ny = node.y() + HANDLE_SIZE / 2

      let newRect: CropRect

      switch (corner) {
        case "top-left":
          newRect = { x: nx, y: ny, width: cropRect.x + cropRect.width - nx, height: cropRect.y + cropRect.height - ny }
          break
        case "top-right":
          newRect = { x: cropRect.x, y: ny, width: nx - cropRect.x, height: cropRect.y + cropRect.height - ny }
          break
        case "bottom-left":
          newRect = { x: nx, y: cropRect.y, width: cropRect.x + cropRect.width - nx, height: ny - cropRect.y }
          break
        case "bottom-right":
          newRect = { x: cropRect.x, y: cropRect.y, width: nx - cropRect.x, height: ny - cropRect.y }
          break
      }

      if (aspectRatio) {
        const isLeft = corner === "top-left" || corner === "bottom-left"
        const isTop = corner === "top-left" || corner === "top-right"
        if (newRect.width / newRect.height > aspectRatio) {
          newRect.width = newRect.height * aspectRatio
          if (isLeft) newRect.x = cropRect.x + cropRect.width - newRect.width
        } else {
          newRect.height = newRect.width / aspectRatio
          if (isTop) newRect.y = cropRect.y + cropRect.height - newRect.height
        }
      }

      const constrained = constrainCropRect(newRect, imageBounds)
      onCropChange(constrained)
    },
    [cropRect, imageBounds, onCropChange, aspectRatio]
  )

  // --- Edge handles ---
  const handleEdgeDrag = useCallback(
    (edge: Edge, e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target
      let newRect: CropRect = { ...cropRect }

      switch (edge) {
        case "top": {
          const ny = node.y() + EDGE_HANDLE_H / 2
          newRect = { x: cropRect.x, y: ny, width: cropRect.width, height: cropRect.y + cropRect.height - ny }
          break
        }
        case "bottom": {
          const ny = node.y() + EDGE_HANDLE_H / 2
          newRect = { x: cropRect.x, y: cropRect.y, width: cropRect.width, height: ny - cropRect.y }
          break
        }
        case "left": {
          const nx = node.x() + EDGE_HANDLE_H / 2
          newRect = { x: nx, y: cropRect.y, width: cropRect.x + cropRect.width - nx, height: cropRect.height }
          break
        }
        case "right": {
          const nx = node.x() + EDGE_HANDLE_H / 2
          newRect = { x: cropRect.x, y: cropRect.y, width: nx - cropRect.x, height: cropRect.height }
          break
        }
      }

      const constrained = constrainCropRect(newRect, imageBounds)
      onCropChange(constrained)
    },
    [cropRect, imageBounds, onCropChange]
  )

  const thirdW = cropRect.width / 3
  const thirdH = cropRect.height / 3
  const ab = artboardBounds

  return (
    <Group>
      {/* Dim overlay — covers entire artboard except crop rect */}
      <Rect x={ab.x} y={ab.y} width={ab.width} height={cropRect.y - ab.y} fill={DIM_COLOR} listening={false} />
      <Rect x={ab.x} y={cropRect.y + cropRect.height} width={ab.width} height={ab.y + ab.height - (cropRect.y + cropRect.height)} fill={DIM_COLOR} listening={false} />
      <Rect x={ab.x} y={cropRect.y} width={cropRect.x - ab.x} height={cropRect.height} fill={DIM_COLOR} listening={false} />
      <Rect x={cropRect.x + cropRect.width} y={cropRect.y} width={ab.x + ab.width - (cropRect.x + cropRect.width)} height={cropRect.height} fill={DIM_COLOR} listening={false} />

      {/* Draggable crop area — move cursor */}
      <Rect
        x={0}
        y={0}
        width={cropRect.width}
        height={cropRect.height}
        offsetX={-cropRect.x}
        offsetY={-cropRect.y}
        fill="transparent"
        draggable
        onDragStart={handleCropDragStart}
        onDragMove={handleCropDragMove}
        onDragEnd={handleCropDragEnd}
        onMouseEnter={() => emitCursor("move")}
        onMouseLeave={() => emitCursor("crosshair")}
      />

      {/* Crop border */}
      <Rect
        x={cropRect.x}
        y={cropRect.y}
        width={cropRect.width}
        height={cropRect.height}
        stroke={HANDLE_STROKE}
        strokeWidth={1.5}
        listening={false}
      />

      {/* Rule of thirds */}
      {[1, 2].map((i) => (
        <Line
          key={`v-${i}`}
          points={[cropRect.x + thirdW * i, cropRect.y, cropRect.x + thirdW * i, cropRect.y + cropRect.height]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.5}
          listening={false}
        />
      ))}
      {[1, 2].map((i) => (
        <Line
          key={`h-${i}`}
          points={[cropRect.x, cropRect.y + thirdH * i, cropRect.x + cropRect.width, cropRect.y + thirdH * i]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.5}
          listening={false}
        />
      ))}

      {/* Corner handles — diagonal resize cursors */}
      {CORNERS.map((corner) => {
        const pos = getCornerPos(corner, cropRect)
        return (
          <Rect
            key={corner}
            x={pos.x - HANDLE_SIZE / 2}
            y={pos.y - HANDLE_SIZE / 2}
            width={HANDLE_SIZE}
            height={HANDLE_SIZE}
            fill={HANDLE_COLOR}
            stroke={HANDLE_STROKE}
            strokeWidth={1.5}
            cornerRadius={2}
            shadowColor="rgba(0,0,0,0.2)"
            shadowBlur={3}
            shadowOffsetY={1}
            draggable
            onDragMove={(e) => handleCornerDrag(corner, e)}
            onMouseEnter={() => emitCursor(CORNER_CURSORS[corner])}
            onMouseLeave={() => emitCursor("crosshair")}
            dragBoundFunc={(pos) => ({
              x: Math.max(imageBounds.x - HANDLE_SIZE / 2, Math.min(imageBounds.x + imageBounds.width - HANDLE_SIZE / 2, pos.x)),
              y: Math.max(imageBounds.y - HANDLE_SIZE / 2, Math.min(imageBounds.y + imageBounds.height - HANDLE_SIZE / 2, pos.y)),
            })}
          />
        )
      })}

      {/* Edge handles — horizontal/vertical resize cursors */}
      {EDGES.map((edge) => {
        const pos = getEdgePos(edge, cropRect)
        const isHorizontal = edge === "top" || edge === "bottom"
        const w = isHorizontal ? EDGE_HANDLE_W : EDGE_HANDLE_H
        const h = isHorizontal ? EDGE_HANDLE_H : EDGE_HANDLE_W
        return (
          <Rect
            key={edge}
            x={pos.x - w / 2}
            y={pos.y - h / 2}
            width={w}
            height={h}
            fill={HANDLE_COLOR}
            stroke={HANDLE_STROKE}
            strokeWidth={1}
            cornerRadius={3}
            shadowColor="rgba(0,0,0,0.15)"
            shadowBlur={2}
            shadowOffsetY={1}
            draggable
            onDragMove={(e) => handleEdgeDrag(edge, e)}
            onMouseEnter={() => emitCursor(EDGE_CURSORS[edge])}
            onMouseLeave={() => emitCursor("crosshair")}
            dragBoundFunc={(pos) => {
              if (isHorizontal) {
                return {
                  x: pos.x,
                  y: Math.max(imageBounds.y - h / 2, Math.min(imageBounds.y + imageBounds.height - h / 2, pos.y)),
                }
              }
              return {
                x: Math.max(imageBounds.x - w / 2, Math.min(imageBounds.x + imageBounds.width - w / 2, pos.x)),
                y: pos.y,
              }
            }}
          />
        )
      })}
    </Group>
  )
}
