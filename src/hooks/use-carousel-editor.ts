"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
import {
  clampSlideCount, getCompositeAspect,
  type AspectPreset, type CarouselEditorState,
} from "@/lib/carousel-splitter"

interface Size { width: number; height: number }

// Minimal HTMLImageElement-like shape so geometry can be computed without a real <img>.
function asImage(size: Size): HTMLImageElement {
  return { naturalWidth: size.width, naturalHeight: size.height } as HTMLImageElement
}

export function useCarouselEditor(imageSize: Size, containerSize: Size) {
  const [slideCount, setSlideCountState] = useState(3)
  const [aspect, setAspectState] = useState<AspectPreset>("4:5")
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [scale, setScaleState] = useState(1)

  const frameSize = useMemo<Size>(() => {
    const aspectRatio = getCompositeAspect(aspect, asImage(imageSize), slideCount)
    const maxW = containerSize.width
    const maxH = containerSize.height
    let w: number, h: number
    if (aspectRatio >= 1) {
      w = maxW; h = maxW / aspectRatio
      if (h > maxH) { h = maxH; w = maxH * aspectRatio }
    } else {
      h = maxH; w = maxH * aspectRatio
      if (w > maxW) { w = maxW; h = maxW / aspectRatio }
    }
    return { width: Math.round(w), height: Math.round(h) }
  }, [aspect, slideCount, imageSize, containerSize.width, containerSize.height])

  const scaleRange = useMemo(() => {
    const scaleToFillW = frameSize.width / imageSize.width
    const scaleToFillH = frameSize.height / imageSize.height
    const minScale = Math.max(scaleToFillW, scaleToFillH)
    const maxScale = Math.max(minScale * 3, 3)
    return { minScale, maxScale }
  }, [frameSize, imageSize])

  const resetToFit = useCallback(() => {
    const { minScale } = scaleRange
    setScaleState(minScale)
    const scaledW = imageSize.width * minScale
    const scaledH = imageSize.height * minScale
    setOffsetX((frameSize.width - scaledW) / 2)
    setOffsetY((frameSize.height - scaledH) / 2)
  }, [scaleRange, imageSize, frameSize])

  const setSlideCount = useCallback((n: number) => setSlideCountState(clampSlideCount(n)), [])
  const setAspect = useCallback((a: AspectPreset) => setAspectState(a), [])

  useEffect(() => {
    if (imageSize.width > 1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetToFit()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameSize.width, frameSize.height, imageSize.width, imageSize.height])

  const setOffset = useCallback((x: number, y: number) => { setOffsetX(x); setOffsetY(y) }, [])

  const handleScale = useCallback((newScale: number) => {
    const { minScale, maxScale } = scaleRange
    const clamped = Math.min(maxScale, Math.max(minScale, newScale))
    if (clamped === scale) return
    const cx = frameSize.width / 2
    const cy = frameSize.height / 2
    const ratio = clamped / scale
    const newOX = cx - (cx - offsetX) * ratio
    const newOY = cy - (cy - offsetY) * ratio
    const scaledW = imageSize.width * clamped
    const scaledH = imageSize.height * clamped
    const clampedX = Math.min(0, Math.max(frameSize.width - scaledW, newOX))
    const clampedY = Math.min(0, Math.max(frameSize.height - scaledH, newOY))
    setScaleState(clamped); setOffsetX(clampedX); setOffsetY(clampedY)
  }, [scale, offsetX, offsetY, scaleRange, frameSize, imageSize])

  const state: CarouselEditorState = { slideCount, aspect, offsetX, offsetY, scale }

  return { state, frameSize, scaleRange, setSlideCount, setAspect, setOffset, handleScale, resetToFit }
}
