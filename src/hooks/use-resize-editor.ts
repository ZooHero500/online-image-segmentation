"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import type { ResizeImageTransform, CropRect, ResizeEditorMode } from "@/types"
import { calculateFillTransform } from "@/lib/resize-utils"
import { useUndoRedo } from "@/hooks/use-undo-redo"

interface CanvasSize {
  width: number
  height: number
}

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
    initialState: { x: 0, y: 0, scale: 1, crop: null },
  })
  const [mode, setMode] = useState<ResizeEditorMode>("idle")
  const [cropRect, setCropRect] = useState<CropRect | null>(null)
  const [fileName, setFileName] = useState("")
  const [mimeType, setMimeType] = useState("image/png")
  const imageUrlRef = useRef<string | null>(null)

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (imageUrlRef.current) {
        URL.revokeObjectURL(imageUrlRef.current)
      }
    }
  }, [])

  const fitImageToArtboard = useCallback(
    (img: HTMLImageElement, size: CanvasSize, currentCrop: CropRect | null) => {
      const srcW = currentCrop ? currentCrop.width : img.naturalWidth
      const srcH = currentCrop ? currentCrop.height : img.naturalHeight
      const fill = calculateFillTransform(srcW, srcH, size.width, size.height)
      setTransform({ ...fill, crop: currentCrop })
    },
    []
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
      fitImageToArtboard(img, canvasSize, null)
    },
    [canvasSize, fitImageToArtboard]
  )

  const applyCrop = useCallback(() => {
    if (!cropRect || !image) return

    // In crop mode, the canvas always shows the FULL uncropped image
    // so crop rect is always relative to the full image display
    const fullW = image.naturalWidth * transform.scale
    const fullH = image.naturalHeight * transform.scale

    const relX = (cropRect.x - transform.x) / fullW
    const relY = (cropRect.y - transform.y) / fullH
    const relW = cropRect.width / fullW
    const relH = cropRect.height / fullH

    const newCrop: CropRect = {
      x: relX * image.naturalWidth,
      y: relY * image.naturalHeight,
      width: relW * image.naturalWidth,
      height: relH * image.naturalHeight,
    }

    setCropRect(null)
    setMode("idle")
    fitImageToArtboard(image, canvasSize, newCrop)
  }, [cropRect, image, transform, canvasSize, fitImageToArtboard])

  const cancelCrop = useCallback(() => {
    setCropRect(null)
    setMode("selected")
  }, [])

  const resetImage = useCallback(() => {
    if (!image) return
    setMode("idle")
    setCropRect(null)
    fitImageToArtboard(image, canvasSize, null)
  }, [image, canvasSize, fitImageToArtboard])

  const clearImage = useCallback(() => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current)
      imageUrlRef.current = null
    }
    setImage(null)
    setTransform({ x: 0, y: 0, scale: 1, crop: null })
    setMode("idle")
    setCropRect(null)
    setFileName("")
    setMimeType("image/png")
  }, [])

  const handleSetCanvasSize = useCallback(
    (size: CanvasSize) => {
      setCanvasSize(size)
      if (image) {
        fitImageToArtboard(image, size, transform.crop)
      }
    },
    [image, transform.crop, fitImageToArtboard]
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
  }
}
