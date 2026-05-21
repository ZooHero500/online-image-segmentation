"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { ResizeImageTransform, CropRect, ResizeEditorMode } from "@/types"
import { calculateFillTransform, calculateFitTransform } from "@/lib/resize-utils"
import { useUndoRedo } from "@/hooks/use-undo-redo"

interface CanvasSize {
  width: number
  height: number
}

export type FitMode = "fill" | "fit"

interface UseResizeEditorReturn {
  canvasSize: CanvasSize
  setCanvasSize: (size: CanvasSize) => void
  image: HTMLImageElement | null
  transform: ResizeImageTransform
  setTransform: (t: ResizeImageTransform) => void
  mode: ResizeEditorMode
  setMode: (m: ResizeEditorMode) => void
  cropRect: CropRect | null
  setCropRect: (r: CropRect | null) => void
  loadImage: (file: File) => Promise<void>
  applyCrop: () => void
  cancelCrop: () => void
  resetImage: () => void
  clearImage: () => void
  fileName: string
  mimeType: string
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  // New: rotation/flip
  rotateLeft: () => void
  rotateRight: () => void
  flipHorizontal: () => void
  flipVertical: () => void
  // New: fit mode
  fitMode: FitMode
  setFitMode: (mode: FitMode) => void
  // New: alignment
  alignImage: (alignment: "center" | "left" | "right" | "top" | "bottom" | "fill") => void
}

const DEFAULT_TRANSFORM: ResizeImageTransform = {
  x: 0, y: 0, scale: 1, crop: null, rotation: 0, flipX: false, flipY: false,
}

export function useResizeEditor(
  initialWidth = 500,
  initialHeight = 500
): UseResizeEditorReturn {
  const [canvasSize, setCanvasSize] = useState<CanvasSize>({
    width: initialWidth,
    height: initialHeight,
  })
  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const {
    state: transform,
    setState: setTransform,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo<ResizeImageTransform>({
    initialState: DEFAULT_TRANSFORM,
  })
  const [mode, setMode] = useState<ResizeEditorMode>("idle")
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [fileName, setFileName] = useState("")
  const [mimeType, setMimeType] = useState("image/png")
  const [fitMode, setFitModeState] = useState<FitMode>("fill")
  const imageUrlRef = useRef<string | null>(null)

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current)
      }
    }
  }, [])

  const getEffectiveDimensions = useCallback(
    (img: HTMLImageElement, currentCrop: CropRect | null, rotation: number) => {
      let w = currentCrop ? currentCrop.width : img.naturalWidth
      let h = currentCrop ? currentCrop.height : img.naturalHeight
      // For 90/270 rotation, swap width/height for layout purposes
      if (rotation === 90 || rotation === 270) {
        ;[w, h] = [h, w]
      }
      return { w, h }
    },
    []
  )

  const fitImageToArtboard = useCallback(
    (img: HTMLImageElement, size: CanvasSize, currentCrop: CropRect | null, currentFitMode: FitMode = fitMode, rotation: number = 0, flipX: boolean = false, flipY: boolean = false) => {
      const { w: srcW, h: srcH } = getEffectiveDimensions(img, currentCrop, rotation)
      const calc = currentFitMode === "fill" ? calculateFillTransform : calculateFitTransform
      const result = calc(srcW, srcH, size.width, size.height)
      setTransform({ ...result, crop: currentCrop, rotation, flipX, flipY })
    },
    [fitMode, getEffectiveDimensions]
  )

  const loadImage = useCallback(
    async (file: File) => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current)
      }

      const url = URL.createObjectURL(file)
      imageUrlRef.current = url

      const img = new window.Image()
      img.src = url

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
      })

      setImage(img)
      setFileName(file.name)
      setMimeType(file.type || "image/png")
      setMode("idle")
      setCropRect(null)
      fitImageToArtboard(img, canvasSize, null, fitMode, 0, false, false)
    },
    [canvasSize, fitImageToArtboard, fitMode]
  )

  const applyCrop = useCallback(() => {
    if (!cropRect || !image) return

    // Current source dimensions (respects existing crop)
    const currentCrop = transform.crop
    const srcW = currentCrop ? currentCrop.width : image.naturalWidth
    const srcH = currentCrop ? currentCrop.height : image.naturalHeight
    const displayW = srcW * transform.scale
    const displayH = srcH * transform.scale

    // Convert crop rect from artboard coords to relative ratios
    const relX = (cropRect.x - transform.x) / displayW
    const relY = (cropRect.y - transform.y) / displayH
    const relW = cropRect.width / displayW
    const relH = cropRect.height / displayH

    // Map to source pixel coordinates
    const srcBaseX = currentCrop ? currentCrop.x : 0
    const srcBaseY = currentCrop ? currentCrop.y : 0

    const newCrop: CropRect = {
      x: srcBaseX + relX * srcW,
      y: srcBaseY + relY * srcH,
      width: relW * srcW,
      height: relH * srcH,
    }

    setCropRect(null)
    setMode("idle")
    fitImageToArtboard(image, canvasSize, newCrop, fitMode, transform.rotation, transform.flipX, transform.flipY)
  }, [cropRect, image, transform, canvasSize, fitImageToArtboard, fitMode])

  const cancelCrop = useCallback(() => {
    setCropRect(null)
    setMode("selected")
  }, [])

  const resetImage = useCallback(() => {
    if (!image) return
    setMode("idle")
    setCropRect(null)
    fitImageToArtboard(image, canvasSize, null, fitMode, 0, false, false)
  }, [image, canvasSize, fitImageToArtboard, fitMode])

  const clearImage = useCallback(() => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
    }
    setImage(null)
    setTransform(DEFAULT_TRANSFORM)
    setMode("idle")
    setCropRect(null)
    setFileName("")
    setMimeType("image/png")
  }, [])

  const handleSetCanvasSize = useCallback(
    (size: CanvasSize) => {
      setCanvasSize(size)
      if (image) {
        fitImageToArtboard(image, size, transform.crop, fitMode, transform.rotation, transform.flipX, transform.flipY)
      }
    },
    [image, transform.crop, transform.rotation, transform.flipX, transform.flipY, fitImageToArtboard, fitMode]
  )

  // Rotation
  const rotateLeft = useCallback(() => {
    if (!image) return
    const newRotation = ((transform.rotation - 90) + 360) % 360
    fitImageToArtboard(image, canvasSize, transform.crop, fitMode, newRotation, transform.flipX, transform.flipY)
  }, [image, transform, canvasSize, fitImageToArtboard, fitMode])

  const rotateRight = useCallback(() => {
    if (!image) return
    const newRotation = (transform.rotation + 90) % 360
    fitImageToArtboard(image, canvasSize, transform.crop, fitMode, newRotation, transform.flipX, transform.flipY)
  }, [image, transform, canvasSize, fitImageToArtboard, fitMode])

  // Flip
  const flipHorizontal = useCallback(() => {
    setTransform({ ...transform, flipX: !transform.flipX })
  }, [transform, setTransform])

  const flipVertical = useCallback(() => {
    setTransform({ ...transform, flipY: !transform.flipY })
  }, [transform, setTransform])

  // Fit mode
  const setFitMode = useCallback(
    (newMode: FitMode) => {
      setFitModeState(newMode)
      if (image) {
        fitImageToArtboard(image, canvasSize, transform.crop, newMode, transform.rotation, transform.flipX, transform.flipY)
      }
    },
    [image, canvasSize, transform, fitImageToArtboard]
  )

  // Alignment
  const alignImage = useCallback(
    (alignment: "center" | "left" | "right" | "top" | "bottom" | "fill") => {
      if (!image) return
      const { w: srcW, h: srcH } = getEffectiveDimensions(image, transform.crop, transform.rotation)
      const imgW = srcW * transform.scale
      const imgH = srcH * transform.scale

      let newX = transform.x
      let newY = transform.y
      let newScale = transform.scale

      switch (alignment) {
        case "center":
          newX = (canvasSize.width - imgW) / 2
          newY = (canvasSize.height - imgH) / 2
          break
        case "left":
          newX = 0
          break
        case "right":
          newX = canvasSize.width - imgW
          break
        case "top":
          newY = 0
          break
        case "bottom":
          newY = canvasSize.height - imgH
          break
        case "fill": {
          const fillResult = calculateFillTransform(srcW, srcH, canvasSize.width, canvasSize.height)
          newX = fillResult.x
          newY = fillResult.y
          newScale = fillResult.scale
          break
        }
      }

      setTransform({ ...transform, x: newX, y: newY, scale: newScale })
    },
    [image, transform, canvasSize, setTransform, getEffectiveDimensions]
  )

  return {
    canvasSize,
    setCanvasSize: handleSetCanvasSize,
    image,
    transform,
    setTransform,
    mode,
    setMode,
    cropRect,
    setCropRect,
    loadImage,
    applyCrop,
    cancelCrop,
    resetImage,
    clearImage,
    fileName,
    mimeType,
    undo,
    redo,
    canUndo,
    canRedo,
    rotateLeft,
    rotateRight,
    flipHorizontal,
    flipVertical,
    fitMode,
    setFitMode,
    alignImage,
  }
}
