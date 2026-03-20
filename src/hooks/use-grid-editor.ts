"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import { getGridConfig, type GridType, type GridEditorState } from "@/lib/grid-splitter"

interface ImageSize {
  width: number
  height: number
}

interface FrameSize {
  width: number
  height: number
}

export function useGridEditor(
  imageSize: ImageSize,
  containerSize: ImageSize
) {
  const [gridType, setGridTypeState] = useState<GridType>("3x3")
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScaleState] = useState(1)
  const [withGap, setWithGap] = useState(false)

  // Frame size based on grid type aspect ratio, fit within container
  const frameSize = useMemo<FrameSize>(() => {
    const { aspectRatio } = getGridConfig(gridType)
    const maxW = containerSize.width
    const maxH = containerSize.height
    let w: number, h: number
    if (aspectRatio >= 1) {
      w = maxW
      h = maxW / aspectRatio
      if (h > maxH) { h = maxH; w = maxH * aspectRatio }
    } else {
      h = maxH
      w = maxH * aspectRatio
      if (w > maxW) { w = maxW; h = maxW / aspectRatio }
    }
    return { width: Math.round(w), height: Math.round(h) }
  }, [gridType, containerSize.width, containerSize.height])

  // Scale range: min = image must fill frame, max = 3x
  const scaleRange = useMemo(() => {
    const scaleToFillW = frameSize.width / imageSize.width
    const scaleToFillH = frameSize.height / imageSize.height
    const minScale = Math.max(scaleToFillW, scaleToFillH)
    const maxScale = Math.max(minScale * 3, 3)
    return { minScale, maxScale }
  }, [frameSize, imageSize])

  // Reset: fit image centered at minScale
  const resetToFit = useCallback(() => {
    const { minScale } = scaleRange
    setScaleState(minScale)
    const scaledW = imageSize.width * minScale
    const scaledH = imageSize.height * minScale
    setOffsetX((frameSize.width - scaledW) / 2)
    setOffsetY((frameSize.height - scaledH) / 2)
  }, [scaleRange, imageSize, frameSize])

  const setGridType = useCallback((type: GridType) => {
    setGridTypeState(type)
  }, [])

  // Auto-reset when frame or image changes
  useEffect(() => {
    if (imageSize.width > 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetToFit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSize.width, frameSize.height, imageSize.width, imageSize.height])

  // Called by Konva onDragEnd
  const setOffset = useCallback((x: number, y: number) => {
    setOffsetX(x)
    setOffsetY(y)
  }, [])

  // Called by zoom slider — scale toward frame center, clamp offset
  const handleScale = useCallback(
    (newScale: number) => {
      const { minScale, maxScale } = scaleRange
      const clamped = Math.min(maxScale, Math.max(minScale, newScale))
      if (clamped === scale) return

      // Re-center: scale toward frame center
      const cx = frameSize.width / 2
      const cy = frameSize.height / 2
      const ratio = clamped / scale
      const newOX = cx - (cx - offsetX) * ratio
      const newOY = cy - (cy - offsetY) * ratio

      // Clamp offset
      const scaledW = imageSize.width * clamped
      const scaledH = imageSize.height * clamped
      const clampedX = Math.min(0, Math.max(frameSize.width - scaledW, newOX))
      const clampedY = Math.min(0, Math.max(frameSize.height - scaledH, newOY))

      setScaleState(clamped)
      setOffsetX(clampedX)
      setOffsetY(clampedY)
    },
    [scale, offsetX, offsetY, scaleRange, frameSize, imageSize]
  )

  const state: GridEditorState = { gridType, offsetX, offsetY, scale, withGap }

  return {
    state,
    frameSize,
    scaleRange,
    setGridType,
    setWithGap,
    setOffset,
    handleScale,
    resetToFit,
  }
}
