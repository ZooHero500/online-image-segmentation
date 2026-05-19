"use client"

import { useCallback } from "react"
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
  onCropChange: (rect: CropRect) => void
}

const HANDLE_SIZE = 12
const HANDLE_COLOR = "#ffffff"
const HANDLE_STROKE = "#0066ff"
const DIM_COLOR = "rgba(0, 0, 0, 0.5)"

const CORNERS = ["top-left", "top-right", "bottom-left", "bottom-right"] as const
type Corner = (typeof CORNERS)[number]

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

export function CropOverlay({
  cropRect,
  imageBounds,
  onCropChange,
}: CropOverlayProps) {
  const handleCornerDrag = useCallback(
    (corner: Corner, e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target
      const nx = node.x() + HANDLE_SIZE / 2
      const ny = node.y() + HANDLE_SIZE / 2

      let newRect: CropRect

      switch (corner) {
        case "top-left":
          newRect = {
            x: nx,
            y: ny,
            width: cropRect.x + cropRect.width - nx,
            height: cropRect.y + cropRect.height - ny,
          }
          break
        case "top-right":
          newRect = {
            x: cropRect.x,
            y: ny,
            width: nx - cropRect.x,
            height: cropRect.y + cropRect.height - ny,
          }
          break
        case "bottom-left":
          newRect = {
            x: nx,
            y: cropRect.y,
            width: cropRect.x + cropRect.width - nx,
            height: ny - cropRect.y,
          }
          break
        case "bottom-right":
          newRect = {
            x: cropRect.x,
            y: cropRect.y,
            width: nx - cropRect.x,
            height: ny - cropRect.y,
          }
          break
      }

      const constrained = constrainCropRect(newRect, imageBounds)
      onCropChange(constrained)
    },
    [cropRect, imageBounds, onCropChange]
  )

  const thirdW = cropRect.width / 3
  const thirdH = cropRect.height / 3

  return (
    <Group>
      {/* Dim overlay — four rectangles around crop rect */}
      <Rect
        x={imageBounds.x}
        y={imageBounds.y}
        width={imageBounds.width}
        height={cropRect.y - imageBounds.y}
        fill={DIM_COLOR}
        listening={false}
      />
      <Rect
        x={imageBounds.x}
        y={cropRect.y + cropRect.height}
        width={imageBounds.width}
        height={imageBounds.y + imageBounds.height - (cropRect.y + cropRect.height)}
        fill={DIM_COLOR}
        listening={false}
      />
      <Rect
        x={imageBounds.x}
        y={cropRect.y}
        width={cropRect.x - imageBounds.x}
        height={cropRect.height}
        fill={DIM_COLOR}
        listening={false}
      />
      <Rect
        x={cropRect.x + cropRect.width}
        y={cropRect.y}
        width={imageBounds.x + imageBounds.width - (cropRect.x + cropRect.width)}
        height={cropRect.height}
        fill={DIM_COLOR}
        listening={false}
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
          points={[
            cropRect.x + thirdW * i,
            cropRect.y,
            cropRect.x + thirdW * i,
            cropRect.y + cropRect.height,
          ]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.5}
          listening={false}
        />
      ))}
      {[1, 2].map((i) => (
        <Line
          key={`h-${i}`}
          points={[
            cropRect.x,
            cropRect.y + thirdH * i,
            cropRect.x + cropRect.width,
            cropRect.y + thirdH * i,
          ]}
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={0.5}
          listening={false}
        />
      ))}

      {/* Corner handles */}
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
            dragBoundFunc={(pos) => ({
              x: Math.max(
                imageBounds.x - HANDLE_SIZE / 2,
                Math.min(imageBounds.x + imageBounds.width - HANDLE_SIZE / 2, pos.x)
              ),
              y: Math.max(
                imageBounds.y - HANDLE_SIZE / 2,
                Math.min(imageBounds.y + imageBounds.height - HANDLE_SIZE / 2, pos.y)
              ),
            })}
          />
        )
      })}
    </Group>
  )
}
