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

  const scaleRange = useMemo(() => {
    const scaleToFillW = frameSize.width / imageSize.width
    const scaleToFillH = frameSize.height / imageSize.height
    const minScale = Math.max(scaleToFillW, scaleToFillH)
    const maxScale = Math.max(minScale, 3)
    return { minScale, maxScale }
  }, [frameSize, imageSize])

  const clampOffset = useCallback(
    (ox: number, oy: number, s: number) => {
      const scaledW = imageSize.width * s
      const scaledH = imageSize.height * s
      const clampedX = Math.min(0, Math.max(frameSize.width - scaledW, ox))
      const clampedY = Math.min(0, Math.max(frameSize.height - scaledH, oy))
      return { x: clampedX, y: clampedY }
    },
    [imageSize, frameSize]
  )

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

  // Auto-reset when frameSize or imageSize changes
  useEffect(() => {
    if (imageSize.width > 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetToFit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSize.width, frameSize.height, imageSize.width, imageSize.height])

  const handleDrag = useCallback(
    (deltaX: number, deltaY: number) => {
      const clamped = clampOffset(offsetX + deltaX, offsetY + deltaY, scale)
      setOffsetX(clamped.x)
      setOffsetY(clamped.y)
    },
    [clampOffset, scale, offsetX, offsetY]
  )

  const handleZoom = useCallback(
    (delta: number, _centerX: number, _centerY: number) => {
      const { minScale, maxScale } = scaleRange
      // Use continuous delta for smooth trackpad zoom (clamp step to avoid huge jumps)
      const step = Math.sign(delta) * Math.min(Math.abs(delta), 50) * 0.002
      const newScale = Math.min(maxScale, Math.max(minScale, scale * (1 - step)))
      if (newScale === scale) return

      // Always zoom toward frame center for predictable behavior
      const cx = frameSize.width / 2
      const cy = frameSize.height / 2
      const ratio = newScale / scale
      const newOffsetX = cx - (cx - offsetX) * ratio
      const newOffsetY = cy - (cy - offsetY) * ratio
      const clamped = clampOffset(newOffsetX, newOffsetY, newScale)
      setScaleState(newScale)
      setOffsetX(clamped.x)
      setOffsetY(clamped.y)
    },
    [scale, offsetX, offsetY, scaleRange, clampOffset, frameSize]
  )

  const state: GridEditorState = { gridType, offsetX, offsetY, scale, withGap }

  return {
    state,
    frameSize,
    scaleRange,
    setGridType,
    setWithGap,
    handleDrag,
    handleZoom,
    resetToFit,
  }
}
