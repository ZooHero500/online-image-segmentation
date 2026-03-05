"use client"

import { useCallback, useMemo, useState } from "react"

const MIN_SCALE = 0.1
const MAX_SCALE = 10
const FIT_PADDING = 0.95 // 5% padding around image

interface UseCanvasViewportOptions {
  containerWidth: number
  containerHeight: number
  imageWidth: number
  imageHeight: number
}

interface UseCanvasViewportReturn {
  scale: number
  position: { x: number; y: number }
  zoomAtPoint: (screenX: number, screenY: number, factor: number) => void
  panBy: (dx: number, dy: number) => void
  fitToView: () => void
  resetTo100: () => void
  screenToWorld: (screenX: number, screenY: number) => { x: number; y: number }
  worldToScreen: (worldX: number, worldY: number) => { x: number; y: number }
  zoomPercent: number
}

function clampScale(s: number): number {
  return Math.max(MIN_SCALE, Math.min(MAX_SCALE, s))
}

function calculateFitScale(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number
): number {
  if (imageW <= 0 || imageH <= 0) return 1
  return Math.min(containerW / imageW, containerH / imageH) * FIT_PADDING
}

function calculateCenterPosition(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number
): { x: number; y: number } {
  return {
    x: (containerW - imageW * scale) / 2,
    y: (containerH - imageH * scale) / 2,
  }
}

interface ViewState {
  scale: number
  position: { x: number; y: number }
}

export function useCanvasViewport({
  containerWidth,
  containerHeight,
  imageWidth,
  imageHeight,
}: UseCanvasViewportOptions): UseCanvasViewportReturn {
  const fitScale = useMemo(
    () => calculateFitScale(containerWidth, containerHeight, imageWidth, imageHeight),
    [containerWidth, containerHeight, imageWidth, imageHeight]
  )

  const fitPosition = useMemo(
    () => calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, fitScale),
    [containerWidth, containerHeight, imageWidth, imageHeight, fitScale]
  )

  const [viewState, setViewState] = useState<ViewState>({
    scale: fitScale,
    position: fitPosition,
  })

  const { scale, position } = viewState

  const zoomAtPoint = useCallback(
    (screenX: number, screenY: number, factor: number) => {
      setViewState((prev) => {
        const newScale = clampScale(prev.scale * factor)
        const ratio = newScale / prev.scale
        return {
          scale: newScale,
          position: {
            x: screenX - (screenX - prev.position.x) * ratio,
            y: screenY - (screenY - prev.position.y) * ratio,
          },
        }
      })
    },
    []
  )

  const panBy = useCallback((dx: number, dy: number) => {
    setViewState((prev) => ({
      ...prev,
      position: { x: prev.position.x + dx, y: prev.position.y + dy },
    }))
  }, [])

  const fitToView = useCallback(() => {
    const s = calculateFitScale(containerWidth, containerHeight, imageWidth, imageHeight)
    setViewState({
      scale: s,
      position: calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, s),
    })
  }, [containerWidth, containerHeight, imageWidth, imageHeight])

  const resetTo100 = useCallback(() => {
    setViewState({
      scale: 1,
      position: calculateCenterPosition(containerWidth, containerHeight, imageWidth, imageHeight, 1),
    })
  }, [containerWidth, containerHeight, imageWidth, imageHeight])

  const screenToWorld = useCallback(
    (screenX: number, screenY: number) => ({
      x: (screenX - position.x) / scale,
      y: (screenY - position.y) / scale,
    }),
    [scale, position]
  )

  const worldToScreen = useCallback(
    (worldX: number, worldY: number) => ({
      x: worldX * scale + position.x,
      y: worldY * scale + position.y,
    }),
    [scale, position]
  )

  const zoomPercent = Math.round(scale * 100)

  return {
    scale,
    position,
    zoomAtPoint,
    panBy,
    fitToView,
    resetTo100,
    screenToWorld,
    worldToScreen,
    zoomPercent,
  }
}
